import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {SharedFunctionsService} from '../../../shared-functions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../../data.service';

@Component({
  selector: 'app-img-category',
  templateUrl: './img-category.component.html',
  styleUrls: ['./img-category.component.scss']
})
export class ImgCategoryComponent implements OnInit {

  currentId = 0;
  categories: Array<any>;


  text = 'Kategorie';

  constructor(private _dataService: DataService, private _sharedFunctionService: SharedFunctionsService, private route: ActivatedRoute, private router: Router) {
    this._dataService.getCategories(this._sharedFunctionService.getCurrentUser()).subscribe((res) =>{
      this.categories = res;
      console.log(this.categories);
    });
  }

  ngOnInit() {
  }

  playVoice(arg, id){
    this._sharedFunctionService.playVoice(arg);
    this.router.navigate(['/uebungen/category', id],{relativeTo: this.route});

  }

  addCategory(){
    this.currentId++;
    const newCategory = {
      id: this.currentId,
      text: this.text
    };
    this.categories.push(newCategory);
  }

}
