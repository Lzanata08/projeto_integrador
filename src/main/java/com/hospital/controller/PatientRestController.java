package com.hospital.controller;

import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;
import com.hospital.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/patients")
public class PatientRestController {

    private final PatientService service;

    public PatientRestController(PatientService service) {
        this.service = service;
        
    }
    
    
    // ✅ Corrigido: findAll() é o método padrão do Spring Data JPA
    @GetMapping
    public List<Patient> listAll() {
        return (List<Patient>) service.findAll();
   
    }


    @GetMapping("/{id}")
    public ResponseEntity<Patient> listById(@PathVariable Long id) throws Exception {
        Patient p = service.findById(id);
        if (p == null )
             return    ResponseEntity.notFound().build();
        else {
            return ResponseEntity.ok(p);
                }
        
    }

    @PostMapping
    public ResponseEntity<Patient> create(@RequestBody Patient patient) {
        Patient saved = service.save(patient);
        return ResponseEntity.created(URI.create("/api/patients/" + saved.getId())).body(saved);
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

