import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import * as M from 'materialize-css';
import {BehaviorSubject, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DataService} from '../data.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {
  peopleSearchChanged = new BehaviorSubject<string>('');
  people = [];
  pendingRequest = [];
  unApprovedRequest = [];

  constructor(private _dataService: DataService) {}

  ngOnInit() {
    this._dataService.needToApprove().subscribe(
      data => {
        // @ts-ignore
        this.unApprovedRequest = data.data;
      }
    );
  }

  ngAfterViewInit() {
    var elems = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(elems, {});

    this.peopleSearchChanged
      .pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
      if(value !== '') {
        this.people = [];
        const username = this._dataService.currentUser.username;
        console.log(username);
        if (username !== value){
          this._dataService.findUser({username: value}).subscribe(
            data => {
              // @ts-ignore
              this.people = this.people.concat(data.data);
              // @ts-ignore
              this.pendingRequest = this.pendingRequest.concat(data.pending);
              this.pendingRequest = this.pendingRequest.map(a => a.to_id);
              // console.log(this.pendingRequest);
              console.log(this.people);
            }
          );
        }
      }
    });
  }

  onSearchPeople(value: string){
    this.peopleSearchChanged.next(value);
  }

  inviteFriend(value: any){
    // Todo send Invitation
    let to_id;
    if(value.facebook_id){
      to_id = value.facebook_id;
    }else{
      to_id = value.user_id;
    }
    this._dataService.inviteUser({to_id: to_id}).subscribe(
      data => {
        console.log(data);
        this.pendingRequest.push(to_id);
        this.onSearchPeople(this.peopleSearchChanged.getValue());
      }
    );
  }

    // filter list by friends names
    onKeyUp(event) {
        var searchQuery = $(".active .search-friends").val();
        $(".active ul li:not(:first)").each(function(){
            if($(this).find(".middle h5").text().toLowerCase().includes(searchQuery.toLowerCase())){
                $(this).removeClass("hide");
            }else{
                $(this).addClass("hide");
            }
        });
    }

    checkPending(id){
      return this.pendingRequest.includes(id);
    }

    cancelRequest(id){
      return this._dataService.cancelRequest({id: id}).subscribe(
        data => {
          const i = this.pendingRequest.indexOf(id);
          if(i !== -1){
            delete this.pendingRequest[i];
          }
          this.onSearchPeople(this.peopleSearchChanged.getValue());
        }
      )
    }
}
