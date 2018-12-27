import { Injectable } from '@angular/core';
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
  currentUser: any;
  chatPatner: any;

  constructor(private _http: HttpClient) { }


  // register new user
  addUser(body:any){
    return this._http.post('https://localhost:3000/auth/register',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  login(body:any){
    return this._http.post('https://localhost:3000/auth/login',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  user(){
    return this._http.get('https://localhost:3000/auth/user',
      {observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  findUser(body:any){
    return this._http.post('https://localhost:3000/chat/finduser',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  inviteUser(body:any){
    return this._http.post('https://localhost:3000/chat/invitechat',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  cancelRequest(body:any){
    return this._http.post('https://localhost:3000/chat/cancelrequest',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  needToApprove(){
    return this._http.get('https://localhost:3000/chat/needtoapprove',
      {observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  acceptRequest(body:any){
    return this._http.post('https://localhost:3000/chat/acceptrequest',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  rejectRequest(body:any){
    return this._http.post('https://localhost:3000/chat/rejectrequest',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getFriends(){
    return this._http.get('https://localhost:3000/chat/getfriends',
      { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getRoom(body:any){
    return this._http.post('https://localhost:3000/chat/getroom',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  logout(){
    return this._http.get('https://localhost:3000/auth/logout',
      {observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  setLogginStatus(value){
    this.loggedInStatusChange.next(value);
  }

  setProfilPicture(value){
    this.profilPictureChange.next(value);
  }

  saveSettings(body:any){
    return this._http.post('https://localhost:3000/auth/saveSettings',
      body, { observe:'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  setClientInfo(value:any){
    this.currentUser = value;
  }

  setChatPatner(value:any){
    this.chatPatner = value;
  }

  getUser(body:any){
    return this._http.post('https://localhost:3000/chat/getuser',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  sendMessage(body:any){
    return this._http.post('https://localhost:3000/chat/send',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getMessages(body: any){
    return this._http.post('https://localhost:3000/chat/getmessages',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }


  getRegistrationChallenge(){
    return this._http.get('https://localhost:3000/u2f/u2fregistration',
      { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  sendSolution(body:any){
    return this._http.post('https://localhost:3000/u2f/solution',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  askU2f(){
    return this._http.get('https://localhost:3000/u2f/asku2f',
      { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  validationU2f(body: any){
    return this._http.post('https://localhost:3000/u2f/validationu2f',
      body, { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  clientCert(){
    return this._http.get('https://localhost:3000/auth/clientcertificate',
      { observe: 'body', headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }
}


