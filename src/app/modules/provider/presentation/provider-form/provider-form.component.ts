import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="provider-form-container">
      <h1>Provider Form</h1>
      <p>Provider form component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .provider-form-container {
      padding: 2rem;
    }
  `]
})
export class ProviderFormComponent {
}
