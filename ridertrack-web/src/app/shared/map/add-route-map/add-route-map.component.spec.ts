import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRouteMapComponent } from './add-route-map.component';

describe('AddRouteMapComponent', () => {
  let component: AddRouteMapComponent;
  let fixture: ComponentFixture<AddRouteMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRouteMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRouteMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
