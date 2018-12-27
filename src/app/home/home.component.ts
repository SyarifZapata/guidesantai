import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _dataService: DataService) {
    this._dataService.clientCert().subscribe(
      data =>{
        console.log(data);
      }
    );
  }

  ngOnInit() {
  }

}
