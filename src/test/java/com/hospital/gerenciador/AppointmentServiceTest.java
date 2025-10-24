package com.hospital.gerenciador;

import com.hospital.controller.AppointmentController;
import com.hospital.model.Appointment;
import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import com.hospital.repository.AppointmentRepository;
import com.hospital.service.AppointmentService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository repo; 

    @Autowired
    private AppointmentService appointmentService; 
    
    @InjectMocks
    private AppointmentController appointmentController;

     @BeforeEach
    void setup(){
        appointmentService = new AppointmentService(repo);
        appointmentController = new AppointmentController(appointmentService);
    }
    
    
    @Test
    void testCreateAppointment_DateTimeInvalid() throws Exception {
         Doctor doctor = new Doctor("pedro", "Clinico geral"); 
         Patient patient = new Patient("lucas", "023203032", LocalDate.of(2009, 2, 12));
         LocalDateTime localDateTIme = LocalDateTime.of(2025, Month.MARCH, 1, 18, 15);
         
         Appointment appointment = new Appointment(patient, doctor, localDateTIme);        
                IllegalArgumentException exception = assertThrows(
                java.lang.IllegalArgumentException.class,
                () -> appointmentController.create(appointment) // código que deve lançar a exceção
        );

        assertEquals("Data da consulta inválida", exception.getMessage());

    }


    
    
}

