package com.lms.assessment_service.controller;

import com.lms.assessment_service.dto.AssignmentCreateDto;
import com.lms.assessment_service.dto.AssignmentGradeDto;
import com.lms.assessment_service.model.Assignment;
import com.lms.assessment_service.model.AssignmentSubmission;
import com.lms.assessment_service.service.AssignmentService;
import com.lms.assessment_service.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/v1/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final FileStorageService fileStorageService;

    public AssignmentController(AssignmentService assignmentService, FileStorageService fileStorageService) {
        this.assignmentService = assignmentService;
        this.fileStorageService = fileStorageService;
    }

    // Instructor: Create a new Assignment
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody AssignmentCreateDto dto) {
        Assignment created = assignmentService.createAssignment(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Student: Submit an Assignment (File upload)
    @PostMapping("/{assignmentId}/submissions")
    public ResponseEntity<AssignmentSubmission> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam("userId") Long userId,
            @RequestParam("file") MultipartFile file) {
        AssignmentSubmission submission = assignmentService.submitAssignment(assignmentId, userId, file);
        return new ResponseEntity<>(submission, HttpStatus.CREATED);
    }

    // Instructor: Grade a Submission
    @PostMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<AssignmentSubmission> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody AssignmentGradeDto dto) {
        AssignmentSubmission graded = assignmentService.gradeAssignment(submissionId, dto);
        return ResponseEntity.ok(graded);
    }

    // --- GET / Retrieval & Updates ---

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<java.util.List<Assignment>> getAssignmentsForCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByCourse(courseId));
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(assignmentId));
    }

    @GetMapping("/{assignmentId}/submissions")
    public ResponseEntity<java.util.List<AssignmentSubmission>> getSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getSubmissionsForAssignment(assignmentId));
    }

    @GetMapping("/submissions/{submissionId}/download")
    public ResponseEntity<Resource> downloadSubmissionFile(@PathVariable Long submissionId) {
        AssignmentSubmission submission = assignmentService.getSubmissionById(submissionId);
        
        if (submission.getFileUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.loadFileAsResource(submission.getFileUrl());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PutMapping("/{assignmentId}")
    public ResponseEntity<Assignment> updateAssignment(
            @PathVariable Long assignmentId,
            @RequestBody AssignmentCreateDto dto) {
        return ResponseEntity.ok(assignmentService.updateAssignment(assignmentId, dto));
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }
}
