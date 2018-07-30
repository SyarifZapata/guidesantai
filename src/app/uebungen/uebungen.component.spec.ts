import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UebungenComponent } from './uebungen.component';

describe('UebungenComponent', () => {
  let component: UebungenComponent;
  let fixture: ComponentFixture<UebungenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UebungenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UebungenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
