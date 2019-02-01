import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {CryptoService} from '../crypto.service';
import * as $ from 'jquery';
import {DomSanitizer} from '@angular/platform-browser';
import * as u2f from 'u2f-api-polyfill';
import {textBinding} from '@angular/core/src/render3/instructions';

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
  downloadJsonHref;
  publicReady = false;
  textAreaValue;
  registrationRequest;
  u2fmessage: any;
  chatPassword;


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
    console.log(u2f);
  }

  ngAfterViewInit() {
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
    if (!this.isDisabled) {
      this.qrcode = '';
      this.isDisabled = true;
    } else {
      this._cryptoService.generateSecret().subscribe(
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
      data => {
        this.savedMessage = 'Settings saved';
        this.clearMessage();
      }
    );
  }

  clearMessage() {
    setTimeout(() => {
      this.savedMessage = '';
    }, 3000);
  }

  generateKeys() {
    const keyPair = window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    ).then((key) => {
      crypto.subtle.exportKey('jwk', key.publicKey).then((publicKey) => {
        const theJSON = '{"id":' + this._dataService.currentUser.user_id + ',"public_key":' + JSON.stringify(publicKey) + '}';
        const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
        this.downloadJsonHref = uri;
        this.publicReady = true;
        localStorage.setItem('mypublickey', JSON.stringify(publicKey));
      });
      crypto.subtle.exportKey('jwk', key.privateKey).then((privateKey) => {
        const theJSON = '{"id":' + this._dataService.currentUser.user_id + ',"privatekey":' + JSON.stringify(privateKey) + '}';
        localStorage.setItem('myprivatekey', JSON.stringify(privateKey));
      });
    });
  }

  addUserKey() {
    const theJSON = JSON.parse(this.textAreaValue);
    console.log(theJSON.id);
    console.log(theJSON.public_key);
    localStorage.setItem(theJSON.id, JSON.stringify(theJSON.public_key));
  }

  registerU2f() {
    this._dataService.getRegistrationChallenge().subscribe(
      data => {
        this.registrationRequest = data;
        console.log(this.registrationRequest);
        this.u2fmessage = 'Please touch your key';

        // @ts-ignore
        window.u2f.register(this.registrationRequest.appId, [this.registrationRequest], [], (registrationResponse) => {
          // Send this registration response to the registration verification server endpoint
          this._dataService.sendSolution({registrationResponse: registrationResponse}).subscribe(
            status => {
              // @ts-ignore
              $('#u2fmess').text(status.message);
              // @ts-ignore
              console.log(status.message);
            }
          );
        });
      }
    );
  }

  onKey(event){
    this.chatPassword = event.target.value;
  }

  addChatPassword() {
    if (this.chatPassword !== '') {
      this._dataService.setChatPassword(this.chatPassword);
      console.log(this._dataService.chatPassword);
    }
  }

}
