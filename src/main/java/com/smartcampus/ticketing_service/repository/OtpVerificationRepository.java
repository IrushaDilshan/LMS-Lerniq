package com.smartcampus.ticketing_service.repository;

import com.smartcampus.ticketing_service.model.OtpVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OtpVerificationRepository extends MongoRepository<OtpVerification, String> {
    Optional<OtpVerification> findTopByEmailOrderByCreatedAtDesc(String email);
    void deleteByEmail(String email);
}
