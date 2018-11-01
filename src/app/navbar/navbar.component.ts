import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // We use this value to show logout and memberpage button on the navbar
  loggedIn: boolean;

  constructor(private _dataService: DataService, private _router: Router) { }

  ngOnInit() {
    // The value of logged in always get updated whenever it is changed by other component.
    this._dataService.cast.subscribe(value => this.loggedIn = value);
  }

  logout(){
    this._dataService.logout().subscribe(
      data => {
        console.log(data);
        this.loggedIn = false;
        this._router.navigate(['/login']);
      },

      error => {
        console.log(error);
        console.log('mama mia');
      }
    )
  }

}
