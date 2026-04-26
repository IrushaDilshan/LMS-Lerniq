package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.RecurrenceType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class RepeatBookingRequest {

    @NotBlank(message = "Source booking id is required")
    private String sourceBookingId;

    @NotNull(message = "Recurrence type is required")
    private RecurrenceType recurrenceType;

    @NotNull(message = "Occurrences is required")
    @Min(value = 1, message = "Occurrences must be at least 1")
    @Max(value = 30, message = "Occurrences must be 30 or less")
    private Integer occurrences;

    private LocalDate startDate;

    private DayOfWeek dayOfWeek;

    @Min(value = 1, message = "dayOfMonth must be between 1 and 31")
    @Max(value = 31, message = "dayOfMonth must be between 1 and 31")
    private Integer dayOfMonth;

    public String getSourceBookingId() {
        return sourceBookingId;
    }

    public void setSourceBookingId(String sourceBookingId) {
        this.sourceBookingId = sourceBookingId;
    }

    public RecurrenceType getRecurrenceType() {
        return recurrenceType;
    }

    public void setRecurrenceType(RecurrenceType recurrenceType) {
        this.recurrenceType = recurrenceType;
    }

    public Integer getOccurrences() {
        return occurrences;
    }

    public void setOccurrences(Integer occurrences) {
        this.occurrences = occurrences;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Integer getDayOfMonth() {
        return dayOfMonth;
    }

    public void setDayOfMonth(Integer dayOfMonth) {
        this.dayOfMonth = dayOfMonth;
    }
}
