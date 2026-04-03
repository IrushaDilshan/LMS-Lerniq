package com.lms.assessment_service.controller;

import com.lms.assessment_service.dto.AssignmentCreateDto;
import com.lms.assessment_service.dto.AssignmentGradeDto;
import com.lms.assessment_service.model.Assignment;
import com.lms.assessment_service.model.AssignmentSubmission;
import com.lms.assessment_service.service.AssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
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
}
