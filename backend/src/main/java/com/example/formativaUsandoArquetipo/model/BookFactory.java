package com.example.formativaUsandoArquetipo.model;

public interface BookFactory {
    Book createBook(String title, String author, Integer year, String genre);
    Book createBook();
} 