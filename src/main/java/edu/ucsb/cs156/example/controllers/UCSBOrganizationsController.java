package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * REST controller (pluralized) for UCSB Organizations
 */
@Tag(name = "UCSBOrganizations")
@RequestMapping("/api/ucsborganizations")
@RestController
@Slf4j
public class UCSBOrganizationsController extends ApiController {

    @Autowired
    UCSBOrganizationRepository ucsbOrganizationRepository;

    // ===== LIST ALL =====
    @Operation(summary = "List all UCSB organizations")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBOrganization> all() {
        return ucsbOrganizationRepository.findAll();
    }

    // ===== CREATE =====
    @Operation(summary = "Create a new UCSB organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBOrganization create(
            @Parameter(name = "orgCode") @RequestParam String orgCode,
            @Parameter(name = "orgTranslationShort") @RequestParam String orgTranslationShort,
            @Parameter(name = "orgTranslation") @RequestParam String orgTranslation,
            @Parameter(name = "inactive") @RequestParam Boolean inactive) {

        UCSBOrganization org = new UCSBOrganization();
        org.setOrgCode(orgCode);
        org.setOrgTranslationShort(orgTranslationShort);
        org.setOrgTranslation(orgTranslation);
        org.setInactive(inactive);
        return ucsbOrganizationRepository.save(org);
    }

    // ===== READ =====
    @Operation(summary = "Get a UCSB organization by orgCode")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBOrganization getByOrgCode(@Parameter(name = "orgCode") @RequestParam String orgCode) {
        return ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));
    }

    // ===== UPDATE =====
    @Operation(summary = "Update a UCSB organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBOrganization update(
            @Parameter(name = "orgCode") @RequestParam String orgCode,
            @RequestBody @Valid UCSBOrganization incoming) {

        UCSBOrganization org = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));

        org.setOrgTranslationShort(incoming.getOrgTranslationShort());
        org.setOrgTranslation(incoming.getOrgTranslation());
        org.setInactive(incoming.getInactive());
        return ucsbOrganizationRepository.save(org);
    }

    // ===== DELETE =====
    @Operation(summary = "Delete a UCSB organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object delete(@Parameter(name = "orgCode") @RequestParam String orgCode) {
        UCSBOrganization org = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));
        ucsbOrganizationRepository.delete(org);
        return genericMessage("UCSB Organization with id %s deleted".formatted(orgCode));
    }
}
