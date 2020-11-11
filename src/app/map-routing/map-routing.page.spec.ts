import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRoutingPage } from './map-routing.page';

describe('MapRoutingPage', () => {
  let component: MapRoutingPage;
  let fixture: ComponentFixture<MapRoutingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRoutingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRoutingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
