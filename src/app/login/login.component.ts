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

  message_id;
  infoShown = false;
  info;

  errorMessage = '';
  errorStyle: boolean;
  classValidation = {
    'validate' : true,
    'invalid' : false
  };


  constructor(private  _dataService: DataService, private route: ActivatedRoute, private router: Router, private _route: ActivatedRoute) {

  }

  ngOnInit() {
    this.message_id = this._route.snapshot.params.message_id;
    switch (this.message_id) {
      case '357':
        this.infoShown = true;
        this.info = 'Success! Your password has been changed.';
        setTimeout(() =>{
          this.switchInfoShwon();
        }, 4000);
        break;
    }
  }

  switchInfoShwon(){
    this.infoShown = !this.infoShown;
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
