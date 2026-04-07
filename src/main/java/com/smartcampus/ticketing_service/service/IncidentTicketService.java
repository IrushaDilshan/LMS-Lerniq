package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.TicketCreateRequest;
import com.smartcampus.ticketing_service.dto.TicketResponse;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.model.IncidentTicket;
import com.smartcampus.ticketing_service.model.TicketStatus;
import com.smartcampus.ticketing_service.repository.IncidentTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final FileStorageService fileStorageService;

    public IncidentTicketService(IncidentTicketRepository ticketRepository, FileStorageService fileStorageService) {
        this.ticketRepository = ticketRepository;
        this.fileStorageService = fileStorageService;
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
        }
        
        ticket.setAttachmentUrls(imageUrls);
        ticket = ticketRepository.save(ticket);

        return mapToResponse(ticket);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    public TicketResponse getTicketById(Long id) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        return mapToResponse(ticket);
    }

    public TicketResponse updateTicketStatus(Long id, TicketStatus newStatus) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        ticket.setStatus(newStatus);
        ticket = ticketRepository.save(ticket);
        return mapToResponse(ticket);
    }

    private TicketResponse mapToResponse(IncidentTicket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setResourceLocation(ticket.getResourceLocation());
        response.setCategory(ticket.getCategory());
        response.setDescription(ticket.getDescription());
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
