import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {CryptoService} from '../crypto.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  qrcode: string;
  code: string;
  isDisabled = true;
  twoFa = false;
  savedMessage = '';

  constructor(private _dataService: DataService, private _router: Router, private _cryptoService: CryptoService) {
    this._dataService.user().subscribe(
      data => {
        // @ts-ignore
        this.username = data.username;
        // @ts-ignore
        this.twoFa = data.twoFAEnabled;
      },
      error => {
        console.log(error);
        this._router.navigate(['/login']);
      }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
  }

  getCode() {
    this._cryptoService.getCode().subscribe(
      data => {
        // @ts-ignore
        this.code = data.message;
      }
    );
  }

  generateSecret() {
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

  saveSettings() {
    this._dataService.saveSettings({
      twoFa: this.twoFa
    }).subscribe(
      data =>{
        this.savedMessage = 'Settings saved';
        this.clearMessage();
      }
    );
  }

  clearMessage(){
    setTimeout(() => {
      this.savedMessage = '';
    }, 3000);
  }

}
