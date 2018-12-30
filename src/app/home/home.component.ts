import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {ActivatedRoute} from '@angular/router';
import {timer} from 'rxjs';
import {utf8Encode} from '@angular/compiler/src/util';
import * as sjcl from 'sjcl';
import * as ab2str from 'arraybuffer-to-string';
import * as str2ab from 'string-to-arraybuffer';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message_id;
  email;
  infoShown: boolean;
  info;


  constructor(private _route: ActivatedRoute) {
    console.log(this.generateRandomKey(30));
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    console.log(iv);
  }

  generateRandomKey(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!&-+';

    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  // source: http://stackoverflow.com/a/11058858
  str2ab(base64) {
    const binary_string =  window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  ab2str(buffer) {
    let binary = '';
    const bytes = new Uint8Array( buffer );
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  switchInfoShwon(){
    this.infoShown = !this.infoShown;
  }

  ngOnInit() {
    this.message_id = this._route.snapshot.params.message_id;
    this.email = this._route.snapshot.params.arg;
    switch (this.message_id) {
      case '357':
        this.infoShown = true;
        this.info = 'An e-mail has been sent to <span class="pink-text darken-3">' + this.email + '</span> with further instructions.';
        setTimeout(() =>{
          this.switchInfoShwon();
        }, 4000);
        break;
    }
  }

}
