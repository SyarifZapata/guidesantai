import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SocketService} from '../socket.service';
import {Message} from '../utility/message';
import * as $ from 'jquery';
import * as M from 'materialize-css';
import {timestamp} from 'rxjs/operators';

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

  msgs = [];

  constructor(private _dataService: DataService, private _route: ActivatedRoute, private socketService: SocketService) {
   this.room_id = this._route.snapshot.params.room_id;
   this.to_id = this._route.snapshot.params.to_id;
   console.log(this._dataService.currentUser);
   if(_dataService.currentUser.user_id){
     this.my_id = this._dataService.currentUser.user_id;
   } else{
     this.my_id = this._dataService.currentUser.user_id;
   }
   this.username = this._dataService.currentUser.username;
   this._dataService.getUser({id: this.to_id}).subscribe(
     data => {
       // @ts-ignore
       this.partnerName = data.username;
       // @ts-ignore
       this.partnerPicture = data.picture;
       console.log(data);
     }
   );
   this._dataService.getMessages({room_id: this.room_id}).subscribe(
     data => {
       this.isDataLoaded = true;
       console.log(data);
       // @ts-ignore
       data.forEach(element => {
         if(element.from_id === this.my_id){
           this.msgs.push(new Message( 'me', element.message, this.formatDate(new Date(element.createdAt))));
         } else{
           this.msgs.push(new Message('she', element.message, this.formatDate(new Date(element.createdAt))));
         }
       });
     }
   );
  }

  ngOnInit() {
    this.socketService.onMessage().subscribe(
      data => {
        if(data.from === this.my_id){
          this.msgs.push(new Message( 'me', data.content, data.createdAt));
        }else{
          this.msgs.push(new Message('she', data.content, data.createdAt));
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
      const message = new Message(this.my_id, this.textValue, this.formatDate(new Date()));
      this._dataService.sendMessage({room_id:this.room_id, from_id:this.my_id, message:this.textValue}).subscribe(
        data => {
          console.log(data);
        }
      );
      this.socketService.send(message);
      this.resetInput();
      window.setTimeout(function () {
        $('#msgPool').scrollTop($('#msgPool')[0].scrollHeight);
      }, 50); // wait 50ms until new message appears, else it will scroll to second last message.
    }
  }

  formatDate(date:Date){
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()] + ", "+ date.getHours() +":"+ date.getMinutes();
  }


}
