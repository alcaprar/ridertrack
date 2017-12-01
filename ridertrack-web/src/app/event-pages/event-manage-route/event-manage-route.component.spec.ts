import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManageRouteComponent } from './event-manage-route.component';

describe('EventManageRouteComponent', () => {
  let component: EventManageRouteComponent;
  let fixture: ComponentFixture<EventManageRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventManageRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventManageRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
