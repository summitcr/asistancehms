import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEncuestasPage } from './show-encuestas.page';

describe('ShowEncuestasPage', () => {
  let component: ShowEncuestasPage;
  let fixture: ComponentFixture<ShowEncuestasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowEncuestasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEncuestasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
