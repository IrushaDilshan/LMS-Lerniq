package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.CommentCreateRequest;
import com.smartcampus.ticketing_service.dto.CommentResponse;
import com.smartcampus.ticketing_service.dto.TicketCreateRequest;
import com.smartcampus.ticketing_service.dto.TicketResponse;
import com.smartcampus.ticketing_service.dto.TicketStatusUpdateRequest;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.model.IncidentTicket;
import com.smartcampus.ticketing_service.model.TicketComment;
import com.smartcampus.ticketing_service.model.TicketPriority;
import com.smartcampus.ticketing_service.model.TicketStatus;
import com.smartcampus.ticketing_service.repository.IncidentTicketRepository;
import com.smartcampus.ticketing_service.repository.TicketCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentTicketServiceTest {

    @Mock
    private IncidentTicketRepository ticketRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private TicketCommentRepository ticketCommentRepository;

    @InjectMocks
    private IncidentTicketService ticketService;

    private IncidentTicket mockTicket;

    @BeforeEach
    void setUp() {
        mockTicket = new IncidentTicket();
        mockTicket.setId(1L);
        mockTicket.setResourceLocation("Room 101");
        mockTicket.setCategory("HARDWARE");
        mockTicket.setDescription("Projector not working");
        mockTicket.setPriority(TicketPriority.HIGH);
        mockTicket.setCreatedByUserId(1L);
        mockTicket.setStatus(TicketStatus.OPEN);
        mockTicket.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createTicket_HappyPath() {
        // Arrange
        TicketCreateRequest request = new TicketCreateRequest();
        request.setResourceLocation("Room 101");
        request.setCategory("HARDWARE");
        request.setDescription("Projector not working");
        request.setPriority(TicketPriority.HIGH);
        request.setCreatedByUserId(1L);

        List<MultipartFile> files = new ArrayList<>();
        files.add(new MockMultipartFile("file", "test.png", "image/png", "test data".getBytes()));

        when(ticketRepository.save(any(IncidentTicket.class))).thenReturn(mockTicket);
        when(fileStorageService.storeFile(any(), anyString())).thenReturn("test.png");

        // Act
        TicketResponse response = ticketService.createTicket(request, files);

        // Assert
        assertNotNull(response);
        assertEquals("Room 101", response.getResourceLocation());
        assertEquals(TicketStatus.OPEN, response.getStatus());
        assertEquals(TicketPriority.HIGH, response.getPriority());
        assertEquals(1, response.getAttachmentUrls().size());
        
        verify(ticketRepository, times(2)).save(any(IncidentTicket.class));
        verify(fileStorageService, times(1)).storeFile(any(), anyString());
    }

    @Test
    void createTicket_Over3Files_ThrowsException() {
        // Arrange
        TicketCreateRequest request = new TicketCreateRequest();
        List<MultipartFile> files = new ArrayList<>();
        files.add(new MockMultipartFile("file1", "test1.png", "image/png", new byte[0]));
        files.add(new MockMultipartFile("file2", "test2.png", "image/png", new byte[0]));
        files.add(new MockMultipartFile("file3", "test3.png", "image/png", new byte[0]));
        files.add(new MockMultipartFile("file4", "test4.png", "image/png", new byte[0]));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            ticketService.createTicket(request, files);
        });

        assertEquals("Maximum of 3 image attachments allowed per ticket.", exception.getMessage());
        verify(ticketRepository, never()).save(any(IncidentTicket.class));
    }

    @Test
    void getTicketById_Found() {
        // Arrange
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(mockTicket));

        // Act
        TicketResponse response = ticketService.getTicketById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Room 101", response.getResourceLocation());
        verify(ticketRepository, times(1)).findById(1L);
    }

    @Test
    void getTicketById_NotFound_ThrowsException() {
        // Arrange
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            ticketService.getTicketById(99L);
        });
        verify(ticketRepository, times(1)).findById(99L);
    }

    @Test
    void updateTicketStatus_StatusChange() {
        // Arrange
        TicketStatusUpdateRequest request = new TicketStatusUpdateRequest();
        request.setStatus(TicketStatus.RESOLVED);
        request.setResolutionNote("Fixed the cable");

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(mockTicket));
        when(ticketRepository.save(any(IncidentTicket.class))).thenReturn(mockTicket);

        // Act
        TicketResponse response = ticketService.updateTicketStatus(1L, request);

        // Assert
        assertNotNull(response);
        assertEquals(TicketStatus.RESOLVED, mockTicket.getStatus());
        assertEquals("Fixed the cable", mockTicket.getResolutionNote());
        assertEquals(TicketStatus.RESOLVED, response.getStatus());
        assertEquals("Fixed the cable", response.getResolutionNote());
        
        verify(ticketRepository, times(1)).findById(1L);
        verify(ticketRepository, times(1)).save(mockTicket);
    }

    @Test
    void addComment_HappyPath() {
        // Arrange
        CommentCreateRequest request = new CommentCreateRequest();
        request.setContent("This is a test comment");
        request.setCreatedByUserId(2L);

        TicketComment savedComment = new TicketComment();
        savedComment.setId(100L);
        savedComment.setTicket(mockTicket);
        savedComment.setContent("This is a test comment");
        savedComment.setCreatedByUserId(2L);
        savedComment.setCreatedAt(LocalDateTime.now());

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(mockTicket));
        when(ticketCommentRepository.save(any(TicketComment.class))).thenReturn(savedComment);

        // Act
        CommentResponse response = ticketService.addComment(1L, request);

        // Assert
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("This is a test comment", response.getContent());
        assertEquals(2L, response.getCreatedByUserId());
        
        verify(ticketRepository, times(1)).findById(1L);
        verify(ticketCommentRepository, times(1)).save(any(TicketComment.class));
    }
}
