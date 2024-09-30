package com.parag.customerinfo.dto;

import com.parag.customerinfo.entity.Customer;

import java.util.List;

public record PageResponse(List<Customer> content, PageData page) {

}
