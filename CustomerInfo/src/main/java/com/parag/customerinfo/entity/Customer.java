package com.parag.customerinfo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotBlank
    @Column(unique = true)
    @Size(min = 3)
    private String username;

    @Column(unique = true)
    @NotBlank
    @Size(min = 8, max = 10)
    private String phoneNumber;

    @NotBlank
    private String city;

}

