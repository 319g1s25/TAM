import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ta-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ta-detail.component.html',
  styleUrls: ['./ta-detail.component.css']
})
export class TADetailComponent {
  // You can fetch TA details via route params here later
}
