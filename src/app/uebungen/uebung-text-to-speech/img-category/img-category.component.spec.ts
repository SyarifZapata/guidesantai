import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCategoryComponent } from './img-category.component';

describe('ImgCategoryComponent', () => {
  let component: ImgCategoryComponent;
  let fixture: ComponentFixture<ImgCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
