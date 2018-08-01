import { Component, OnInit } from '@angular/core';

declare var responsiveVoice: any;

@Component({
  selector: 'app-choosen-img',
  templateUrl: './choosen-img.component.html',
  styleUrls: ['./choosen-img.component.scss']
})
export class ChoosenImgComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  playVoice(){
    responsiveVoice.speak('Wie geht es dir', 'Deutsch Female', {rate: 0.8});
  }
}
