package com.smartcampus.facilities;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Smart Campus Operations Hub - Main Application Entry Point
 * IT3030 PAF Assignment 2026
 * Member 1: Facilities & Assets Catalogue
 */
@SpringBootApplication
@EnableJpaAuditing
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
    }
}
