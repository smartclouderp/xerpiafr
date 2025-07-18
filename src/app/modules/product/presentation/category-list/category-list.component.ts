import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="category-list-container">
      <h1>Category Management</h1>
      <p>Category list component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .category-list-container {
      padding: 2rem;
    }
  `]
})
export class CategoryListComponent {
}
