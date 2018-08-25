import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WillRentPage } from './will-rent.page';

describe('WillRentPage', () => {
  let component: WillRentPage;
  let fixture: ComponentFixture<WillRentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WillRentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WillRentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
