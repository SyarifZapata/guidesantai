import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup = new FormGroup({
    email:new FormControl(null,Validators.required), // email can also be username
    password:new FormControl(null,Validators.required)
  });

  errorMessage = '';
  errorStyle: boolean;
  classValidation = {
    'validate' : true,
    'invalid' : false
  };


  constructor(private  _dataService: DataService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
  }

  login(){
    if(!this.loginForm.valid){
      console.log('Invalid Login');
      this.errorMessage = 'Bitte Email und Password eingeben!';
      this.errorStyle = true;
      this.classValidation.invalid = true;
      return;
    }else {
      this.classValidation.invalid = false;
      this._dataService.login(JSON.stringify(this.loginForm.value))
        .subscribe(
          data => {
            console.log(data);
            this._dataService.setLogginStatus(true);
            this.router.navigate(['/user']);
          },
          err => {
            console.log(err.error.message);
            this.errorStyle = true;
            this.errorMessage = err.error.message;
            this.classValidation.invalid = true;
          }
        );
    }
  }

}
