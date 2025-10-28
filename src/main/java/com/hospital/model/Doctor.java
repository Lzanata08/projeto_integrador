package com.hospital.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String speciality;

    public Doctor() {}

    public Doctor(String name, String speciality) {
        this.name = name;
        this.speciality = speciality;
    }

    public Long getId() { return id; }
    
    public void setId(Long id ) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpeciality() { return speciality; }
    public void setSpeciality(String specialty) { this.speciality = specialty; }
    
   
}

