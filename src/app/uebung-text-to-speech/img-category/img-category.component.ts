import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {SharedFunctionsService} from '../../shared-functions.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-img-category',
  templateUrl: './img-category.component.html',
  styleUrls: ['./img-category.component.scss']
})
export class ImgCategoryComponent implements OnInit {
  @ViewChild('container',{read: ViewContainerRef}) container;
  currentId = 1;
  categories = [
    {id: 0, text: 'Hallo'},
    {id: 1, text: 'Essen'}
  ];

  model = 'Essen';
  text = this.model;

  constructor(private _sharedFunctionService: SharedFunctionsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

  }

  playVoice(arg){
    this._sharedFunctionService.playVoice(arg);
    this.router.navigate(['/'],{relativeTo: this.route});
    // console.log(this.categories);
  }

  addCategory(){
    this.currentId++;
    this.categories.push({id: this.currentId, text: this.text});
  }

}
