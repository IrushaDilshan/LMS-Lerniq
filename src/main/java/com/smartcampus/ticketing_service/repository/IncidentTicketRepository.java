package com.smartcampus.ticketing_service.repository;

import com.smartcampus.ticketing_service.model.IncidentTicket;
import com.smartcampus.ticketing_service.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {
    List<IncidentTicket> findByCreatedByUserId(Long userId);
    List<IncidentTicket> findByAssignedTechnicianId(Long technicianId);
    List<IncidentTicket> findByStatus(TicketStatus status);
}
