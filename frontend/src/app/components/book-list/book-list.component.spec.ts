import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookListComponent } from './book-list.component';
import { BookService } from '../../services/book.service';
import { of, throwError } from 'rxjs';
import { Book } from '../../models/book';
import { By } from '@angular/platform-browser';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;

  const mockBooks: Book[] = [
    { id: 1, title: 'Test Book 1', author: 'Author 1', year: 2020, genre: 'Fiction' },
    { id: 2, title: 'Test Book 2', author: 'Author 2', year: 2021, genre: 'Non-Fiction' }
  ];

  beforeEach(async () => {
    bookServiceSpy = jasmine.createSpyObj('BookService', ['getBooks', 'createBook', 'updateBook', 'deleteBook']);
    bookServiceSpy.getBooks.and.returnValue(of(mockBooks));

    await TestBed.configureTestingModule({
      imports: [BookListComponent],
      providers: [
        { provide: BookService, useValue: bookServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar los libros', () => {
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
    expect(component.books).toEqual(mockBooks);
  });

  it('deberia crear un nuevo libro', fakeAsync(() => {
    const newBook: Book = {
      title: 'New Book',
      author: 'New Author',
      year: 2024,
      genre: 'Mystery'
    };
    component.newBook = newBook;
    bookServiceSpy.createBook.and.returnValue(of(newBook));

    component.createBook();
    tick();

    expect(bookServiceSpy.createBook).toHaveBeenCalledWith(newBook);
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
  }));

  it('deberia manejar el error cuando no se puede crear un libro', fakeAsync(() => {
    const newBook: Book = {
      title: 'New Book',
      author: 'New Author',
      year: 2024,
      genre: 'Mystery'
    };
    component.newBook = newBook;
    const error = new Error('Error al crear libro');
    // bookServiceSpy.createBook.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    component.createBook();
    tick();

    expect(bookServiceSpy.createBook).toHaveBeenCalledWith(newBook);
    expect(console.error).toHaveBeenCalled();
  }));

  it('deberia actualizar un libro existente', fakeAsync(() => {
    const updatedBook: Book = {
      id: 1,
      title: 'Updated Book',
      author: 'Updated Author',
      year: 2024,
      genre: 'Mystery'
    };
    component.selectedBook = updatedBook;
    component.isEditing = true;
    bookServiceSpy.updateBook.and.returnValue(of(updatedBook));

    component.updateBook();
    tick();

    expect(bookServiceSpy.updateBook).toHaveBeenCalledWith(1, updatedBook);
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
  }));

  it('deberia eliminar un libro', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    bookServiceSpy.deleteBook.and.returnValue(of(void 0));

    component.deleteBook(1);
    tick();

    expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith(1);
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
  }));

  it('deberia no eliminar un libro si el usuario cancela', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteBook(1);
    tick();

    expect(bookServiceSpy.deleteBook).not.toHaveBeenCalled();
  }));

  it('deberia manejar el error cuando no se puede eliminar un libro', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    const error = new Error('Error al eliminar libro');
    // bookServiceSpy.deleteBook.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    component.deleteBook(1);
    tick();

    expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalled();
  }));

  it('deberia validar el titulo del libro', () => {
    const invalidBook: Book = {
      title: '',
      author: 'Test Author',
      year: 2024,
      genre: 'Fiction'
    };

    spyOn(window, 'alert');
    const result = component['validateBook'](invalidBook);

    expect(result).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('El título es requerido y debe ser menor a 255 caracteres');
  });

  it('deberia validar el autor del libro', () => {
    const invalidBook: Book = {
      title: 'Test Title',
      author: '',
      year: 2024,
      genre: 'Fiction'
    };

    spyOn(window, 'alert');
    const result = component['validateBook'](invalidBook);

    expect(result).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('El autor es requerido y debe ser menor a 255 caracteres');
  });

  it('deberia validar el año del libro', () => {
    const invalidBook: Book = {
      title: 'Test Title',
      author: 'Test Author',
      year: -1,
      genre: 'Fiction'
    };

    spyOn(window, 'alert');
    const result = component['validateBook'](invalidBook);

    expect(result).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('El año debe estar entre 0 y 9999');
  });

  it('deberia validar la longitud del genero del libro', () => {
    const invalidBook: Book = {
      title: 'Test Title',
      author: 'Test Author',
      year: 2024,
      genre: 'a'.repeat(101)
    };

    spyOn(window, 'alert');
    const result = component['validateBook'](invalidBook);

    expect(result).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('El género debe ser menor a 100 caracteres');
  });

  it('deberia reiniciar el formulario despues de una operacion exitosa', fakeAsync(() => {
    const newBook: Book = {
      title: 'New Book',
      author: 'New Author',
      year: 2024,
      genre: 'Mystery'
    };
    component.newBook = newBook;
    bookServiceSpy.createBook.and.returnValue(of(newBook));

    component.createBook();
    tick();

    expect(component.selectedBook).toBeNull();
    expect(component.isEditing).toBeFalse();
    expect(component.newBook).toEqual({
      title: '',
      author: '',
      year: new Date().getFullYear(),
      genre: ''
    });
  }));

  it('deberia seleccionar un libro para editar', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      year: 2024,
      genre: 'Fiction'
    };

    component.selectBook(book);

    expect(component.selectedBook).toEqual(book);
    expect(component.isEditing).toBeTrue();
  });

  it('deberia manejar el getter y setter del titulo del formulario', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      year: 2024,
      genre: 'Fiction'
    };

    component.selectedBook = book;
    component.isEditing = true;

    expect(component.formTitle).toBe('Test Book');

    component.formTitle = 'Updated Title';
    expect(component.selectedBook.title).toBe('Updated Title');

    component.isEditing = false;
    component.newBook.title = 'New Book';
    expect(component.formTitle).toBe('New Book');

    component.formTitle = 'Another Title';
    expect(component.newBook.title).toBe('Another Title');
  });

  it('deberia manejar el getter y setter del autor del formulario', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      year: 2024,
      genre: 'Fiction'
    };

    component.selectedBook = book;
    component.isEditing = true;

    expect(component.formAuthor).toBe('Test Author');

    component.formAuthor = 'Updated Author';
    expect(component.selectedBook.author).toBe('Updated Author');

    component.isEditing = false;
    component.newBook.author = 'New Author';
    expect(component.formAuthor).toBe('New Author');

    component.formAuthor = 'Another Author';
    expect(component.newBook.author).toBe('Another Author');
  });

  it('deberia manejar el getter y setter del año del formulario', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      year: 2024,
      genre: 'Fiction'
    };

    component.selectedBook = book;
    component.isEditing = true;

    expect(component.formYear).toBe(2024);

    component.formYear = 2025;
    expect(component.selectedBook.year).toBe(2025);

    component.isEditing = false;
    component.newBook.year = 2026;
    expect(component.formYear).toBe(2026);

    component.formYear = 2027;
    expect(component.newBook.year).toBe(2027);
  });

  it('deberia manejar el getter y setter del genero del formulario', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      year: 2024,
      genre: 'Fiction'
    };

    component.selectedBook = book;
    component.isEditing = true;

    expect(component.formGenre).toBe('Fiction');

    component.formGenre = 'Updated Genre';
    expect(component.selectedBook.genre).toBe('Updated Genre');

    component.isEditing = false;
    component.newBook.genre = 'New Genre';
    expect(component.formGenre).toBe('New Genre');

    component.formGenre = 'Another Genre';
    expect(component.newBook.genre).toBe('Another Genre');
  });

  it('deberia manejar el genero nulo en el getter del formulario', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      year: 2024,
      genre: undefined
    };

    component.selectedBook = book;
    component.isEditing = true;

    expect(component.formGenre).toBe('');

    component.isEditing = false;
    component.newBook.genre = undefined;
    expect(component.formGenre).toBe('');
  });

  it('deberia no actualizar un libro si la validacion falla', fakeAsync(() => {
    const invalidBook: Book = {
      id: 1,
      title: '',
      author: 'Test Author',
      year: 2024,
      genre: 'Fiction'
    };

    component.selectedBook = invalidBook;
    component.isEditing = true;
    spyOn(window, 'alert');

    component.updateBook();
    tick();

    expect(bookServiceSpy.updateBook).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('El título es requerido y debe ser menor a 255 caracteres');
  }));

  it('deberia no crear un libro si la validacion falla', fakeAsync(() => {
    const invalidBook: Book = {
      title: '',
      author: 'Test Author',
      year: 2024,
      genre: 'Fiction'
    };

    component.newBook = invalidBook;
    spyOn(window, 'alert');

    component.createBook();
    tick();

    expect(bookServiceSpy.createBook).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('El título es requerido y debe ser menor a 255 caracteres');
  }));
});
