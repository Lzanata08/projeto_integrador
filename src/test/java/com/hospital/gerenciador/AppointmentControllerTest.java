package com.hospital.gerenciador;

import com.hospital.controller.AppointmentController;
import com.hospital.model.Appointment;
import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import com.hospital.service.AppointmentService;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;


import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)        
class AppointmentControllerTest {
    
    
    @Mock
    private AppointmentService appointmentService;

    @InjectMocks
    private AppointmentController appointmentController;
    

    @Test
    void testListAppointments() {
        Appointment a1 = new Appointment(new Patient("Paciente B", "018"), new Doctor("Doutor", "Pediatra"),LocalDateTime.now());
        Appointment a2 = new Appointment(new Patient("Paciente B", "017"), new Doctor("Doutor", "Pediatra"), LocalDateTime.now());

        // Mockando o comportamento do service
        when(appointmentService.listAll()).thenReturn(List.of(a1, a2));

        // Chamando o controller
        List<Appointment> result = appointmentController.listAll();

        // Verificando resultado
        assertEquals(2, result.size());
        Mockito.verify(appointmentService, times(1)).listAll();
    }
    
    
    @Test
    void testGetAppointmentById() throws Exception {
        Appointment ap = new Appointment(new Patient("Paciente B", "018"), new Doctor("Doutor", "Pediatra"),LocalDateTime.now());
        ap.setId(1L);
        when(appointmentService.findById(1L)).thenReturn(Optional.of(ap));

        ResponseEntity<Appointment> result = appointmentController.listById(1L);

        assertTrue(result.getStatusCode().is2xxSuccessful());
        assertEquals(ap, result.getBody());
    }

    
    @Test
    void testCreateAppointment() {
        Appointment ap = new Appointment();
        when(appointmentService.create(ap)).thenReturn(ap);

        Appointment result = appointmentController.create(ap);

        assertNotNull(result);
        verify(appointmentService).create(ap);
    }

    @Test
    void testDeleteAppointment() {
        doNothing().when(appointmentService).delete(1L);

        ResponseEntity<Void> result = appointmentController.delete(1L);

        assertTrue(result.getStatusCode().is2xxSuccessful());
        verify(appointmentService).delete(1L);
    }

   
}
