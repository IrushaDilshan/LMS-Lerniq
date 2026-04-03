package com.lms.assessment_service.service;

import com.lms.assessment_service.dto.AssignmentCreateDto;
import com.lms.assessment_service.dto.AssignmentGradeDto;
import com.lms.assessment_service.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + assignmentId));
                
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
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + submissionId));
                
        submission.setGrade(dto.getGrade());
        submission.setFeedback(dto.getFeedback());
        
        return submissionRepository.save(submission);
    }

    // --- GET / Retrieval Methods ---
    public java.util.List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id " + id));
    }

    public java.util.List<AssignmentSubmission> getSubmissionsForAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public AssignmentSubmission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + id));
    }

    // --- UPDATE / DELETE ---
    @Transactional
    public Assignment updateAssignment(Long id, AssignmentCreateDto dto) {
        Assignment assignment = getAssignmentById(id);
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void deleteAssignment(Long id) {
        Assignment assignment = getAssignmentById(id);
        // Clean up associated submission files first to save space!
        java.util.List<AssignmentSubmission> submissions = getSubmissionsForAssignment(id);
        for (AssignmentSubmission sub : submissions) {
            if (sub.getFileUrl() != null) {
                fileStorageService.deleteFile(sub.getFileUrl());
            }
        }
        assignmentRepository.delete(assignment);
    }
} 
