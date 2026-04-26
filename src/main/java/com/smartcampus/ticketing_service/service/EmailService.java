package com.smartcampus.ticketing_service.service;

public interface EmailService {
    void sendTicketCreatedEmail(String to, String ticketId, String title);
    void sendTicketStatusUpdatedEmail(String to, String ticketId, String title, String newStatus);
    void sendOtpEmail(String to, String otp);
}
