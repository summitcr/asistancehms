import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenatalControlPage } from './prenatal-control.page';

describe('PrenatalControlPage', () => {
  let component: PrenatalControlPage;
  let fixture: ComponentFixture<PrenatalControlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrenatalControlPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrenatalControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
