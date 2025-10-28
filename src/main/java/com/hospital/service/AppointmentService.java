package com.hospital.service;

import com.hospital.model.Appointment;
import com.hospital.model.Doctor;
import com.hospital.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment schedule(Appointment appointment) {
        // check doctor availability
        Long doctorId = appointment.getDoctor().getId();
        LocalDateTime dt = appointment.getDateTime();
        Optional<Appointment> conflict = appointmentRepository.findByDoctorIdAndDateTime(doctorId, dt);
        if (conflict.isPresent()) {
            throw new IllegalStateException("Médico não disponível nesse horário");
        }
        return appointmentRepository.save(appointment);
    }
    
    public List<Appointment> listAll(){
        return StreamSupport.stream(appointmentRepository.findAll().spliterator(), false)
                                                 .collect(Collectors.toList());        
    }
    
    public Optional<Appointment> findById(Long id) throws Exception{
        return appointmentRepository.findById(id);
    }

    public Appointment create(Appointment appointment){
        
        if(appointment.getDateTime().toLocalDate().isBefore(LocalDateTime.now().toLocalDate()) ){
            throw new java.lang.IllegalArgumentException("Data da consulta inválida");
        } else {
            return appointmentRepository.save(appointment);
        }
    };
    
    public Appointment update(Long id, Appointment request) {
        Appointment appointment = appointmentRepository.findById(id).get();

        if (appointment != null) {
            appointment.setDateTime(request.getDateTime());
            appointment.setNotes(request.getNotes());                       
            return appointmentRepository.save(appointment);
        }

        return null;
    }
    
    public void delete(Long id){
         appointmentRepository.deleteById(id);
    };
}
