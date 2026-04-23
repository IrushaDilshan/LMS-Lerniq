package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.AssignTechnicianRequest;
import com.smartcampus.ticketing_service.dto.TicketCreateRequest;
import com.smartcampus.ticketing_service.dto.TicketResponse;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.exception.UnauthorizedException;
import com.smartcampus.ticketing_service.model.IncidentTicket;
import com.smartcampus.ticketing_service.model.NotificationType;
import com.smartcampus.ticketing_service.model.TicketStatus;
import com.smartcampus.ticketing_service.model.TicketComment;
import com.smartcampus.ticketing_service.repository.IncidentTicketRepository;
import com.smartcampus.ticketing_service.dto.TicketStatusUpdateRequest;
import com.smartcampus.ticketing_service.dto.CommentCreateRequest;
import com.smartcampus.ticketing_service.dto.CommentResponse;
import com.smartcampus.ticketing_service.dto.TicketUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    public IncidentTicketService(
            IncidentTicketRepository ticketRepository,
            FileStorageService fileStorageService,
            NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.fileStorageService = fileStorageService;
        this.notificationService = notificationService;
    }

    public TicketResponse createTicket(TicketCreateRequest request, List<MultipartFile> files) {
        if (files != null && files.size() > 3) {
            throw new IllegalArgumentException("Maximum of 3 image attachments allowed per ticket.");
        }

        IncidentTicket ticket = new IncidentTicket();
        ticket.setResourceLocation(request.getResourceLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContactDetails(request.getPreferredContactDetails());
        ticket.setCreatedByUserId(request.getCreatedByUserId());
        ticket.setStatus(TicketStatus.OPEN);

        // Save first to get ID for file prefix
        ticket = ticketRepository.save(ticket);

        List<String> imageUrls = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String prefix = "ticket_" + ticket.getId();
                    String savedPath = fileStorageService.storeFile(file, prefix);
                    imageUrls.add(savedPath);
                }
            }
            ticket.setAttachmentUrls(imageUrls);
            ticket = ticketRepository.save(ticket);
        }

        return mapToResponse(ticket);
    }

    public List<TicketResponse> getAllTickets(TicketStatus status, Long userId) {
        List<IncidentTicket> tickets;

        if (status != null && userId != null) {
            tickets = ticketRepository.findByStatusAndCreatedByUserId(status, userId);
        } else if (status != null) {
            tickets = ticketRepository.findByStatus(status);
        } else if (userId != null) {
            tickets = ticketRepository.findByCreatedByUserId(userId);
        } else {
            tickets = ticketRepository.findAll();
        }

        return tickets.stream().map(this::mapToResponse).toList();
    }

    public TicketResponse getTicketById(String id) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        return mapToResponse(ticket);
    }

    public TicketResponse updateTicketStatus(String id, TicketStatusUpdateRequest updateRequest) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        ticket.setStatus(updateRequest.getStatus());
        if (updateRequest.getResolutionNote() != null) {
            ticket.setResolutionNote(updateRequest.getResolutionNote());
        }
        if (updateRequest.getRejectionReason() != null) {
            ticket.setRejectionReason(updateRequest.getRejectionReason());
        }
        ticket = ticketRepository.save(ticket);
        notificationService.createNotification(
                ticket.getCreatedByUserId(),
                NotificationType.TICKET_STATUS_CHANGED,
                "Ticket Status Updated",
                "Your ticket " + ticket.getId() + " moved to " + ticket.getStatus() + ".",
                ticket.getId());
        return mapToResponse(ticket);
    }

    public TicketResponse updateTicket(String id, TicketUpdateRequest request, Long requestingUserId) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        
        if (!ticket.getCreatedByUserId().equals(requestingUserId)) {
            throw new UnauthorizedException("You are not authorized to edit this ticket as you are not the author.");
        }

        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalArgumentException("Tickets can only be edited while they are in OPEN status.");
        }

        ticket.setResourceLocation(request.getResourceLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContactDetails(request.getPreferredContactDetails());

        ticket = ticketRepository.save(ticket);
        return mapToResponse(ticket);
    }

    public void deleteTicket(String id, Long requestingUserId) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        
        if (!ticket.getCreatedByUserId().equals(requestingUserId)) {
            throw new UnauthorizedException("You are not authorized to delete this ticket as you are not the author.");
        }

        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalArgumentException("Tickets can only be deleted while they are in OPEN status.");
        }

        ticketRepository.delete(ticket);
    }

    public TicketResponse assignTechnician(String id, AssignTechnicianRequest request) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        ticket.setAssignedTechnicianId(request.getTechnicianId());
        ticket = ticketRepository.save(ticket);
        notificationService.createNotification(
                request.getTechnicianId(),
                NotificationType.TICKET_ASSIGNED,
                "New Ticket Assigned",
                "Ticket " + ticket.getId() + " was assigned to you.",
                ticket.getId());
        return mapToResponse(ticket);
    }

    public List<CommentResponse> getComments(String ticketId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        return ticket.getComments().stream()
                .sorted((c1, c2) -> c1.getCreatedAt().compareTo(c2.getCreatedAt()))
                .map(this::mapToCommentResponse).toList();
    }

    public CommentResponse addComment(String ticketId, CommentCreateRequest request) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        TicketComment comment = new TicketComment();
        comment.setContent(request.getContent());
        comment.setCreatedByUserId(request.getCreatedByUserId());
        
        ticket.getComments().add(comment);
        ticketRepository.save(ticket);
        if (!request.getCreatedByUserId().equals(ticket.getCreatedByUserId())) {
            notificationService.createNotification(
                    ticket.getCreatedByUserId(),
                    NotificationType.TICKET_COMMENT_ADDED,
                    "New Comment Added",
                    "A new comment was added to ticket " + ticket.getId() + ".",
                    ticket.getId());
        }
        
        return mapToCommentResponse(comment);
    }

    public void deleteComment(String ticketId, String commentId, Long requestingUserId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getCreatedByUserId().equals(requestingUserId)) {
            throw new UnauthorizedException("You can only delete your own comments.");
        }

        ticket.getComments().removeIf(c -> c.getId().equals(commentId));
        ticketRepository.save(ticket);
    }

    private CommentResponse mapToCommentResponse(TicketComment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCreatedByUserId(comment.getCreatedByUserId());
        response.setCreatedAt(comment.getCreatedAt());
        if (comment.getCreatedByUserId() != null) {
            if (comment.getCreatedByUserId() == 1L) {
                response.setAuthorName("Student User");
            } else if (comment.getCreatedByUserId() == 99L) {
                response.setAuthorName("Admin Manager");
            } else if (comment.getCreatedByUserId() == 10L) {
                response.setAuthorName("John Doe (Tech)");
            } else {
                response.setAuthorName("User " + comment.getCreatedByUserId());
            }
        } else {
            response.setAuthorName("Unknown System User");
        }
        
        return response;
    }

    private TicketResponse mapToResponse(IncidentTicket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setResourceLocation(ticket.getResourceLocation());
        response.setCategory(ticket.getCategory());
        response.setDescription(ticket.getDescription());
        response.setResolutionNote(ticket.getResolutionNote());
        response.setRejectionReason(ticket.getRejectionReason());
        response.setPriority(ticket.getPriority());
        response.setPreferredContactDetails(ticket.getPreferredContactDetails());
        response.setStatus(ticket.getStatus());
        response.setAttachmentUrls(ticket.getAttachmentUrls());
        response.setCreatedByUserId(ticket.getCreatedByUserId());
        response.setAssignedTechnicianId(ticket.getAssignedTechnicianId());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        return response;
    }
}
