import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit, AfterViewInit {

  //todo put this at the right place so it runs after page is rendered (jQuery.ready())
  //$('.tabs').tabs();

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}
}
