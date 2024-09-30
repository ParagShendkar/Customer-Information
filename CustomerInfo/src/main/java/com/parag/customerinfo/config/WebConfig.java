package com.parag.customerinfo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // Allows CORS for all endpoints
                        .allowedOrigins("http://localhost:5173")  // Specify the allowed origin
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allowed HTTP methods
                        .allowedHeaders("*")  // Allows all headers
                        .allowCredentials(true);  // Allows credentials (e.g., cookies)
            }
        };
    }
}
