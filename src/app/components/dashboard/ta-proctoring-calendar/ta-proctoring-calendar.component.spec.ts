import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaProctoringCalendarComponent } from './ta-proctoring-calendar.component';

describe('TaProctoringCalendarComponent', () => {
  let component: TaProctoringCalendarComponent;
  let fixture: ComponentFixture<TaProctoringCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaProctoringCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaProctoringCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
