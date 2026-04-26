package com.smartcampus.ticketing_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.ticketing_service.dto.TicketCreateRequest;
import com.smartcampus.ticketing_service.dto.TicketResponse;
import com.smartcampus.ticketing_service.dto.TicketStatusUpdateRequest;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.model.TicketPriority;
import com.smartcampus.ticketing_service.model.TicketStatus;
import com.smartcampus.ticketing_service.service.IncidentTicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.nio.charset.StandardCharsets;

import com.smartcampus.ticketing_service.exception.GlobalExceptionHandler;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@ExtendWith(MockitoExtension.class)
public class IncidentTicketControllerTest {

    private MockMvc mockMvc;

    @Mock
    private IncidentTicketService ticketService;

    @InjectMocks
    private IncidentTicketController ticketController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private TicketResponse mockResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(ticketController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setMessageConverters(new MappingJackson2HttpMessageConverter())
                .build();

        mockResponse = new TicketResponse();

        mockResponse.setId("1");
        mockResponse.setResourceLocation("Library");
        mockResponse.setCategory("HARDWARE");
        mockResponse.setDescription("Screen broken");
        mockResponse.setPriority(TicketPriority.MEDIUM);
        mockResponse.setStatus(TicketStatus.OPEN);
        mockResponse.setCreatedByUserId(4L);
        mockResponse.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createTicket_ReturnsCreated() throws Exception {
        when(ticketService.createTicket(any(TicketCreateRequest.class), any())).thenReturn(mockResponse);

        MockMultipartFile file = new MockMultipartFile("files", "test.jpg", "image/jpeg", "image data".getBytes());
        
        TicketCreateRequest request = new TicketCreateRequest();
        request.setResourceLocation("Library");
        request.setCategory("HARDWARE");
        request.setDescription("Screen broken");
        request.setPriority(TicketPriority.MEDIUM);
        request.setPreferredContactDetails("12345");
        request.setContactEmail("test@example.com");
        request.setContactPhone("0123456789");
        request.setCreatedByUserId(4L);

        byte[] ticketJson = objectMapper.writeValueAsBytes(request);
        MockMultipartFile ticketPart = new MockMultipartFile("ticket", "", "application/json", ticketJson);

        mockMvc.perform(multipart("/api/v1/tickets")
                .file(file)
                .file(ticketPart)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.resourceLocation").value("Library"));
    }

    @Test
    void getAllTickets_ReturnsOk() throws Exception {
        when(ticketService.getAllTickets(isNull(), isNull())).thenReturn(Arrays.asList(mockResponse));

        mockMvc.perform(get("/api/v1/tickets")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].id").value("1"));
    }

    @Test
    void getTicketById_ReturnsOk() throws Exception {
        when(ticketService.getTicketById("1")).thenReturn(mockResponse);

        mockMvc.perform(get("/api/v1/tickets/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    void getTicketById_NotFound_Returns404() throws Exception {
        when(ticketService.getTicketById("99")).thenThrow(new ResourceNotFoundException("Not found with id: 99"));

        mockMvc.perform(get("/api/v1/tickets/99")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Not found with id: 99"));
    }

    @Test
    void updateTicketStatus_ReturnsOk() throws Exception {
        TicketStatusUpdateRequest updateRequest = new TicketStatusUpdateRequest();
        updateRequest.setStatus(TicketStatus.IN_PROGRESS);

        TicketResponse updatedResponse = new TicketResponse();
        updatedResponse.setId("1");
        updatedResponse.setStatus(TicketStatus.IN_PROGRESS);

        when(ticketService.updateTicketStatus(eq("1"), any(TicketStatusUpdateRequest.class))).thenReturn(updatedResponse);

        mockMvc.perform(put("/api/v1/tickets/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }
}
