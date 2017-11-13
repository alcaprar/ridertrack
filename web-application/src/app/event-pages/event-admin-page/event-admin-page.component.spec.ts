import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAdminPageComponent } from './event-admin-page.component';

describe('EventAdminPageComponent', () => {
  let component: EventAdminPageComponent;
  let fixture: ComponentFixture<EventAdminPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAdminPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
