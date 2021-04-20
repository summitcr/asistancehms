import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTicketPage } from './staff-ticket.page';

describe('StaffTicketPage', () => {
  let component: StaffTicketPage;
  let fixture: ComponentFixture<StaffTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffTicketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
