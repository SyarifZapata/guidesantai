import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private _dataService: DataService, private _router: Router) {
    this._dataService.user().subscribe(
      data => {
        this._dataService.setLogginStatus(true);
        console.log(data);
        },
      error => {
        console.log('error nya disinii loh');
        console.log(error);
        this._router.navigate(['/login']);
      }
    )
  }

  ngOnInit() {
  }

}
