import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm:FormGroup = new FormGroup({
    username:new FormControl(null,Validators.required),
    password:new FormControl(null,Validators.required)
  });
  constructor() {

  }

  ngOnInit() {
  }

  login(){
    if(!this.loginForm.valid){
      console.log('Invalid Login'); return;
    }else {
      console.log(JSON.stringify(this.loginForm.value));
    }
  }

}
