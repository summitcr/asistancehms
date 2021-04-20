import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPage } from './staff.page';

describe('StaffPage', () => {
  let component: StaffPage;
  let fixture: ComponentFixture<StaffPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
