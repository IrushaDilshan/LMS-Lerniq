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

    @InjectMocks
    private IncidentTicketService ticketService;

    private IncidentTicket mockTicket;

    @BeforeEach
    void setUp() {
        mockTicket = new IncidentTicket();
        mockTicket.setId("1");
        mockTicket.setResourceLocation("Room 101");
        mockTicket.setCategory("HARDWARE");
        mockTicket.setDescription("Projector not working");
        mockTicket.setPriority(TicketPriority.HIGH);
        mockTicket.setCreatedByUserId("1");
        mockTicket.setStatus(TicketStatus.OPEN);
        mockTicket.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createTicket_HappyPath() {
        TicketCreateRequest request = new TicketCreateRequest();
        request.setResourceLocation("Room 101");
        request.setCategory("HARDWARE");
        request.setDescription("Projector not working");
        request.setPriority(TicketPriority.HIGH);
        request.setCreatedByUserId("1");

        List<MultipartFile> files = new ArrayList<>();
        files.add(new MockMultipartFile("file", "test.png", "image/png", "test data".getBytes()));

        when(ticketRepository.save(any(IncidentTicket.class))).thenReturn(mockTicket);
        when(fileStorageService.storeFile(any(), anyString())).thenReturn("test.png");

        TicketResponse response = ticketService.createTicket(request, files);

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
        TicketCreateRequest request = new TicketCreateRequest();
        List<MultipartFile> files = new ArrayList<>();
        files.add(new MockMultipartFile("file1", "test1.png", "image/png", new byte[0]));
        files.add(new MockMultipartFile("file2", "test2.png", "image/png", new byte[0]));
        files.add(new MockMultipartFile("file3", "test3.png", "image/png", new byte[0]));
        files.add(new MockMultipartFile("file4", "test4.png", "image/png", new byte[0]));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            ticketService.createTicket(request, files);
        });

        assertEquals("Maximum of 3 image attachments allowed per ticket.", exception.getMessage());
        verify(ticketRepository, never()).save(any(IncidentTicket.class));
    }

    @Test
    void getTicketById_Found() {
        when(ticketRepository.findById("1")).thenReturn(Optional.of(mockTicket));

        TicketResponse response = ticketService.getTicketById("1");

        assertNotNull(response);
        assertEquals("1", response.getId());
        assertEquals("Room 101", response.getResourceLocation());
        verify(ticketRepository, times(1)).findById("1");
    }

    @Test
    void getTicketById_NotFound_ThrowsException() {
        when(ticketRepository.findById("99")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            ticketService.getTicketById("99");
        });
        verify(ticketRepository, times(1)).findById("99");
    }

    @Test
    void updateTicketStatus_StatusChange() {
        TicketStatusUpdateRequest request = new TicketStatusUpdateRequest();
        request.setStatus(TicketStatus.RESOLVED);
        request.setResolutionNote("Fixed the cable");

        when(ticketRepository.findById("1")).thenReturn(Optional.of(mockTicket));
        when(ticketRepository.save(any(IncidentTicket.class))).thenReturn(mockTicket);

        TicketResponse response = ticketService.updateTicketStatus("1", request);

        assertNotNull(response);
        assertEquals(TicketStatus.RESOLVED, mockTicket.getStatus());
        assertEquals("Fixed the cable", mockTicket.getResolutionNote());
        assertEquals(TicketStatus.RESOLVED, response.getStatus());
        assertEquals("Fixed the cable", response.getResolutionNote());
        
        verify(ticketRepository, times(1)).findById("1");
        verify(ticketRepository, times(1)).save(mockTicket);
    }

    @Test
    void addComment_HappyPath() {
        CommentCreateRequest request = new CommentCreateRequest();
        request.setContent("This is a test comment");
        request.setCreatedByUserId("2");

        when(ticketRepository.findById("1")).thenReturn(Optional.of(mockTicket));

        CommentResponse response = ticketService.addComment("1", request);

        assertNotNull(response);
        assertEquals("This is a test comment", response.getContent());
        assertEquals("2", response.getCreatedByUserId());
        
        verify(ticketRepository, times(1)).findById("1");
        verify(ticketRepository, times(1)).save(mockTicket);
    }
}
