/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hospital.service;

import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    
        @Autowired
    public DoctorService(DoctorRepository doctorRepository){
        this.doctorRepository = doctorRepository;
    }
    
     public List<Doctor> listAll(){
        return StreamSupport.stream(doctorRepository.findAll().spliterator(), false)
                                                 .collect(Collectors.toList());        
    }
    
    public Doctor findById(Long id) throws Exception{
        return doctorRepository.findById(id)
                .orElseThrow(() -> new jakarta.ws.rs.NotFoundException("Compromisso não encontrado"));
    }

    public Doctor save(Doctor appointment){
        return doctorRepository.save(appointment);
    };
    
    public void delete(Long id){
         doctorRepository.deleteById(id);
    };
}
