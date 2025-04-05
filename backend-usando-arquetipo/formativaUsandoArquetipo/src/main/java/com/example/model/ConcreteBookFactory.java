package com.example.model;

import org.springframework.stereotype.Component;

@Component
public class ConcreteBookFactory implements BookFactory {
    @Override
    public Book createBook(String title, String author, Integer year, String genre) {
        return new Book(title, author, year, genre);
    }

    @Override
    public Book createBook() {
        return new Book();
    }
} 