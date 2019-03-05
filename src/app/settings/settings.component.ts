import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {CryptoService} from '../crypto.service';
import * as $ from 'jquery';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {


  constructor(private _dataService: DataService, private _router: Router, private _cryptoService: CryptoService, private sanitizer: DomSanitizer) {
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

  ngAfterViewInit() {
  }


}
