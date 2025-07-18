import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list-container">
      <h1>User Management</h1>
      <p>User list component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 2rem;
    }
  `]
})
export class UserListComponent {
}
