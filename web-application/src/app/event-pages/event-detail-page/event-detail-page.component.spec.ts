import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailPageComponent } from './event-detail-page.component';

describe('EventDetailPageComponent', () => {
  let component: EventDetailPageComponent;
  let fixture: ComponentFixture<EventDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
