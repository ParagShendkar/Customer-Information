package com.parag.customerinfo.repository;

import com.parag.customerinfo.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUsername(String username);

    Optional<Customer> findByPhoneNumber(String phoneNumber);

    Optional<List<Customer>> findByCity(String city);

}
