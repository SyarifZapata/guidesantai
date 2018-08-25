import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../data.service';
import {SharedFunctionsService} from '../shared-functions.service';

@Component({
  selector: 'app-uebung-text-to-speech',
  templateUrl: './uebung-text-to-speech.component.html',
  styleUrls: ['./uebung-text-to-speech.component.scss']
})

export class UebungTextToSpeechComponent implements OnInit {

  values = '';



  constructor(private sharedFunction: SharedFunctionsService, private  _dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  onKey(event: any) { // without type info
    this.values = event.target.value;
    console.log(this.values);
  }

  addUser(){
    this.sharedFunction.setCurrentUser(this.values);

    var user = {
      name: this.values,
      categories: []
    };
    this._dataService.addUser(user).subscribe((res) =>{
      console.log(res);

      this.router.navigate(['/uebungen', this.values],{relativeTo: this.route});
    });

  }

}
