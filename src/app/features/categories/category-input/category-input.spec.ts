import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryInput } from './category-input';

describe('CategoryInput', () => {
  let component: CategoryInput;
  let fixture: ComponentFixture<CategoryInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
