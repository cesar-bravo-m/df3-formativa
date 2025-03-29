import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './components/book-list/book-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookListComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-book-list></app-book-list>
    </div>
  `
})
export class AppComponent {
  title = 'Book Management System';
}
