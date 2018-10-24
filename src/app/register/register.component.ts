import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup = new FormGroup({
    email: new FormControl(null,[Validators.email, Validators.required]),
    username: new FormControl(null, [Validators.required]),
    cEmail: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])

  });

  constructor() { }

  ngOnInit() {
  }

  register(){
    if(!this.registerForm.valid || (this.registerForm.controls.email.value != this.registerForm.controls.cEmail.value)){
      console.log('Invalid Form'); return;
    }else {
      console.log(JSON.stringify(this.registerForm.value));
    }
  }

}
