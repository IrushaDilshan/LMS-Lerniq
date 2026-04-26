package com.smartcampus.ticketing_service.controller;

import com.smartcampus.ticketing_service.dto.BookingCreateRequest;
import com.smartcampus.ticketing_service.dto.BookingResponse;
import com.smartcampus.ticketing_service.dto.BookingReviewRequest;
import com.smartcampus.ticketing_service.dto.BookingUpdateRequest;
import com.smartcampus.ticketing_service.dto.RepeatBookingRequest;
import com.smartcampus.ticketing_service.model.BookingStatus;
import com.smartcampus.ticketing_service.service.ResourceBookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/bookings")
public class ResourceBookingController {

    private final ResourceBookingService bookingService;

    public ResourceBookingController(ResourceBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingCreateRequest request) {
        BookingResponse created = bookingService.createBooking(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            @RequestParam Long requestingUserId,
            @RequestParam String requestingRole,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String resourceName,
            @RequestParam(required = false) LocalDate bookingDate) {
        return ResponseEntity.ok(bookingService.getBookings(requestingUserId, requestingRole, status, resourceName, bookingDate));
    }

    @PutMapping("/{bookingId}/review")
    public ResponseEntity<BookingResponse> reviewBooking(
            @PathVariable String bookingId,
            @RequestParam String requestingRole,
            @Valid @RequestBody BookingReviewRequest request) {
        return ResponseEntity.ok(bookingService.reviewBooking(bookingId, request, requestingRole));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable String bookingId,
            @RequestParam Long requestingUserId,
            @RequestParam String requestingRole,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, requestingUserId, requestingRole, reason));
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable String bookingId,
            @RequestParam Long requestingUserId,
            @RequestParam String requestingRole,
            @Valid @RequestBody BookingUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(bookingId, requestingUserId, requestingRole, request));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable String bookingId,
            @RequestParam Long requestingUserId,
            @RequestParam String requestingRole) {
        bookingService.deleteBooking(bookingId, requestingUserId, requestingRole);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/repeat")
    public ResponseEntity<List<BookingResponse>> repeatBooking(
            @RequestParam Long requestingUserId,
            @RequestParam String requestingRole,
            @Valid @RequestBody RepeatBookingRequest request) {
        return new ResponseEntity<>(
                bookingService.repeatBooking(requestingUserId, requestingRole, request),
                HttpStatus.CREATED
        );
    }
}
