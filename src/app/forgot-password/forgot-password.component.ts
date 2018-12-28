import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email;

  constructor(private _dataService: DataService, private _router: Router) { }

  ngOnInit() {
  }

  onKey(event){
    this.email = event.target.value;
  }

  resetPassword(){
    this._dataService.forgotPassword({email: this.email}).subscribe(
      data => {
        this._router.navigate(['/home', 357, this.email]);
      }
    );
  }

}
