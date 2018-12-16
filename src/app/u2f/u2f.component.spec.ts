import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { U2fComponent } from './u2f.component';

describe('U2fComponent', () => {
  let component: U2fComponent;
  let fixture: ComponentFixture<U2fComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ U2fComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(U2fComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
