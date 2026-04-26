package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.BookingCreateRequest;
import com.smartcampus.ticketing_service.dto.BookingResponse;
import com.smartcampus.ticketing_service.dto.BookingReviewRequest;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.exception.UnauthorizedException;
import com.smartcampus.ticketing_service.model.BookingStatus;
import com.smartcampus.ticketing_service.model.ResourceBooking;
import com.smartcampus.ticketing_service.repository.ResourceBookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ResourceBookingService {

    private static final List<BookingStatus> CONFLICT_STATES = List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    private final ResourceBookingRepository bookingRepository;

    public ResourceBookingService(ResourceBookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public BookingResponse createBooking(BookingCreateRequest request) {
        validateTimeRange(request.getStartTime(), request.getEndTime());
        ensureNoConflict(request.getResourceName(), request.getBookingDate(), request.getStartTime(), request.getEndTime(), null);

        ResourceBooking booking = new ResourceBooking();
        booking.setResourceName(request.getResourceName().trim());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose().trim());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setRequestedByUserId(request.getRequestedByUserId());
        booking.setRequestedByUserName(request.getRequestedByUserName().trim());
        booking.setStatus(BookingStatus.PENDING);

        return mapToResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getBookings(Long requestingUserId, String requestingRole, BookingStatus status, String resourceName, LocalDate bookingDate) {
        validateAccessInputs(requestingUserId, requestingRole);

        List<ResourceBooking> bookings;

        if (isAdmin(requestingRole)) {
            bookings = bookingRepository.findAll();
        } else {
            bookings = bookingRepository.findByRequestedByUserId(requestingUserId);
        }

        List<BookingResponse> filtered = new ArrayList<>();
        for (ResourceBooking booking : bookings) {
            if (status != null && booking.getStatus() != status) {
                continue;
            }
            if (resourceName != null && !resourceName.isBlank()) {
                String resourceFilter = resourceName.trim().toLowerCase(Locale.ROOT);
                String bookingResource = booking.getResourceName() == null ? "" : booking.getResourceName().toLowerCase(Locale.ROOT);
                if (!bookingResource.contains(resourceFilter)) {
                    continue;
                }
            }
            if (bookingDate != null && !bookingDate.equals(booking.getBookingDate())) {
                continue;
            }
            filtered.add(mapToResponse(booking));
        }

        return filtered;
    }

    public BookingResponse reviewBooking(String bookingId, BookingReviewRequest request, String requestingRole) {
        if (!isAdmin(requestingRole)) {
            throw new UnauthorizedException("Only ADMIN users can review bookings.");
        }
        if (request.getDecision() != BookingStatus.APPROVED && request.getDecision() != BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Review decision must be APPROVED or REJECTED.");
        }
        if (request.getDecision() == BookingStatus.REJECTED && (request.getReason() == null || request.getReason().isBlank())) {
            throw new IllegalArgumentException("Rejection reason is required when rejecting a booking.");
        }

        ResourceBooking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be reviewed.");
        }

        if (request.getDecision() == BookingStatus.APPROVED) {
            ensureNoConflict(booking.getResourceName(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(), booking.getId());
        }

        booking.setStatus(request.getDecision());
        booking.setAdminDecisionReason(request.getReason());
        booking.setReviewedByAdminId(request.getAdminUserId());
        booking.setReviewedByAdminName(request.getAdminName().trim());

        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponse cancelBooking(String bookingId, Long requestingUserId, String requestingRole, String cancelReason) {
        validateAccessInputs(requestingUserId, requestingRole);

        ResourceBooking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        boolean isRequester = booking.getRequestedByUserId() != null && booking.getRequestedByUserId().equals(requestingUserId);
        if (!isAdmin(requestingRole) && !isRequester) {
            throw new UnauthorizedException("Only booking owner or ADMIN can cancel this booking.");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalArgumentException("Only APPROVED bookings can be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        if (cancelReason != null && !cancelReason.isBlank()) {
            booking.setAdminDecisionReason(cancelReason.trim());
        }

        return mapToResponse(bookingRepository.save(booking));
    }

    private void ensureNoConflict(String resourceName, LocalDate date, LocalTime startTime, LocalTime endTime, String currentBookingId) {
        List<ResourceBooking> sameResourceBookings = bookingRepository
            .findByResourceNameIgnoreCaseAndBookingDateAndStatusIn(resourceName.trim(), date, CONFLICT_STATES);

        for (ResourceBooking existing : sameResourceBookings) {
            if (currentBookingId != null && currentBookingId.equals(existing.getId())) {
                continue;
            }
            if (isOverlapping(startTime, endTime, existing.getStartTime(), existing.getEndTime())) {
                throw new IllegalArgumentException(
                        "Scheduling conflict: " + resourceName + " is already booked from " +
                        existing.getStartTime() + " to " + existing.getEndTime() + " on " + date + "."
                );
            }
        }
    }

    private boolean isOverlapping(LocalTime startA, LocalTime endA, LocalTime startB, LocalTime endB) {
        return startA.isBefore(endB) && endA.isAfter(startB);
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("Start time must be earlier than end time.");
        }
    }

    private void validateAccessInputs(Long requestingUserId, String requestingRole) {
        if (requestingUserId == null) {
            throw new IllegalArgumentException("requestingUserId is required.");
        }
        if (requestingRole == null || requestingRole.isBlank()) {
            throw new IllegalArgumentException("requestingRole is required.");
        }
    }

    private boolean isAdmin(String requestingRole) {
        return "ADMIN".equalsIgnoreCase(requestingRole);
    }

    private BookingResponse mapToResponse(ResourceBooking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setResourceName(booking.getResourceName());
        response.setBookingDate(booking.getBookingDate());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setPurpose(booking.getPurpose());
        response.setExpectedAttendees(booking.getExpectedAttendees());
        response.setRequestedByUserId(booking.getRequestedByUserId());
        response.setRequestedByUserName(booking.getRequestedByUserName());
        response.setStatus(booking.getStatus());
        response.setAdminDecisionReason(booking.getAdminDecisionReason());
        response.setReviewedByAdminId(booking.getReviewedByAdminId());
        response.setReviewedByAdminName(booking.getReviewedByAdminName());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        return response;
    }
}
