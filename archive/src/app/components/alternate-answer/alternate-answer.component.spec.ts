import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateAnswerComponent } from './alternate-answer.component';

describe('AlternateAnswerComponent', () => {
  let component: AlternateAnswerComponent;
  let fixture: ComponentFixture<AlternateAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternateAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternateAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
