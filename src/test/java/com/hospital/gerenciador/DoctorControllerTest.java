
package com.hospital.gerenciador;



import com.hospital.controller.DoctorController;

import com.hospital.model.Doctor;

import com.hospital.service.DoctorService;

import org.junit.jupiter.api.Test;


import java.util.Arrays;



import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.Mockito.doNothing;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class) 
class DoctorControllerTest {

   

    @Mock
    private DoctorService doctorService;

     @InjectMocks
    private DoctorController doctorController;

    @Test
    void testListDoctors() {
         
        when(doctorService.listAll()).thenReturn(Arrays.asList(new Doctor(), new Doctor()));

        List<Doctor> result = doctorController.listAll();

        assertEquals(2, result.size());
        verify(doctorService).listAll();
    }

    @Test
    void testGetDoctorById() throws Exception {
        Doctor d = new Doctor();
        d.setId(1L);
        when(doctorService.findById(1L)).thenReturn((d));

        ResponseEntity<Doctor> result= doctorController.listById(1L);

        assertTrue(result.getStatusCode().is2xxSuccessful());
        assertEquals(d, result.getBody());
    }

    @Test
    void testCreateDoctor() {
        Doctor d = new Doctor();
        when(doctorService.create(d)).thenReturn(d);

        Doctor result = doctorController.create(d);

        assertNotNull(result);
        verify(doctorService).create(d);
    }

    @Test
    void testDeleteDoctor() {
        doNothing().when(doctorService).delete(1L);

        ResponseEntity<Void> result = doctorController.delete(1L);

        assertTrue(result.getStatusCode().is2xxSuccessful());
        verify(doctorService).delete(1L);
    }
}
