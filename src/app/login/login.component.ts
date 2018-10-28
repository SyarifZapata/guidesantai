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
    email:new FormControl(null,Validators.required),
    password:new FormControl(null,Validators.required)
  });
  constructor(private  _dataService: DataService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
  }

  login(){
    if(!this.loginForm.valid){
      console.log('Invalid Login'); return;
    }else {
      this._dataService.login(this.loginForm.value)
        .subscribe((res) =>{
          console.log(res);

          // this.router.navigate(['/uebungen', this.values],{relativeTo: this.route});
        });
    }
  }

}
