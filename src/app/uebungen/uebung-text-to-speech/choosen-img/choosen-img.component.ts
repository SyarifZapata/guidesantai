import { Component, OnInit } from '@angular/core';
import {SharedFunctionsService} from '../../../shared-functions.service';


@Component({
  selector: 'app-choosen-img',
  templateUrl: './choosen-img.component.html',
  styleUrls: ['./choosen-img.component.scss']
})
export class ChoosenImgComponent implements OnInit {
  text = '';

  constructor(private _sharedFunctionsService: SharedFunctionsService) { }

  ngOnInit() {
  }

  playVoice(){
    this._sharedFunctionsService.playVoice(this.text);
  }


}
