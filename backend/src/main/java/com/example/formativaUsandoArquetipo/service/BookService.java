package com.example.formativaUsandoArquetipo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.formativaUsandoArquetipo.model.Book;
import com.example.formativaUsandoArquetipo.model.BookFactory;
import com.example.formativaUsandoArquetipo.repository.BookRepository;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BookFactory bookFactory;

    @Autowired
    public BookService(BookRepository bookRepository, BookFactory bookFactory) {
        this.bookRepository = bookRepository;
        this.bookFactory = bookFactory;
    }

    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> findBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public Book createBook(String title, String author, Integer year, String genre) {
        Book book = bookFactory.createBook(title, author, year, genre);
        return bookRepository.save(book);
    }
} 