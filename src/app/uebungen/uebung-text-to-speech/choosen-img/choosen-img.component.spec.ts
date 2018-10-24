import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosenImgComponent } from './choosen-img.component';

describe('ChoosenImgComponent', () => {
  let component: ChoosenImgComponent;
  let fixture: ComponentFixture<ChoosenImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosenImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosenImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
