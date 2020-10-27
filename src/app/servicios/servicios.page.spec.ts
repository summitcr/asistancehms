import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosPage } from './servicios.page';

describe('ServiciosPage', () => {
  let component: ServiciosPage;
  let fixture: ComponentFixture<ServiciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
