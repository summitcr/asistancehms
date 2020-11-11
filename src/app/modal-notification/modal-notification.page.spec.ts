import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNotificationPage } from './modal-notification.page';

describe('ModalNotificationPage', () => {
  let component: ModalNotificationPage;
  let fixture: ComponentFixture<ModalNotificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNotificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
