package com.hospital.controller;

import com.hospital.model.Patient;
import com.hospital.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientRestController {

    private final PatientService service;

    public PatientRestController(PatientService service) {
        this.service = service;
        
    }
        
    @GetMapping
    public List<Patient> listAll() {
        return (List<Patient>) service.findAll();   
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> listById(@PathVariable Long id) throws Exception {
         Optional<Patient> patient = service.findById(id);
         if(patient != null){
           return  patient.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
         }else{
             return ResponseEntity.notFound().build();
         }
    }

    @PostMapping    
    public ResponseEntity<Patient> create(@RequestBody Patient patient) {
        Patient saved = service.create(patient);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient patient) {
        return service.update(id, patient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }


 }

