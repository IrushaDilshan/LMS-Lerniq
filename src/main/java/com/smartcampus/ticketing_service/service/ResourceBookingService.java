package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.BookingCreateRequest;
import com.smartcampus.ticketing_service.dto.BookingResponse;
import com.smartcampus.ticketing_service.dto.BookingReviewRequest;
import com.smartcampus.ticketing_service.dto.BookingUpdateRequest;
import com.smartcampus.ticketing_service.dto.RepeatBookingRequest;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.exception.UnauthorizedException;
import com.smartcampus.ticketing_service.model.BookingStatus;
import com.smartcampus.ticketing_service.model.RecurrenceType;
import com.smartcampus.ticketing_service.model.ResourceBooking;
import com.smartcampus.ticketing_service.repository.ResourceBookingRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
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

    public BookingResponse updateBooking(String bookingId, Long requestingUserId, String requestingRole, BookingUpdateRequest request) {
        validateAccessInputs(requestingUserId, requestingRole);
        validateTimeRange(request.getStartTime(), request.getEndTime());

        ResourceBooking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        boolean isRequester = booking.getRequestedByUserId() != null && booking.getRequestedByUserId().equals(requestingUserId);
        if (!isAdmin(requestingRole) && !isRequester) {
            throw new UnauthorizedException("Only booking owner or ADMIN can edit this booking.");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be edited.");
        }

        ensureNoConflict(
                request.getResourceName(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                booking.getId()
        );

        booking.setResourceName(request.getResourceName().trim());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose().trim());
        booking.setExpectedAttendees(request.getExpectedAttendees());

        return mapToResponse(bookingRepository.save(booking));
    }

    public void deleteBooking(String bookingId, Long requestingUserId, String requestingRole) {
        validateAccessInputs(requestingUserId, requestingRole);

        ResourceBooking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        boolean isRequester = booking.getRequestedByUserId() != null && booking.getRequestedByUserId().equals(requestingUserId);
        if (!isAdmin(requestingRole) && !isRequester) {
            throw new UnauthorizedException("Only booking owner or ADMIN can delete this booking.");
        }

        bookingRepository.delete(booking);
    }

    public List<BookingResponse> repeatBooking(Long requestingUserId, String requestingRole, RepeatBookingRequest request) {
        validateAccessInputs(requestingUserId, requestingRole);

        ResourceBooking sourceBooking = bookingRepository.findById(request.getSourceBookingId())
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getSourceBookingId()));

        boolean isOwner = sourceBooking.getRequestedByUserId() != null && sourceBooking.getRequestedByUserId().equals(requestingUserId);
        if (!isAdmin(requestingRole) && !isOwner) {
            throw new UnauthorizedException("Only booking owner or ADMIN can repeat this booking.");
        }

        if (sourceBooking.getStatus() == BookingStatus.CANCELLED || sourceBooking.getStatus() == BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Only PENDING or APPROVED bookings can be repeated.");
        }

        LocalDate baseStartDate = request.getStartDate() != null ? request.getStartDate() : sourceBooking.getBookingDate().plusDays(1);
        if (baseStartDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Repeat start date cannot be in the past.");
        }

        validateRepeatSelection(request);

        LocalDate firstRepeatedDate = calculateFirstRepeatedDate(baseStartDate, request);
        List<ResourceBooking> toSave = new ArrayList<>();

        for (int i = 1; i <= request.getOccurrences(); i++) {
            LocalDate repeatedDate = calculateOccurrenceDate(firstRepeatedDate, request, i);
            ensureNoConflict(sourceBooking.getResourceName(), repeatedDate, sourceBooking.getStartTime(), sourceBooking.getEndTime(), null);

            ResourceBooking repeated = new ResourceBooking();
            repeated.setResourceName(sourceBooking.getResourceName());
            repeated.setBookingDate(repeatedDate);
            repeated.setStartTime(sourceBooking.getStartTime());
            repeated.setEndTime(sourceBooking.getEndTime());
            repeated.setPurpose(sourceBooking.getPurpose());
            repeated.setExpectedAttendees(sourceBooking.getExpectedAttendees());
            repeated.setRequestedByUserId(sourceBooking.getRequestedByUserId());
            repeated.setRequestedByUserName(sourceBooking.getRequestedByUserName());
            repeated.setStatus(BookingStatus.PENDING);
            toSave.add(repeated);
        }

        List<ResourceBooking> saved = bookingRepository.saveAll(toSave);
        return saved.stream().map(this::mapToResponse).toList();
    }

    private void validateRepeatSelection(RepeatBookingRequest request) {
        if (request.getRecurrenceType() == RecurrenceType.WEEKLY && request.getDayOfWeek() == null) {
            throw new IllegalArgumentException("Select day of week for WEEKLY recurrence.");
        }
        if (request.getRecurrenceType() == RecurrenceType.MONTHLY && request.getDayOfMonth() == null) {
            throw new IllegalArgumentException("Select day of month for MONTHLY recurrence.");
        }
    }

    private LocalDate calculateFirstRepeatedDate(LocalDate baseStartDate, RepeatBookingRequest request) {
        if (request.getRecurrenceType() == RecurrenceType.DAILY) {
            return baseStartDate;
        }
        if (request.getRecurrenceType() == RecurrenceType.WEEKLY) {
            return moveToDayOfWeekOnOrAfter(baseStartDate, request.getDayOfWeek());
        }
        return buildMonthlyDate(baseStartDate, request.getDayOfMonth());
    }

    private LocalDate calculateOccurrenceDate(LocalDate firstRepeatedDate, RepeatBookingRequest request, int occurrenceIndex) {
        if (request.getRecurrenceType() == RecurrenceType.DAILY) {
            return firstRepeatedDate.plusDays(occurrenceIndex - 1L);
        }
        if (request.getRecurrenceType() == RecurrenceType.WEEKLY) {
            return firstRepeatedDate.plusWeeks(occurrenceIndex - 1L);
        }

        LocalDate monthDate = firstRepeatedDate.plusMonths(occurrenceIndex - 1L);
        return buildMonthlyDate(monthDate, request.getDayOfMonth());
    }

    private LocalDate moveToDayOfWeekOnOrAfter(LocalDate date, DayOfWeek targetDay) {
        int current = date.getDayOfWeek().getValue();
        int target = targetDay.getValue();
        int delta = target - current;
        if (delta < 0) {
            delta += 7;
        }
        return date.plusDays(delta);
    }

    private LocalDate buildMonthlyDate(LocalDate seedDate, Integer dayOfMonth) {
        YearMonth yearMonth = YearMonth.from(seedDate);
        int safeDay = Math.min(dayOfMonth, yearMonth.lengthOfMonth());
        return yearMonth.atDay(safeDay);
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
