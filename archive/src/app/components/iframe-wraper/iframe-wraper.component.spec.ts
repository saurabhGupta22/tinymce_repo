import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeWraperComponent } from './iframe-wraper.component';

describe('IframeWraperComponent', () => {
  let component: IframeWraperComponent;
  let fixture: ComponentFixture<IframeWraperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IframeWraperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeWraperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
