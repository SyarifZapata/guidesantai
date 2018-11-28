import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {CryptoService} from '../crypto.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  qrcode: string;
  code:string;
  isDisabled:boolean = true;

  constructor(private _dataService: DataService, private _router: Router, private _cryptoService: CryptoService) {
    this._dataService.user().subscribe(
      data => {
        // @ts-ignore
        this.username = data.username;
        // data has picture property
        // @ts-ignore
      },
      error => {
        console.log(error);
        this._router.navigate(['/login']);
      }
    );
  }

  ngOnInit() {
  }

  getCode(){

    this._cryptoService.getCode().subscribe(
      data => {
        // @ts-ignore
        this.code = data.message;

      }
    )
  }

  generateSecret(){
    if(!this.isDisabled){
      this.qrcode = '';
      this.isDisabled = true;
    } else {
      this._cryptoService.generateSecret({}).subscribe(
        data => {
          // @ts-ignore
          this.qrcode = data.qrcode;
          this.isDisabled = false;
        }
      );
    }

  }

}
