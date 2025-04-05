import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;
  isEditing = false;
  newBook: Book = {
    title: '',
    author: '',
    year: new Date().getFullYear(),
    genre: ''
  };

  get formTitle(): string {
    return this.isEditing ? this.selectedBook!.title : this.newBook.title;
  }

  get formAuthor(): string {
    return this.isEditing ? this.selectedBook!.author : this.newBook.author;
  }

  get formYear(): number {
    return this.isEditing ? this.selectedBook!.year : this.newBook.year;
  }

  get formGenre(): string {
    return this.isEditing ? this.selectedBook!.genre || '' : this.newBook.genre || '';
  }

  set formTitle(value: string) {
    if (this.isEditing) {
      this.selectedBook!.title = value;
    } else {
      this.newBook.title = value;
    }
  }

  set formAuthor(value: string) {
    if (this.isEditing) {
      this.selectedBook!.author = value;
    } else {
      this.newBook.author = value;
    }
  }

  set formYear(value: number) {
    if (this.isEditing) {
      this.selectedBook!.year = value;
    } else {
      this.newBook.year = value;
    }
  }

  set formGenre(value: string) {
    if (this.isEditing) {
      this.selectedBook!.genre = value;
    } else {
      this.newBook.genre = value;
    }
  }

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }

  selectBook(book: Book): void {
    this.selectedBook = book;
    this.isEditing = true;
  }

  createBook(): void {
    if (this.validateBook(this.newBook)) {
      this.bookService.createBook(this.newBook).subscribe(() => {
        this.loadBooks();
        this.resetForm();
      });
    }
  }

  updateBook(): void {
    if (this.selectedBook && this.validateBook(this.selectedBook)) {
      this.bookService.updateBook(this.selectedBook.id!, this.selectedBook).subscribe(() => {
        this.loadBooks();
        this.resetForm();
      });
    }
  }

  deleteBook(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este libro?')) {
      this.bookService.deleteBook(id).subscribe(() => {
        this.loadBooks();
        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.selectedBook = null;
    this.isEditing = false;
    this.newBook = {
      title: '',
      author: '',
      year: new Date().getFullYear(),
      genre: ''
    };
  }

  private validateBook(book: Book): boolean {
    if (!book.title || book.title.length > 255) {
      alert('El título es requerido y debe ser menor a 255 caracteres');
      return false;
    }
    if (!book.author || book.author.length > 255) {
      alert('El autor es requerido y debe ser menor a 255 caracteres');
      return false;
    }
    if (!book.year || book.year < 0 || book.year > 9999) {
      alert('El año debe estar entre 0 y 9999');
      return false;
    }
    if (book.genre && book.genre.length > 100) {
      alert('El género debe ser menor a 100 caracteres');
      return false;
    }
    return true;
  }
}
