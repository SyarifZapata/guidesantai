import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
  }

  values = '';

  onKey(event: any) { // without type info
    this.values = event.target.value;
    console.log(this.values);
  }

}
