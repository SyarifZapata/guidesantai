import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import * as M from 'materialize-css';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    var elems = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(elems, {});
  }

    //filter list by friends names
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
}
