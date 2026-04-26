package com.smartcampus.ticketing_service.repository;

import com.smartcampus.ticketing_service.model.BookingStatus;
import com.smartcampus.ticketing_service.model.ResourceBooking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ResourceBookingRepository extends MongoRepository<ResourceBooking, String> {
    List<ResourceBooking> findByRequestedByUserId(Long requestedByUserId);

    List<ResourceBooking> findByResourceNameIgnoreCaseAndBookingDateAndStatusIn(
            String resourceName,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );
}
