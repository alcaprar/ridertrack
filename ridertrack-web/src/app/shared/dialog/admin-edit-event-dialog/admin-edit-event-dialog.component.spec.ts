import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditEventDialogComponent } from './admin-edit-event-dialog.component';

describe('AdminEditEventDialogComponent', () => {
  let component: AdminEditEventDialogComponent;
  let fixture: ComponentFixture<AdminEditEventDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditEventDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
