package com.hospital.repository;

import com.hospital.model.Patient;

import org.springframework.data.repository.CrudRepository;


public interface PatientRepository extends CrudRepository<Patient, Long> {

   
    

}
