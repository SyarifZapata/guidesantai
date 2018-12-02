import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../data.service';
import {CryptoService} from '../crypto.service';

@Component({
  selector: 'app-two-fa',
  templateUrl: './two-fa.component.html',
  styleUrls: ['./two-fa.component.scss']
})
export class TwoFAComponent implements OnInit {
  token: any;

  constructor(private _router: Router, private _dataService: DataService, private _cryptoService: CryptoService) {
    this._dataService.user().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
        this._router.navigate(['/login']);
      });
  }

  ngOnInit() {
  }

  onKey(event){
    this.token = event.target.value;
  }

  login2fa() {
    console.log(this.token);
    this._cryptoService.login2fa({token: this.token}).subscribe(
      data => {
        // @ts-ignore
        if(data.verified){
          this._router.navigate(['/user']);
        }else{
          console.log('wrong Token');
        }
      }
    );
  }

}
