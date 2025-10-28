package com.hospital.controller;

import com.hospital.model.Doctor;

import com.hospital.service.DoctorService;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping()
    public List<Doctor> listAll() {
        return doctorService.listAll();
    }

    @GetMapping("/id")
    public ResponseEntity<Doctor> listById(@PathVariable("id") Long id) throws Exception {
        Optional<Doctor> doctor = doctorService.findById(id);

        return doctor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping()
    public Doctor create(@RequestBody Doctor doctor) {
        return doctorService.create(doctor);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        doctorService.delete(id);
        return ResponseEntity.ok().build();
    }

    // PUT - Atualizar filme existente
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable Long id, @RequestBody Doctor request) throws Exception {

        Doctor d = doctorService.update(id, request);
        if (d != null) {
            return ResponseEntity.ok(d);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
