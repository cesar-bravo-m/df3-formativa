package com.example.s1a1.model;

public interface BookFactory {
    Book createBook(String title, String author, Integer year, String genre);
    Book createBook();
} 