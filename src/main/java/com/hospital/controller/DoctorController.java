package com.hospital.controller;


import com.hospital.model.Doctor;

import com.hospital.service.DoctorService;
import jakarta.ws.rs.PathParam;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;



@CrossOrigin(origins = "*")
@RestController
public class DoctorController {
    private final DoctorService doctorService;


    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/doctors")
    public List<Doctor> listAll() {
        return doctorService.listAll();
    }


    @GetMapping("/doctors/id")
    public ResponseEntity<Doctor> listById(@PathParam("id") Long id) throws Exception {
         return  ResponseEntity.ok(doctorService.findById(id));
    }

    @PostMapping("/doctors")
    public Doctor create(@RequestBody Doctor doctor) {
        return doctorService.create(doctor);
        
    }
    
      @DeleteMapping("/doctor/{id}")
    public ResponseEntity delete(@PathParam("id") Long id) {                
          doctorService.delete(id);
         return ResponseEntity.ok().build();
    }
}
