import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeePeoplePage } from './see-people.page';

describe('SeePeoplePage', () => {
  let component: SeePeoplePage;
  let fixture: ComponentFixture<SeePeoplePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeePeoplePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeePeoplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
