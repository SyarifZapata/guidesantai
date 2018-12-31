import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import * as M from 'materialize-css';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  // We use this value to show logout and memberpage button on the navbar
  loggedIn: boolean;
  profilPicture: string;
  userName: string;

  constructor(private _dataService: DataService, private _router: Router) { }

  ngOnInit() {
    // The value of logged in always get updated whenever it is changed by other component.
    this._dataService.loggedInStatus.subscribe(value => this.loggedIn = value);
    this._dataService.profilPicture.subscribe(value => this.profilPicture = value);
  }

  ngAfterViewInit(){
    document.addEventListener('DOMContentLoaded', function() {
      const elems = document.querySelectorAll('.dropdown-trigger');
      const instances = M.Dropdown.init(elems, {
        widthConstraint: true
      });
    });

    document.addEventListener('DOMContentLoaded', function() {
      const elems = document.querySelectorAll('.dropdown-trigger1');
      const instances = M.Dropdown.init(elems, {
        coverTrigger: false,
      });
    });
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

