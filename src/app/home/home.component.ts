import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterContentInit {
  @ViewChild('ref') sliderValue: ElementRef;
  value = 0;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.value = this.sliderValue.nativeElement.value;
  }

  onSliderChange(value: number) {
    this.value = value;
  }

}
