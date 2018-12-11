import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import * as M from 'materialize-css';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DataService} from '../data.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {
  peopleSearchChanged = new Subject<string>();
  people = [];

  constructor(private _dataService: DataService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    var elems = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(elems, {});

    this.peopleSearchChanged
      .pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
      if(value !== ''){
        this._dataService.findUser({username: value}).subscribe(
          data => {
            console.log(data);
            // @ts-ignore
            this.people = this.people.concat(data.data);
          }
        );
      }
    });
  }

  onSearchPeople(value:string){
    this.peopleSearchChanged.next(value);
  }
}
