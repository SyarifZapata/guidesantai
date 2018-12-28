import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  resetForm: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    password2: new FormControl(null, [Validators.required])

  });

  token;
  errorMessage = '';
  errorStyle: boolean;
  classValidation = {
    'validate' : true,
    'invalid' : false
  };

  constructor(private _dataService: DataService, private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.token = this._route.snapshot.params.token;
  }

  resetPassword(){
    if(!this.resetForm.valid || (this.resetForm.controls.password.value !== this.resetForm.controls.password2.value)){
      console.log('Passwords are not equal');
      this.errorMessage = 'The passwords are not equal!';
      this.errorStyle = true;
      this.classValidation.invalid = true;
      return;
    } else {
      console.log(this.resetForm.value);
      this._dataService.resetPassword(this.resetForm.value, this.token)
        .subscribe((res) =>{
            console.log(res);
            this._router.navigate(['/login']);
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
