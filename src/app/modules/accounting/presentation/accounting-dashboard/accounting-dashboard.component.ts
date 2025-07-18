import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounting-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accounting-dashboard-container">
      <h1>Accounting Dashboard</h1>
      <p>Accounting dashboard component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .accounting-dashboard-container {
      padding: 2rem;
    }
  `]
})
export class AccountingDashboardComponent {
}
