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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import static org.mockito.Mockito.*;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class PatientRestControllerTest {

     @Mock
    private PatientRepository repo; 

    @Mock
    private PatientService patientService;  // agora com @Mock!

    @InjectMocks
    private PatientRestController patientRestController;

   
    
    @Test
    void testListAllPatients() {
        Patient a1 = new Patient("Paciente A", "018");
        Patient a2 = new Patient("Paciente B", "017");

        when(patientService.findAll()).thenReturn(List.of(a1, a2));

        List<Patient> result = patientRestController.listAll();

        assertEquals(2, result.size());
        verify(patientService, times(1)).findAll();
    }

    @Test
    void testGetPatientById_notFound() throws Exception {
        when(patientService.findById(1L)).thenReturn(null);

        ResponseEntity<Patient> result = patientRestController.listById(1L);

        assertEquals(404, result.getStatusCodeValue());
        verify(patientService, times(1)).findById(1L);
    }
    
    @Test
    void testCreatePatient_DateBirthdateInvalid() throws Exception {
         Patient p = new Patient("Fulano", "018", LocalDate.of(2015, Month.MARCH, 20));

        ResponseEntity<Patient> result = patientRestController.create(p);

        assertTrue(result.getStatusCode().is4xxClientError());
        verify(patientService).create(p);
    }

    @Test
    void testCreatePatient() {
        Patient p = new Patient();
        when(patientService.create(p)).thenReturn(p);

        ResponseEntity<Patient> result = patientRestController.create(p);

        assertTrue(result.getStatusCode().is2xxSuccessful());
        verify(patientService).create(p);
    }


    @Test
    void testDeletePatient() {
        doNothing().when(patientService).delete(1L);

        ResponseEntity<Void> result = patientRestController.delete(1L);

        assertTrue(result.getStatusCode().is2xxSuccessful());
        verify(patientService).delete(1L);
    }
}

