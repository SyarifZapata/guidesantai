import { Component, OnInit } from '@angular/core';
import {SharedFunctionsService} from '../../../../shared-functions.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-img-list',
  templateUrl: './img-list.component.html',
  styleUrls: ['./img-list.component.scss']
})
export class ImgListComponent implements OnInit {
  currentId = 0;
  images: Array<{id: number, text: String}> = [] ;


  text = 'trinken';

  constructor(private _sharedFunctionService: SharedFunctionsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

  }

  playVoice(arg, id){
    this._sharedFunctionService.playVoice(arg);
    // console.log(this.categories);
  }

  addImage(){
    this.currentId++;
    this.images.push({id: this.currentId, text: this.text});
  }

}
