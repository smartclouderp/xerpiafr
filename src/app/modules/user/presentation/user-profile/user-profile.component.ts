import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-profile-container">
      <h1>User Profile</h1>
      <p>User profile component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .user-profile-container {
      padding: 2rem;
    }
  `]
})
export class UserProfileComponent {
}
