import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent {
  // You can fetch TA details via route params here later
}
