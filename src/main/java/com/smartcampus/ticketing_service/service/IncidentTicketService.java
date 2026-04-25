package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.AssignTechnicianRequest;
import com.smartcampus.ticketing_service.dto.TicketCreateRequest;
import com.smartcampus.ticketing_service.dto.TicketResponse;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.exception.UnauthorizedException;
import com.smartcampus.ticketing_service.model.IncidentTicket;
import com.smartcampus.ticketing_service.model.TicketStatus;
import com.smartcampus.ticketing_service.model.TicketComment;
import com.smartcampus.ticketing_service.repository.IncidentTicketRepository;
import com.smartcampus.ticketing_service.dto.TicketStatusUpdateRequest;
import com.smartcampus.ticketing_service.dto.CommentCreateRequest;
import com.smartcampus.ticketing_service.dto.CommentResponse;
import com.smartcampus.ticketing_service.dto.TicketUpdateRequest;
import com.smartcampus.ticketing_service.dto.TicketFeedbackRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;

    public IncidentTicketService(IncidentTicketRepository ticketRepository, FileStorageService fileStorageService, EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.fileStorageService = fileStorageService;
        this.emailService = emailService;
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
        ticket.setContactEmail(request.getContactEmail());
        ticket.setContactPhone(request.getContactPhone());
        ticket.setCreatedByUserId(request.getCreatedByUserId());
        ticket.setCreatedByEmail(request.getCreatedByEmail());
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

        try {
            String recipient = ticket.getCreatedByEmail();
            
            // Smart Fallback: If Email field is empty, check Contact Details for an @ email
            if (recipient == null || recipient.trim().isEmpty()) {
                String contact = ticket.getContactEmail();
                if (contact == null || contact.trim().isEmpty()) {
                    contact = ticket.getPreferredContactDetails();
                }
                if (contact != null && contact.contains("@")) {
                    recipient = contact;
                }
            }

            System.out.println("DEBUG: Final Recipient for Notification: [" + recipient + "]");
            
            if (recipient != null && !recipient.trim().isEmpty() && recipient.contains("@")) {
                emailService.sendTicketCreatedEmail(recipient, ticket.getId(), ticket.getCategory());
            } else {
                System.out.println("No valid email provided for ticket " + ticket.getId() + " (Value: " + recipient + ")");
            }
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
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

        try {
            String recipient = ticket.getCreatedByEmail();
            
            // Smart Fallback: If Email field is empty, check Contact Details for an @ email
            if (recipient == null || recipient.trim().isEmpty()) {
                String contact = ticket.getContactEmail();
                if (contact == null || contact.trim().isEmpty()) {
                    contact = ticket.getPreferredContactDetails();
                }
                if (contact != null && contact.contains("@")) {
                    recipient = contact;
                }
            }
            
            if (recipient != null && recipient.contains("@")) {
                emailService.sendTicketStatusUpdatedEmail(recipient, ticket.getId(), ticket.getCategory(), ticket.getStatus().name());
            }
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }

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
        return mapToResponse(ticket);
    }

    public TicketResponse submitFeedback(String id, TicketFeedbackRequest request) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        if (ticket.getStatus() != TicketStatus.RESOLVED && ticket.getStatus() != TicketStatus.CLOSED) {
            throw new IllegalStateException("Feedback can only be submitted for RESOLVED or CLOSED tickets.");
        }

        ticket.setRating(request.getRating());
        ticket.setFeedbackComment(request.getFeedbackComment());
        
        ticket = ticketRepository.save(ticket);
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
        response.setContactEmail(ticket.getContactEmail());
        response.setContactPhone(ticket.getContactPhone());
        response.setStatus(ticket.getStatus());
        response.setAttachmentUrls(ticket.getAttachmentUrls());
        response.setCreatedByUserId(ticket.getCreatedByUserId());
        response.setCreatedByEmail(ticket.getCreatedByEmail());
        response.setRating(ticket.getRating());
        response.setFeedbackComment(ticket.getFeedbackComment());
        response.setAssignedTechnicianId(ticket.getAssignedTechnicianId());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        return response;
    }
}
