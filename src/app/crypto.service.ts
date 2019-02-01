import {Injectable} from '@angular/core';
import * as crypto from 'crypto-browserify';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  diffieHellman: any;

  constructor(private _http: HttpClient) {
  }

  createDH(prime, generator) {
    this.diffieHellman = crypto.createDiffieHellman(prime, generator);
    return new Promise((resolve, reject) => {
      resolve(this.diffieHellman);
    });
  }

  storeSecret(body:any){
    return this._http.post('http://localhost:3000/crypto-keys/store-secret',
      { observe: 'body', withCredentials: true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getPrimeAndGen() {
    return this._http.get('http://localhost:3000/cryptoKey/getKeys',
      {observe: 'body', withCredentials: true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  generateSecret() {
    return this._http.get('http://localhost:3000/auth/generateSecret',
      { observe: 'body', withCredentials: true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getCode(){
    return this._http.get('http://localhost:3000/auth/getCode',
      {observe: 'body', withCredentials: true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  login2fa(body:any){
    return this._http.post('http://localhost:3000/auth/compareToken', body,
      { observe: 'body', withCredentials: true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

}

