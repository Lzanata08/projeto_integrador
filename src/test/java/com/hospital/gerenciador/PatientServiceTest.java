package com.hospital.gerenciador;

import com.hospital.controller.PatientRestController;
import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;
import com.hospital.service.PatientService;
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
class PatientServiceTest {

    @Mock
    private PatientRepository repo; 

    @Autowired
    private PatientService patientService; 
    
    @InjectMocks
    private PatientRestController patientRestController;

     @BeforeEach
    void setup(){
        patientService = new PatientService(repo);
        patientRestController = new PatientRestController(patientService);
    }
    
    
    @Test
    void testCreatePatient_DateBirthdateInvalid() throws Exception {
         Patient p = new Patient("Fulano", "018", LocalDate.of(2015, Month.MARCH, 20));
        
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> patientRestController.create(p) // código que deve lançar a exceção
        );

        assertEquals("Paciente precisa ter mais de 18 anos.", exception.getMessage());

    }

    @Test
    void testCreatePatient_nameEmpty() throws Exception {
         Patient p = new Patient("", "018", LocalDate.of(2015, Month.MARCH, 20));


        
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> patientRestController.create(p) // código que deve lançar a exceção
        );

        assertEquals("Nome do paciente é obrigatório", exception.getMessage());

    }

    
    
}

