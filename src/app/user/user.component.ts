import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {Message} from '../utility/message';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
    // todo make Msg class


    msgs = [
        new Message(1,'me', 'This is a message'),
        new Message(2,'she', 'An Example of class Message'),
        {id: 3, from: 'me', content: 'Lorem ipsum dolor sit amet'},
        {id: 4, from: 'she', content: 'Lorem ipsum dolor sit amet'},
        {id: 5, from: 'me', content: 'Lorem ipsum dolor sit amet. Very long text. Very long text. Very long text. Very long text.'},
        {id: 6, from: 'me', content: 'Lorem ipsum dolor sit amet'},
        {id: 7, from: 'she', content: 'Lorem ipsum dolor sit amet'},
        {id: 8, from: 'she', content: 'Lorem ipsum dolor sit amet'},
        {id: 9, from: 'me', content: 'Lorem ipsum dolor sit amet'},
        {id: 10, from: 'me', content: 'Lorem ipsum dolor sit amet'},
        {id: 11, from: 'she', content: 'Lorem ipsum dolor sit amet'},
        {id: 12, from: 'she', content: 'Lorem ipsum dolor sit amet'},
    ];

  constructor(private _dataService: DataService, private _router: Router) {
    this._dataService.user().subscribe(
      data => {
        this._dataService.setLogginStatus(true);
        // data has picture property
        // @ts-ignore
        if(data.picture){
          // @ts-ignore
          this._dataService.setProfilPicture(data.picture);
        }
        console.log(data);
      },
      error => {
        console.log(error);
        this._router.navigate(['/login']);
      }
    );
  }

  ngOnInit() {
  }

}
