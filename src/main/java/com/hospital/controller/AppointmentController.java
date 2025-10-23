package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.service.AppointmentService;
import jakarta.ws.rs.PathParam;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@CrossOrigin(origins = "*")
public class AppointmentController {
    
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {    
        this.appointmentService = appointmentService;
    }

    @GetMapping("/appointments")
    public List<Appointment> listAll() {
        return appointmentService.listAll();        
    }
    
    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> listById(@PathParam("id") Long id) throws Exception {
        return ResponseEntity.ok(appointmentService.findById(id));        
    }

 

    @PostMapping("/appointments")
    public Appointment create(@RequestBody Appointment appointment) {                
        return appointmentService.save(appointment);
    }
    
    @DeleteMapping("/appointments/{id}")
    public ResponseEntity delete(@PathParam("id") Long id) {                
          appointmentService.delete(id);
         return ResponseEntity.ok().build();
    }
}
