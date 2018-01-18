import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEventBoxComponent } from './home-event-box.component';

describe('HomeEventBoxComponent', () => {
  let component: HomeEventBoxComponent;
  let fixture: ComponentFixture<HomeEventBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeEventBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEventBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
