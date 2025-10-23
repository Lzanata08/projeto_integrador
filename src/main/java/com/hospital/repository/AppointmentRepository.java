package com.hospital.repository;

import com.hospital.model.Appointment;
import org.springframework.data.repository.CrudRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface AppointmentRepository extends CrudRepository<Appointment, Long> {
    Optional<Appointment> findByDoctorIdAndDateTime(Long doctorId, LocalDateTime dateTime);
}
