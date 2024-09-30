package com.parag.customerinfo.controller;

import com.parag.customerinfo.dao.CustomerDao;
import com.parag.customerinfo.dto.CityRequest;
import com.parag.customerinfo.dto.PageData;
import com.parag.customerinfo.dto.PageResponse;
import com.parag.customerinfo.entity.Customer;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerDao dao;

    @PostMapping
    public Customer saveCustomer(@RequestBody @Valid Customer customer) {
        return dao.saveCustomer(customer);
    }

    @GetMapping("/customers")
    public PageResponse findAllCustomer(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size) {

        List<Customer> customers = dao.findAllCustomer(page, size);
        long totalCustomers = dao.countCustomers();
        long totalPages = (long) Math.ceil((double) totalCustomers / size);
        PageData pageData = new PageData(size, totalCustomers, totalPages, page);
        return new PageResponse(customers, pageData);
    }

    @GetMapping("/filterByUsername")
    public Optional<Customer> getCustomerByUsername(@RequestParam String username) {
        return dao.findbyUsername(username);
    }

    @GetMapping("/filterByPhoneNumber")
    public Optional<Customer> getCustomerByPhoneNumber(@RequestParam String phoneNumber) {
        return dao.findbyPhoneNumber(phoneNumber);
    }

    @PostMapping("/filterByCity")
    public List<Customer> getCustomerByCity(@RequestBody CityRequest request) {
        List<Customer> allCities = new ArrayList<>();
        for (String city : request.cities()) { // Use the accessor method of the record
            Optional<List<Customer>> customers = dao.findbyCity(city);
            customers.ifPresent(allCities::addAll); // Adds all customers from the Optional list to allCities
        }
        return allCities;
    }

}
