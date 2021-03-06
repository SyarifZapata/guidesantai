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
  chatPassword: string;
  // production = '139.162.182.153';
  production = 'localhost';

  constructor(private _http: HttpClient) { }


  // register new user
  addUser(body:any){
    return this._http.post('http://'+this.production+':3000/auth/register',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  setChatPassword(password){
    this.chatPassword = password;
  }

  login(body:any){
    return this._http.post('http://'+this.production+':3000/auth/login',
      body, { observe: 'body',
        withCredentials:true,
        headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  user(){
    return this._http.get('http://'+this.production+':3000/auth/user',
      {observe: 'body',
        withCredentials:true,
        headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  findUser(body:any){
    return this._http.post('http://'+this.production+':3000/chat/finduser',
      body, { observe: 'body',
        withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  inviteUser(body:any){
    return this._http.post('http://'+this.production+':3000/chat/invitechat',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  cancelRequest(body:any){
    return this._http.post('http://'+this.production+':3000/chat/cancelrequest',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  needToApprove(){
    return this._http.get('http://'+this.production+':3000/chat/needtoapprove',
      {observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  acceptRequest(body:any){
    return this._http.post('http://'+this.production+':3000/chat/acceptrequest',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  rejectRequest(body:any){
    return this._http.post('http://'+this.production+':3000/chat/rejectrequest',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getFriends(){
    return this._http.get('http://'+this.production+':3000/chat/getfriends',
      { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getRoom(body:any){
    return this._http.post('http://'+this.production+':3000/chat/getroom',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  updateSecret(body: any){
    return this._http.post('http://'+this.production+':3000/chat/update-secret',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  logout(){
    return this._http.get('http://'+this.production+':3000/auth/logout',
      {observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  setLogginStatus(value){
    this.loggedInStatusChange.next(value);
  }

  setProfilPicture(value){
    this.profilPictureChange.next(value);
  }

  saveSettings(body:any){
    return this._http.post('http://'+this.production+':3000/auth/saveSettings',
      body, { observe:'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  setClientInfo(value:any){
    this.currentUser = value;
  }

  setChatPatner(value:any){
    this.chatPatner = value;
  }

  getUser(body:any){
    return this._http.post('http://'+this.production+':3000/chat/getuser',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  sendMessage(body:any){
    return this._http.post('http://'+this.production+':3000/chat/send',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  getMessages(body: any){
    return this._http.post('http://'+this.production+':3000/chat/getmessages',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }


  getRegistrationChallenge(){
    return this._http.get('http://'+this.production+':3000/u2f/u2fregistration',
      { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  sendSolution(body:any){
    return this._http.post('http://'+this.production+':3000/u2f/solution',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  askU2f(){
    return this._http.get('http://'+this.production+':3000/u2f/asku2f',
      { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  validationU2f(body: any){
    return this._http.post('http://'+this.production+':3000/u2f/validationu2f',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  clientCert(){
    return this._http.get('http://'+this.production+':3000/auth/clientcertificate',
      { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  forgotPassword(body:any){
    return this._http.post('http://'+this.production+':3000/auth/forgot-password',
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }

  resetPassword(body:any, token){
    return this._http.post('http://'+this.production+':3000/auth/reset/' + token,
      body, { observe: 'body', withCredentials:true, headers: new HttpHeaders().append('Content-Type', 'application/json')});
  }
}


