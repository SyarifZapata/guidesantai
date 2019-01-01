import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as M from 'materialize-css';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  message_id;
  email;
  infoShown: boolean;
  info;


  constructor(private _route: ActivatedRoute) {
  }

  switchInfoShwon(){
    this.infoShown = !this.infoShown;
  }

  ngOnInit() {
    this.message_id = this._route.snapshot.params.message_id;
    this.email = this._route.snapshot.params.arg;
    switch (this.message_id) {
      case '357':
        this.infoShown = true;
        this.info = 'An e-mail has been sent to <span class="pink-text darken-3">' + this.email + '</span> with further instructions.';
        setTimeout(() =>{
          this.switchInfoShwon();
        }, 4000);
        break;
    }
  }

  ngAfterViewInit(){
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.modal');
      var instances = M.Modal.init(elems, {});
    });
  }

}
