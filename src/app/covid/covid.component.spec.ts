import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidComponent } from './covid.component';

describe('CovidComponent', () => {
  let component: CovidComponent;
  let fixture: ComponentFixture<CovidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
