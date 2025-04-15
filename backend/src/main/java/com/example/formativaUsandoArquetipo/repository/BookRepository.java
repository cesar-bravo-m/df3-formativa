package com.example.formativaUsandoArquetipo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.formativaUsandoArquetipo.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
} 