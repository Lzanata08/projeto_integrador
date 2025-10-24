package com.hospital.service;

import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;
import java.time.LocalDate;
import java.time.Period;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.http.ResponseEntity;

@Service
public class PatientService {
    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient create(Patient p) {
        // basic validation
        if (p.getName() == null || p.getName().isBlank()) {
            throw new IllegalArgumentException("Nome do paciente é obrigatório");
        }
        
        if(!isAdult(p.getBirthDate())){
            throw new IllegalArgumentException("Paciente precisa ter mais de 18 anos.");
        }
       
        
        return patientRepository.save(p);
    }
    
    public static boolean isAdult(LocalDate birthdate) {
        if (birthdate == null) return false;

        LocalDate today = LocalDate.now();
        Period age = Period.between(birthdate, today);

        return age.getYears() >= 18;
    }

    public List<Patient> findAll() {
        return StreamSupport.stream(patientRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public Patient findById(Long id) throws Exception{
        return patientRepository.findById(id)
                .orElseThrow(() -> new jakarta.ws.rs.NotFoundException("Compromisso não encontrado"));
    }
  
     public void delete(Long id){
         patientRepository.deleteById(id);
    };

    public ResponseEntity<Patient> update(Long id, Patient patient) {
        return patientRepository.findById(id).map(existing -> {
            existing.setName(patient.getName());
            existing.setCpf(patient.getCpf());
            patientRepository.save(patient);
            return ResponseEntity.ok(existing);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}


