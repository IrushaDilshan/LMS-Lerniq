package com.smartcampus.ticketing_service.repository;

import com.smartcampus.ticketing_service.model.IncidentTicket;
import com.smartcampus.ticketing_service.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentTicketRepository extends MongoRepository<IncidentTicket, String> {
    List<IncidentTicket> findByCreatedByUserId(String userId);
    List<IncidentTicket> findByAssignedTechnicianId(String technicianId);
    List<IncidentTicket> findByStatus(TicketStatus status);
    List<IncidentTicket> findByStatusAndCreatedByUserId(TicketStatus status, String userId);
}

