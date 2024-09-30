package com.parag.customerinfo.dao;

import com.parag.customerinfo.entity.Customer;
import com.parag.customerinfo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CustomerDao {

    @Autowired
    private CustomerRepository repository;

    public Customer saveCustomer(Customer customer) {
        return repository.save(customer);
    }

    public List<Customer> findAllCustomer(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Customer> page = repository.findAll(pageable);
        return page.getContent();
    }

    public Optional<Customer> findbyUsername(String username) {
        return repository.findByUsername(username);
    }

    public Optional<Customer> findbyPhoneNumber(String phoneNumber) {
        return repository.findByPhoneNumber(phoneNumber);
    }

    public Optional<List<Customer>> findbyCity(String city) {
        return repository.findByCity(city);
    }


    public long countCustomers() {
        return  repository.count();
    }
}
