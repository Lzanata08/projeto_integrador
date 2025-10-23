package com.hospital.controller;

import com.hospital.service.PatientService;
import com.hospital.service.AppointmentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@CrossOrigin(origins = "*")
public class HomeController {
    private final PatientService patientService;

    public HomeController(PatientService patientService, AppointmentService appointmentService) {
        this.patientService = patientService;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("patients", patientService.findAll());
        return "index";
    }
}
