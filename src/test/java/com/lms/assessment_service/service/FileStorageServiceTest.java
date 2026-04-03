package com.lms.assessment_service.service;

import com.lms.assessment_service.exception.FileStorageException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class FileStorageServiceTest {

    private FileStorageService fileStorageService;
    private final String TEMP_DIR = "test_uploads";

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService(TEMP_DIR);
        fileStorageService.init();
    }

    @AfterEach
    void tearDown() throws IOException {
        Path path = Paths.get(TEMP_DIR).toAbsolutePath().normalize();
        if (Files.exists(path)) {
            Files.walk(path)
                 .sorted(Comparator.reverseOrder())
                 .map(Path::toFile)
                 .forEach(File::delete);
        }
    }

    @Test
    void testStoreFile_Succeeds() {
        // Arrange
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", 
                "test-assignment.pdf", 
                "application/pdf", 
                "Hello, World!".getBytes()
        );

        // Act
        String resultPath = fileStorageService.storeFile(mockFile, 1L, 2L);

        // Assert
        Path savedFile = Paths.get(resultPath);
        assertTrue(Files.exists(savedFile));
        assertTrue(savedFile.getFileName().toString().contains("assignment_1_user_2_test-assignment.pdf"));
    }
}
