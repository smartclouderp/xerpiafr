import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounting-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accounting-reports-container">
      <h1>Accounting Reports</h1>
      <p>Accounting reports component will be implemented here.</p>
    </div>
  `,
  styles: [`
    .accounting-reports-container {
      padding: 2rem;
    }
  `]
})
export class AccountingReportsComponent {
}
