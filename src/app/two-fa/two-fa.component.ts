import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../data.service';

@Component({
  selector: 'app-two-fa',
  templateUrl: './two-fa.component.html',
  styleUrls: ['./two-fa.component.scss']
})
export class TwoFAComponent implements OnInit {

  constructor(private _router: Router, private _dataService: DataService) {
    this._dataService.user().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
        this._router.navigate(['/login']);
      });
  }

  ngOnInit() {
  }

}
