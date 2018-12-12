import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SocketService} from '../socket.service';
import {Message} from '../utility/message';
import * as $ from 'jquery';
import * as M from 'materialize-css';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  textValue: string;
  feedback: string;
  username: string;
  isDataLoaded: boolean;

  partnerName:string;
  partnerPicture:string;
  room_id;
  my_id;
  to_id;

  @ViewChild('chatInput')
  myChatInput: any;

  msgs = [
    new Message(1, 'me', 'This is a message'),
    new Message(2, 'she', 'An Example of class Message'),

  ];

  constructor(private _dataService: DataService, private _route: ActivatedRoute, private socketService: SocketService) {
   this.room_id = this._route.snapshot.params.room_id;
   this.to_id = this._route.snapshot.params.to_id;
   console.log(this._dataService.currentUser);
   if(_dataService.currentUser.user_id){
     this.my_id = this._dataService.currentUser.user_id;
   } else{
     this.my_id = this._dataService.currentUser.facebook_id;
   }
   this.username = this._dataService.currentUser.username;
   this._dataService.getUser({id: this.to_id}).subscribe(
     data => {
       this.isDataLoaded = true;
       // @ts-ignore
       this.partnerName = data.username;
       // @ts-ignore
       this.partnerPicture = data.picture;
       console.log(data);
     }
   )
  }

  ngOnInit() {
    this.socketService.onMessage().subscribe(
      data => {
        if(data.from === this.my_id){
          this.msgs.push(new Message(0, 'me', data.content));
        }else{
          this.msgs.push(new Message(0, 'she', data.content));
        }
        this.feedback = '';
        window.setTimeout(function () {
          $('#msgPool').scrollTop($('#msgPool')[0].scrollHeight);
        }, 50); // wait 50ms until new message appears, else it will scroll to second last message.
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
      const message = new Message(1, this.my_id, this.textValue);
      this.socketService.send(message);
      this.resetInput();
      window.setTimeout(function () {
        $('#msgPool').scrollTop($('#msgPool')[0].scrollHeight);
      }, 50); // wait 50ms until new message appears, else it will scroll to second last message.
    }
  }


}
