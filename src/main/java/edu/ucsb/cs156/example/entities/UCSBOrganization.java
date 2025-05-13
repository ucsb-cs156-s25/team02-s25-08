package edu.ucsb.cs156.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

/**
 * JPA entity representing a UCSB Organization.
 * Matches the instructor logic (orgCode is the primary key) but keeps
 * the exact class/field names you’ve been using elsewhere.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "ucsborganization")
public class UCSBOrganization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String orgCode;  

    private String orgTranslationShort;
    private String orgTranslation;
    private boolean inactive;
}
 