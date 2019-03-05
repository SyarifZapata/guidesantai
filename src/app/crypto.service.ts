import {Injectable} from '@angular/core';
import * as crypto from 'crypto-browserify';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  // production = '139.162.182.153';
  production = 'localhost';

  constructor(private _http: HttpClient) {
  }

  generateSecret() {
    return this._http.get('http://' + this.production + ':3000/auth/generateSecret',
      { observe: 'body', withCredentials: true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getCode() {
    return this._http.get('http://' + this.production + ':3000/auth/getCode',
      {observe: 'body', withCredentials: true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  login2fa(body: any) {
    return this._http.post('http://' + this.production + ':3000/auth/compareToken', body,
      { observe: 'body', withCredentials: true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

}

