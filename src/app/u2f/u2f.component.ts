import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import * as u2f from 'u2f-api-polyfill';
import * as $ from 'jquery';


@Component({
  selector: 'app-u2f',
  templateUrl: './u2f.component.html',
  styleUrls: ['./u2f.component.scss']
})
export class U2fComponent implements OnInit {
  authRequest;
  challenge;
  amount;
  message;

  constructor(private _dataService: DataService) {
    console.log(u2f);
  }

  ngOnInit() {
  }

  verifyU2f(){
    if(this.amount > 0 && this.amount < 1000){
      $('#mess').text('Money Transferred!').attr('class', 'green-text');
    }else{
      $('#mess').text('Please insert your Google Titan and touch the chip!').attr('class', 'red-text');
      this._dataService.askU2f().subscribe(
        data => {
          console.log(data);
          // @ts-ignore
          this.authRequest = data.authRequest;  // Retrieve this from hitting the authentication challenge endpoint
          // @ts-ignore
          this.challenge = data.challenge;
          // @ts-ignore
          window.u2f.sign(this.authRequest.appId, this.challenge, [this.authRequest], (authResponse) => {
            this._dataService.validationU2f({authResponse: authResponse}).subscribe(
              status => {
                // @ts-ignore
                if(status.message){
                  // @ts-ignore
                  $('#mess').text(status.message).attr('class', 'green-text');
                }else{
                  $('#mess').text('Sorry we could not validate your key. Your transfer will not be proceeded!').attr('class', 'red-text');
                }
              }
            );
          });
        }
      );
    }
  }

  onKey(event){
    this.amount = event.target.value;
  }

}
