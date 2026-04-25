package com.smartcampus.ticketing_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Async
    @Override
    public void sendTicketCreatedEmail(String to, String ticketId, String title) {
        String recipient = (to != null && to.contains("@")) ? to : "default-user@example.com";
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            String htmlContent = getEmailTemplate(
                "Ticket Created Successfully",
                "Your request has been received and logged in our system.",
                title,
                ticketId,
                "OPEN",
                "bg-blue-100 text-blue-700"
            );

            helper.setTo(recipient);
            helper.setSubject("🎫 Ticket Created: " + title);
            helper.setText(htmlContent, true);
            helper.setFrom("votifysliit@gmail.com", "UniOps Support");

            logger.info("Attempting to send email to: " + recipient + " for ticket: " + ticketId);
            mailSender.send(message);
            logger.info("SUCCESS: Email sent to: " + recipient);
        } catch (Exception e) {
            logger.error("CRITICAL: Failed to send HTML email to " + recipient + ". Error: " + e.getMessage(), e);
        }
    }

    @Async
    @Override
    public void sendTicketStatusUpdatedEmail(String to, String ticketId, String title, String newStatus) {
        String recipient = (to != null && to.contains("@")) ? to : "default-user@example.com";
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            String statusColor = getStatusColor(newStatus);
            String htmlContent = getEmailTemplate(
                "Ticket Status Updated",
                "There has been an update regarding your ticket status.",
                title,
                ticketId,
                newStatus,
                statusColor
            );

            if ("RESOLVED".equals(newStatus)) {
                htmlContent = htmlContent.replace("track the progress", "provide feedback on your experience and track the progress");
            }

            helper.setTo(recipient);
            helper.setSubject("🔔 Update on Ticket: " + title);
            helper.setText(htmlContent, true);
            helper.setFrom("votifysliit@gmail.com", "UniOps Support");

            logger.info("Attempting to send status update email to: " + recipient + " for ticket: " + ticketId);
            mailSender.send(message);
            logger.info("SUCCESS: Status update email sent to: " + recipient);
        } catch (Exception e) {
            logger.error("CRITICAL: Failed to send status update email to " + recipient + ". Error: " + e.getMessage(), e);
        }
    }

    private String getStatusColor(String status) {
        return switch (status) {
            case "IN_PROGRESS" -> "bg-amber-100 text-amber-700";
            case "RESOLVED" -> "bg-emerald-100 text-emerald-700";
            case "REJECTED" -> "bg-rose-100 text-rose-700";
            default -> "bg-blue-100 text-blue-700";
        };
    }

    private String getEmailTemplate(String header, String message, String title, String id, String status, String statusClass) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .header { background-color: #061224; color: white; padding: 30px; text-align: center; }
                .content { padding: 40px; }
                .ticket-card { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 20px; border: 1px solid #f3f4f6; }
                .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
                .bg-blue-100 { background-color: #dbeafe; color: #1d4ed8; }
                .bg-amber-100 { background-color: #fef3c7; color: #b45309; }
                .bg-emerald-100 { background-color: #d1fae5; color: #047857; }
                .bg-rose-100 { background-color: #fee2e2; color: #b91c1c; }
                .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
                .btn { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-size: 24px;">UniOps Smart Campus</h1>
                </div>
                <div class="content">
                    <h2 style="color: #061224;">%s</h2>
                    <p>%s</p>
                    
                    <div class="ticket-card">
                        <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: bold; text-transform: uppercase;">Ticket #%s</p>
                        <h3 style="margin: 5px 0 15px 0; color: #111827;">%s</h3>
                        <div class="badge %s">%s</div>
                    </div>
                    
                    <p style="margin-top: 30px;">You can track the progress of your ticket in the UniOps Portal.</p>
                    <a href="http://localhost:5173/tickets/%s" class="btn">View Ticket Details</a>
                </div>
                <div class="footer">
                    &copy; 2026 UniOps Smart Campus Ticketing Service. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """.formatted(header, message, id, title, statusClass, status, id);
    }
}
