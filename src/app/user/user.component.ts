import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  username: string;

  constructor(private _dataService: DataService, private _router: Router) {
    this._dataService.user().subscribe(
      data => {
        // @ts-ignore
        // @ts-ignore. Value of twoFALoggedIn muss be 'true' or 'false' not just true or false
        if(data.twoFALoggedIn === 'true' || data.twoFAEnabled === false){
          this._dataService.setClientInfo(data);
          this._dataService.setLogginStatus(true);
          // @ts-ignore
          this.username = data.username;
          // data has picture property
          // @ts-ignore
          if (data.picture) {
            // @ts-ignore
            this._dataService.setProfilPicture(data.picture);
          }
        }else{
          this._router.navigate(['/twofa']);
        }
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
