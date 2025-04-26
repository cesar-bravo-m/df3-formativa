import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { Book } from '../models/book';
import { firstValueFrom, lastValueFrom } from 'rxjs';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const apiUrl = 'http://localhost:8080/api/books';

  const mockBook: Book = {
    id: 1,
    title: 'Libro de Prueba',
    author: 'Autor de Prueba',
    year: 2024,
    genre: 'Género de Prueba'
  };

  const mockBooks: Book[] = [
    mockBook,
    {
      id: 2,
      title: 'Segundo Libro',
      author: 'Segundo Autor',
      year: 2023,
      genre: 'Ficción'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        BookService,
        HttpClient
      ]
    });

    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería tener la URL base correcta', () => {
    expect(service['apiUrl']).toBe(apiUrl);
  });

  describe('getBooks', () => {
    it('debería manejar error al obtener libros', async () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error del servidor',
        status: 500,
        statusText: 'Internal Server Error'
      });

      const booksPromise = lastValueFrom(service.getBooks());

      const req = httpMock.expectOne(apiUrl);
      req.flush('Error del servidor', errorResponse);

      try {
        await booksPromise;
        fail('Debería haber lanzado un error');
      } catch (error: any) {
        expect(error.status).toBe(500);
        expect(error.error).toBe('Error del servidor');
      }
    });

    it('debería manejar respuesta vacía', async () => {
      const booksPromise = firstValueFrom(service.getBooks());

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);

      const books = await booksPromise;
      expect(books).toEqual([]);
    });
  });
});
