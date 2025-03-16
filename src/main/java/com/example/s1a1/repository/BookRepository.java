package com.example.s1a1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.s1a1.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
} 