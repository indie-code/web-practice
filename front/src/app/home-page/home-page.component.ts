import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../auth/auth.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.get('auth/user').subscribe(data => console.log(data));
  }

}
