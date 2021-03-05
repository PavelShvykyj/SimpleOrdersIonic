import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppstateComponent } from './appstate.component';

describe('AppstateComponent', () => {
  let component: AppstateComponent;
  let fixture: ComponentFixture<AppstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppstateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
