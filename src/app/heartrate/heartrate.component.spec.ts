import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartrateComponent } from './heartrate.component';

describe('HeartrateComponent', () => {
  let component: HeartrateComponent;
  let fixture: ComponentFixture<HeartrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeartrateComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
