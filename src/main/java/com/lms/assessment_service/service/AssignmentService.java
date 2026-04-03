package com.lms.assessment_service.service;

import com.lms.assessment_service.dto.AssignmentCreateDto;
import com.lms.assessment_service.dto.AssignmentGradeDto;
import com.lms.assessment_service.model.Assignment;
import com.lms.assessment_service.model.AssignmentSubmission;
import com.lms.assessment_service.repository.AssignmentRepository;
import com.lms.assessment_service.repository.AssignmentSubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final FileStorageService fileStorageService;

    public AssignmentService(AssignmentRepository assignmentRepository, 
                             AssignmentSubmissionRepository submissionRepository,
                             FileStorageService fileStorageService) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public Assignment createAssignment(AssignmentCreateDto dto) {
        Assignment assignment = new Assignment();
        assignment.setCourseId(dto.getCourseId());
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public AssignmentSubmission submitAssignment(Long assignmentId, Long userId, MultipartFile file) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
                
        // Store the file using our generic filesystem component
        String filePath = fileStorageService.storeFile(file, assignmentId, userId);
        
        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setUserId(userId);
        submission.setFileUrl(filePath);
        
        return submissionRepository.save(submission);
    }
    
    @Transactional
    public AssignmentSubmission gradeAssignment(Long submissionId, AssignmentGradeDto dto) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
                
        submission.setGrade(dto.getGrade());
        submission.setFeedback(dto.getFeedback());
        
        return submissionRepository.save(submission);
    }
}
