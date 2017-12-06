import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProgressComponent } from './event-progress.component';

describe('EventProgressComponent', () => {
  let component: EventProgressComponent;
  let fixture: ComponentFixture<EventProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
