import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {Message} from '../utility/message';
import {SocketService} from '../socket.service';
import * as $ from 'jquery';
import * as M from 'materialize-css';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, AfterViewInit {

  textValue: string;
  feedback: string;
  username: string;
  isDataLoaded:boolean;

  @ViewChild('chatInput')
  myChatInput: any;

  msgs = [
    new Message(1, 'me', 'This is a message'),
    new Message(2, 'she', 'An Example of class Message'),
    {id: 3, from: 'me', content: 'Lorem ipsum dolor sit amet'},
    {id: 4, from: 'she', content: 'Lorem ipsum dolor sit amet'},
    {id: 5, from: 'me', content: 'Lorem ipsum dolor sit amet. Very long text. Very long text. Very long text. Very long text.'},
    {id: 6, from: 'me', content: 'Lorem ipsum dolor sit amet'},
    {id: 7, from: 'she', content: 'Lorem ipsum dolor sit amet'},
  ];

  constructor(private _dataService: DataService, private _router: Router, private socketService: SocketService) {
    this._dataService.user().subscribe(
      data => {
        // @ts-ignore
        if(data.twoFALoggedIn === 'true'){
          this.isDataLoaded = true;
          this._dataService.setLogginStatus(true);
          // @ts-ignore
          this.username = data.username;
          this.socketService.online(this.username);
          // data has picture property
          // @ts-ignore
          if (data.picture) {
            // @ts-ignore
            this._dataService.setProfilPicture(data.picture);
          }
        }else{
          this._router.navigate(['/twofa']);
        }
      },
      error => {
        console.log(error);
        this._router.navigate(['/login']);
      }
    );
  }

  ngOnInit() {
    this.socketService.onMessage().subscribe(
      data => {
        this.msgs.push(data);
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

  ngAfterViewInit() {
    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems, {});
    });
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
      const message = new Message(1, 'me', this.textValue);
      this.socketService.send(message);
      this.resetInput();
      window.setTimeout(function () {
        $('#msgPool').scrollTop($('#msgPool')[0].scrollHeight);
      }, 50);//wait 50ms until new message appears, else it will scroll to second last message.
    }
  }


}
