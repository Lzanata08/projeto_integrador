package com.hospital.service;

import com.hospital.model.Appointment;
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
    
    public Appointment findById(Long id) throws Exception{
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new jakarta.ws.rs.NotFoundException("Compromisso não encontrado"));
    }

    public Appointment save(Appointment appointment){
        return appointmentRepository.save(appointment);
    };
    
    public void delete(Long id){
         appointmentRepository.deleteById(id);
    };
}
