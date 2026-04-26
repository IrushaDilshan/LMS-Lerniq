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

    private String getEmailTemplate(String heading, String description, String ticketTitle, String ticketId, String status, String colorClass) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #061224 0%, #0f1729 100%); color: white; padding: 30px; text-align: center; }
                .content { padding: 40px; }
                .status-badge { display: inline-block; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 12px; margin: 10px 0; }
                .ticket-info { background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
                .label { font-weight: 600; color: #374151; }
                .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-size: 24px;">UniOps Smart Campus</h1>
                </div>
                <div class="content">
                    <h2 style="color: #061224; margin-top: 0;">%s</h2>
                    <p style="color: #6b7280;">%s</p>
                    
                    <div class="status-badge %s">%s</div>
                    
                    <div class="ticket-info">
                        <div class="info-row">
                            <span class="label">Ticket:</span>
                            <span>%s</span>
                        </div>
                        <div class="info-row">
                            <span class="label">ID:</span>
                            <span>#%s</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Status:</span>
                            <span>%s</span>
                        </div>
                    </div>
                    
                    <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                        You can track the progress of your ticket in the UniOps portal.
                    </p>
                </div>
                <div class="footer">
                    &copy; 2026 UniOps Smart Campus. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """.formatted(heading, description, colorClass, status, ticketTitle, ticketId, status);
    }

    @Async
    public void sendOtpEmail(String to, String otp) {
        String recipient = (to != null && to.contains("@")) ? to : "default-user@example.com";
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            String htmlContent = getOtpEmailTemplate(otp);

            helper.setTo(recipient);
            helper.setSubject("UniOps Student Email Verification OTP");
            helper.setText(htmlContent, true);
            helper.setFrom("votifysliit@gmail.com", "UniOps Support");

            logger.info("Attempting to send OTP email to: " + recipient);
            mailSender.send(message);
            logger.info("SUCCESS: OTP email sent to: " + recipient);
        } catch (Exception e) {
            logger.error("CRITICAL: Failed to send OTP email to " + recipient + ". Error: " + e.getMessage(), e);
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    private String getOtpEmailTemplate(String otp) {
        String template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #061224 0, #0f1729 100); color: white; padding: 30px; text-align: center; }
                .content { padding: 40px; }
                .otp-box { background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1d4ed8; font-family: 'Courier New', monospace; }
                .expiry-notice { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-size: 24px;">UniOps Smart Campus</h1>
                </div>
                <div class="content">
                    <h2 style="color: #061224;">Email Verification Required</h2>
                    <p>Welcome to UniOps! To complete your student registration, please use the verification code below.</p>
                    
                    <div class="otp-box">
                        <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Your Verification Code</p>
                        <div class="otp-code">REPLACE_OTP</div>
                    </div>
                    
                    <div class="expiry-notice">
                        <strong>⏰ This code expires in 5 minutes</strong>
                        <p style="margin: 5px 0 0 0; font-size: 14px;">If you did not request this code, please ignore this email.</p>
                    </div>
                    
                    <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                        <strong>Important:</strong> Never share this code with anyone. UniOps staff will never ask for your verification code.
                    </p>
                </div>
                <div class="footer">
                    &copy; 2026 UniOps Smart Campus. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """;
        return template.replace("REPLACE_OTP", otp);
    }
}
