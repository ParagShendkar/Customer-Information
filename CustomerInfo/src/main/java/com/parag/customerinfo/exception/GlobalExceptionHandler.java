package com.parag.customerinfo.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Error Handling for Validation
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleInvalidArguments(MethodArgumentNotValidException ex) {
        Map<String, String> errorMap = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errorMap.put(error.getField(), error.getDefaultMessage());
        });
        return errorMap;
    }

    // Handle illegal argument errors
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, String> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", ex.getMessage());
        return errorMap;
    }

    // Handle duplicate entry exceptions
    @ResponseStatus(HttpStatus.CONFLICT)  // 409 Conflict status code
    @ExceptionHandler(DataIntegrityViolationException.class)
    public Map<String, String> handleDuplicateKeyException(DataIntegrityViolationException ex) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", "Duplicate entry detected");
        errorMap.put("details", ex.getMostSpecificCause().getMessage());
        return errorMap;
    }

    // Handle global exceptions
    @ExceptionHandler(Exception.class)
    public Map<String, String> handleGlobalException(Exception ex){
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error","An unexpected error occured");
        errorMap.put("details", ex.getMessage());
        return  errorMap;
    }
}
