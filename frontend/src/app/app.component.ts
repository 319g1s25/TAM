import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TA Management System';

  ngOnInit() {
    axios.get('http://localhost:5000/')
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  }
}
