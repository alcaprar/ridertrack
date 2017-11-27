import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizedEventsComponent } from './organized-events.component';

describe('OrganizedEventsComponent', () => {
  let component: OrganizedEventsComponent;
  let fixture: ComponentFixture<OrganizedEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizedEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
