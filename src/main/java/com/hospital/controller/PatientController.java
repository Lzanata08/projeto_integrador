package com.hospital.controller;

import com.hospital.model.Patient;
import com.hospital.service.PatientService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
@CrossOrigin(origins = "*")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/patients/new")
    public String form(Model model) {
        model.addAttribute("patient", new Patient());
        return "patients/new";
    }

    @PostMapping("/patients")
    public String create(@ModelAttribute Patient patient) {
        patientService.create(patient);
        return "redirect:/";
    }
}
