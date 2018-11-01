import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';

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

  constructor(private  _dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  errorMessage = '';
  errorStyle: boolean;
  classValidation = {
    'validate' : true,
    'invalid' : false
  };

  ngOnInit() {
  }

  register(){
    if(!this.registerForm.valid || (this.registerForm.controls.email.value != this.registerForm.controls.cEmail.value)){
      console.log('Invalid Form'); return;
    }else {
       this._dataService.addUser(this.registerForm.value)
          .subscribe((res) =>{
        console.log(res);
      },
          error => {
            console.log(error);
            this.errorStyle = true;
            this.errorMessage = error.error.message;
            this.classValidation.invalid = true;
          }
            );
    }
  }

}
