package com.lms.assessment_service.repository;

import com.lms.assessment_service.model.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    List<AssignmentSubmission> findByUserId(Long userId);
    List<AssignmentSubmission> findByAssignmentIdAndUserId(Long assignmentId, Long userId);
}
