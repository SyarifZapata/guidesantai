import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-uebung-text-to-speech',
  templateUrl: './uebung-text-to-speech.component.html',
  styleUrls: ['./uebung-text-to-speech.component.scss']
})

export class UebungTextToSpeechComponent implements OnInit {

  values = '';



  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  onKey(event: any) { // without type info
    this.values = event.target.value;
    console.log(this.values);
  }

  addUser(){
    this.router.navigate(['/uebungen', this.values],{relativeTo: this.route});
  }

}
