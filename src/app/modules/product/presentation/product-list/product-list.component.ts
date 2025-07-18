import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-list-container">
      <h1>Product Management</h1>
      <p>Product list component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 2rem;
    }
  `]
})
export class ProductListComponent {
}
