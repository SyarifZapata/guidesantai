import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import * as M from 'materialize-css';
import {BehaviorSubject, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DataService} from '../data.service';
import {Router} from '@angular/router';

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
  chatFriends = [];

  constructor(private _dataService: DataService, private _router: Router) {}

  ngOnInit() {
    this._dataService.needToApprove().subscribe(
      data => {
        // @ts-ignore
        this.unApprovedRequest = data.data;
      }
    );

    this.getFriends();
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

  getFriends(){
    this.chatFriends = [];
    this._dataService.getFriends().subscribe(
      data => {
        // @ts-ignore
        this.chatFriends = data.data;
      }
    );
  }

  inviteFriend(value: any){
    // Todo send Invitation
    let to_id;
    if(value.user_id){
      to_id = value.user_id;
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

  rejectRequest(id){
    return this._dataService.rejectRequest({id: id}).subscribe(
      data => {
        this.removeByAttr(this.unApprovedRequest, 'user_id', id);
        // this.removeByAttr(this.unApprovedRequest, 'user_id', id);
      }
    );
  }

  removeByAttr(arr, attr, value){
    let i = arr.length;
    while(i--){
      if( arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value ) ){
        arr.splice(i,1);
      }
    }
    return arr;
  }

  acceptRequest(id){
    return this._dataService.acceptRequest({id: id}).subscribe(
      data => {
        console.log(data);
        // @ts-ignore
        this.getFriends();
        this.rejectRequest(id);
      }
    );
  }

  enterChatRoom(id){
    this._dataService.getRoom({id: id}).subscribe(
      data => {
        // @ts-ignore
        const room_id = data.room_id.room_id;
        // @ts-ignore
        const their_id = data.user;
        // @ts-ignore
        this._router.navigate(['/chat', room_id, id]);
      }
    );

  }
}
