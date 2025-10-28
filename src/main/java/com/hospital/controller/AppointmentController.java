package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.service.AppointmentService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {
    
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {    
        this.appointmentService = appointmentService;
    }

    @GetMapping()
    public List<Appointment> listAll() {
        return appointmentService.listAll();        
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> listById(@PathVariable("id") Long id) throws Exception {
        Optional<Appointment> appointment = appointmentService.findById(id);

           return  appointment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

 

    @PostMapping()
    public Appointment create(@RequestBody Appointment appointment) {                
        return appointmentService.create(appointment);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id) {                
          appointmentService.delete(id);
         return ResponseEntity.ok().build();
    }
    
     @PutMapping("/{id}")
    public ResponseEntity<Appointment> update(@PathVariable Long id, @RequestBody Appointment request) throws Exception {

        Appointment d = appointmentService.update(id, request);
        if (d != null) {
            return ResponseEntity.ok(d);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
