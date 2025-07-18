import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-form-container">
      <h1>User Form</h1>
      <p>User form component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .user-form-container {
      padding: 2rem;
    }
  `]
})
export class UserFormComponent {
}
