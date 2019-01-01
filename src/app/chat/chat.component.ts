import {Component, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from '../utility/message';
import * as $ from 'jquery';
import * as M from 'materialize-css';
import * as io from 'socket.io-client';
import * as sjcl from 'sjcl';
import * as ab2str from 'arraybuffer-to-string';
import * as str2ab from 'string-to-arraybuffer';
import {Observable} from 'rxjs';


@Injectable()
export class SocketService implements OnDestroy{
  socket;
  constructor(){
  this.socket = io();
  }



  public online(username){
    this.socket.emit('username', username);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public sendFeedback(name): void {
    this.socket.emit('typing', name);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public onFeedback(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('typing', (data: string) => observer.next(data));
    });
  }

  public logout(){
    this.socket.emit('logout');
  }

  ngOnDestroy(){
  }
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit {

  textValue: string;
  feedback: string;
  username: string;
  isDataLoaded: boolean;

  partnerName: string;
  partnerPicture: string;
  room_id;
  my_id;
  to_id;
  secretKeys;

  @ViewChild('chatInput')
  myChatInput: any;

  msgs = [];

  constructor(private _dataService: DataService, private _route: ActivatedRoute, private socketService: SocketService) {
   this.room_id = this._route.snapshot.params.room_id;
   this.to_id = this._route.snapshot.params.to_id;
   console.log('currentuser', this._dataService.currentUser);
   console.log(this.to_id);
   if(_dataService.currentUser.user_id){
     this.my_id = this._dataService.currentUser.user_id;
   } else{
     this.my_id = this._dataService.currentUser.user_id;
   }
   console.log(this.my_id);
   this.username = this._dataService.currentUser.username;
   this._dataService.getUser({id: this.to_id}).subscribe(
     data => {
       // @ts-ignore
       this.partnerName = data.username;
       // @ts-ignore
       this.partnerPicture = data.picture;

       this._dataService.getMessages({room_id: this.room_id}).subscribe(
         theData => {
           this.isDataLoaded = true;
           console.log(theData);
           // @ts-ignore
           let secret = theData.secret;
           secret = JSON.parse(secret);
           let jwk = sjcl.decrypt(this._dataService.chatPassword, secret);
           jwk = JSON.parse(jwk);
           this.importAes(jwk).then((aesKey) =>{
             this.secretKeys = aesKey;
             // Todo findout how to get the IV
             // @ts-ignore
             theData.messages.forEach(element => {
               const tobedecrypt = JSON.parse(element.message);
               const text = this.decryptAes(aesKey, str2ab(tobedecrypt.iv), str2ab(tobedecrypt.message)).then((decrypted) =>{
                 if(element.from_id === this.my_id.toString()){
                   this.msgs.push(new Message( 'she', ab2str(decrypted), this.formatDate(new Date(element.createdAt))));
                 } else {
                   this.msgs.push(new Message('me', ab2str(decrypted), this.formatDate(new Date(element.createdAt))));
                 }
               });
             });
           });
         }
       );
     }
   );
  }

  ngOnInit() {
    this.socketService.onMessage().subscribe(
      data => {
        // if(data.from === this.my_id){
        //   this.msgs.push(new Message( 'me', data.content, data.createdAt));
        // }else{
        //   this.msgs.push(new Message('she', data.content, data.createdAt));
        // }
        const tobedecrypt = JSON.parse(data.content);
        console.log(tobedecrypt);
        const text = this.decryptAes(this.secretKeys, str2ab(tobedecrypt.iv), str2ab(tobedecrypt.message)).then((decrypted) =>{
          // @ts-ignore
          if(data.from_id === this.my_id.toString()){
            console.log('yow');
            this.msgs.push(new Message( 'me', ab2str(decrypted), data.createdAt));
          } else {
            console.log('heeh');
            this.msgs.push(new Message('she', ab2str(decrypted), data.createdAt));
          }
          this.feedback = '';
          window.setTimeout(function () {
            $('#msgPool').scrollTop($('#msgPool')[0].scrollHeight);
          }, 50); // wait 50ms until new message appears, else it will scroll to second last message.
        });
      },
      error => {
        console.log(error);
      }
    );

    this.socketService.onFeedback().subscribe(
      data => {
        this.feedback = data + ' is typing a message...';
      },
      error => {
        console.log(error);
      }
    );
  }

  importAes(jwk){
    return crypto.subtle.importKey('jwk', jwk, {name: 'AES-GCM'}, true, ['encrypt', 'decrypt']);
  }

  encryptAes(key, iv, plainText: string){
    return crypto.subtle.encrypt(
      {name: 'AES-GCM', iv: iv }, key, str2ab(plainText));
  }

  decryptAes(key, iv, buffer){
    return window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      }, key, buffer
    );
  }

  resetInput() {
    this.myChatInput.nativeElement.value = '';
    this.textValue = '';
  }

  onKey(value: string, event) {
    this.textValue = value;
    this.socketService.sendFeedback(this.username);
    if (event.keyCode === 13) {
      this.send();
    }
  }

  send() {
    if (!(this.textValue.trim() === '')) {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      this.encryptAes(this.secretKeys, iv, this.textValue).then((encrypted) =>{
        const tobesent = JSON.stringify({iv: ab2str(iv, 'base64'), message: ab2str(encrypted, 'base64')});
        const message = new Message(this.my_id, tobesent, this.formatDate(new Date()));

        this.socketService.send(message);
        this.resetInput();
        window.setTimeout(function () {
          $('#msgPool').scrollTop($('#msgPool')[0].scrollHeight);
        }, 50); // wait 50ms until new message appears, else it will scroll to second last message.

        this._dataService.sendMessage({room_id: this.room_id, from_id: this.my_id, message: tobesent}).subscribe(
          data => {
            console.log(data);
          }
        );
      });
    }
  }

  formatDate(date: Date){
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()] + ", "+ date.getHours() +":"+ date.getMinutes();
  }


}
