package com.hospital.gerenciador;

import com.hospital.controller.DoctorController;
import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;
import com.hospital.service.DoctorService;
import com.hospital.service.DoctorService;
import java.time.LocalDate;
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
class DoctorServiceTest {

    @Mock
    private DoctorRepository repo; 

    @Autowired
    private DoctorService doctorService; 
    
    @InjectMocks
    private DoctorController doctorRestController;

     @BeforeEach
    void setup(){
        doctorService = new DoctorService(repo);
        doctorRestController = new DoctorController(doctorService);
    }
    
    
    @Test
    void testCreateDoctor_badRequest() throws Exception {
         Doctor p = new Doctor("", "pediatra");


        
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> doctorRestController.create(p) // código que deve lançar a exceção
        );

        assertEquals("Paciente precisa ter mais de 18 anos.", exception.getMessage());

    }

    @Test
    void testCreateDoctor_nameEmpty() throws Exception {
         Doctor p = new Doctor("paulo", "");


        
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> doctorRestController.create(p) // código que deve lançar a exceção
        );

        assertEquals("Nome do paciente é obrigatório", exception.getMessage());

    }

    
    
}

