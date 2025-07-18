import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="provider-list-container">
      <h1>Provider Management</h1>
      <p>Provider list component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .provider-list-container {
      padding: 2rem;
    }
  `]
})
export class ProviderListComponent {
}
