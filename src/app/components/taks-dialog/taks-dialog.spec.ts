import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaksDialog } from './taks-dialog';

describe('TaksDialog', () => {
  let component: TaksDialog;
  let fixture: ComponentFixture<TaksDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaksDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TaksDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
