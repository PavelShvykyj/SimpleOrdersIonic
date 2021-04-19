import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeinputComponent } from './barcodeinput.component';

describe('BarcodeinputComponent', () => {
  let component: BarcodeinputComponent;
  let fixture: ComponentFixture<BarcodeinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeinputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
