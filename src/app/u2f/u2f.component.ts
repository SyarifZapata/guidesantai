import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import * as u2f from 'u2f-api-polyfill';


@Component({
  selector: 'app-u2f',
  templateUrl: './u2f.component.html',
  styleUrls: ['./u2f.component.scss']
})
export class U2fComponent implements OnInit {
  registrationRequest;

  constructor(private _dataService: DataService) {
    console.log(u2f);
  }

  ngOnInit() {
  }

  registerU2f(){
    this._dataService.getRegistrationChallenge().subscribe(
      data => {
        this.registrationRequest = data;
        console.log(this.registrationRequest);

        // @ts-ignore
        window.u2f.register(this.registrationRequest.appId, [this.registrationRequest], [], (registrationResponse) => {
          // Send this registration response to the registration verification server endpoint
          console.log('hallooo');
          this._dataService.sendSolution({registrationResponse: registrationResponse}).subscribe(
            status => {
              console.log(status);
            }
          );
        });
      }
    );
  }

}
