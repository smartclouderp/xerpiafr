import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-form-container">
      <h1>Product Form</h1>
      <p>Product form component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .product-form-container {
      padding: 2rem;
    }
  `]
})
export class ProductFormComponent {
}
