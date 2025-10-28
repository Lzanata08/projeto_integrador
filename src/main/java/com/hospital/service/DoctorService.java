/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.hospital.service;

import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    @Autowired
    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> listAll() {
        return StreamSupport.stream(doctorRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public Optional<Doctor> findById(Long id) throws Exception {
        return doctorRepository.findById(id);
    }

    public Doctor create(Doctor doctor) {
        if (doctor == null) {
            throw new IllegalArgumentException("Request invalid");
        }

        if (StringUtils.isBlank(doctor.getName())) {
            throw new IllegalArgumentException("Nome do medico é obrigatório");
        }

        if (StringUtils.isBlank(doctor.getSpeciality())) {
            throw new IllegalArgumentException("Especialidade do medico é obrigatório");
        }

        return doctorRepository.save(doctor);
    }

    ;
    
    public void delete(Long id) {
        doctorRepository.deleteById(id);
    }

    public Doctor update(Long id, Doctor request) {
        Doctor doctor = doctorRepository.findById(id).get();

        if (doctor != null) {
            doctor.setName(request.getName());
            doctor.setSpeciality(request.getSpeciality());
            return doctorRepository.save(doctor);
        }

        return null;
    }

}
