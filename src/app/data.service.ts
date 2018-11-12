import { Injectable } from '@angular/core';
// import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /* This is an observable, every component can subscribe to the value of loggedInStatusChange */
  loggedInStatusChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  profilPictureChange: BehaviorSubject<string> = new BehaviorSubject<string>('./assets/img/profil/unknown_profile.png');
  loggedInStatus = this.loggedInStatusChange.asObservable();
  profilPicture = this.profilPictureChange.asObservable();

  constructor(private _http: HttpClient) { }


  // register new user
  addUser(body:any){
    return this._http.post('http://localhost:3000/auth/register',
      body, { observe:'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  login(body:any){
    return this._http.post('http://localhost:3000/auth/login',
      body, { observe:'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  user(){
    return this._http.get('http://localhost:3000/auth/user',
      {observe:'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  logout(){
    return this._http.get('http://localhost:3000/auth/logout',
      {observe:'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  setLogginStatus(value){
    this.loggedInStatusChange.next(value);
  }

  setProfilPicture(value){
    this.profilPictureChange.next(value);
  }

}


