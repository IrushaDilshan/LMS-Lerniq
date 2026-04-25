package com.smartcampus.ticketing_service.controller;

import com.smartcampus.ticketing_service.dto.AssignTechnicianRequest;
import com.smartcampus.ticketing_service.dto.TicketCreateRequest;
import com.smartcampus.ticketing_service.dto.TicketResponse;
import com.smartcampus.ticketing_service.dto.TicketStatusUpdateRequest;
import com.smartcampus.ticketing_service.dto.TicketUpdateRequest;
import com.smartcampus.ticketing_service.dto.CommentCreateRequest;
import com.smartcampus.ticketing_service.dto.CommentResponse;
import com.smartcampus.ticketing_service.model.TicketStatus;
import com.smartcampus.ticketing_service.service.IncidentTicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/tickets")
public class IncidentTicketController {

    private final IncidentTicketService ticketService;

    public IncidentTicketController(IncidentTicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<?> createTicket(
            @Valid @RequestPart("ticket") TicketCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        try {
            TicketResponse created = ticketService.createTicket(request, files);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(ticketService.getAllTickets(status, userId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable String id,
            @RequestBody TicketStatusUpdateRequest request) {
        TicketResponse updated = ticketService.updateTicketStatus(id, request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String id,
            @RequestParam Long requestingUserId,
            @Valid @RequestBody TicketUpdateRequest request) {
        TicketResponse updated = ticketService.updateTicket(id, request, requestingUserId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable String id,
            @RequestParam Long requestingUserId) {
        ticketService.deleteTicket(id, requestingUserId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignTechnician(
            @PathVariable String id,
            @Valid @RequestBody AssignTechnicianRequest request) {
        try {
            TicketResponse updated = ticketService.assignTechnician(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<List<CommentResponse>> getTicketComments(@PathVariable String id) {
        List<CommentResponse> comments = ticketService.getComments(id);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<?> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentCreateRequest request) {
        try {
            CommentResponse comment = ticketService.addComment(id, request);
            return new ResponseEntity<>(comment, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam Long requestingUserId) {
        ticketService.deleteComment(ticketId, commentId, requestingUserId);
        return ResponseEntity.noContent().build(); // 204
    }
}
