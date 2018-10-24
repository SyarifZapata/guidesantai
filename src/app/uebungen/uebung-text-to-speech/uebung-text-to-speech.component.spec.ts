import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UebungTextToSpeechComponent } from './uebung-text-to-speech.component';

describe('UebungTextToSpeechComponent', () => {
  let component: UebungTextToSpeechComponent;
  let fixture: ComponentFixture<UebungTextToSpeechComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UebungTextToSpeechComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UebungTextToSpeechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
