import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensecategoryComponent } from './expensecategory.component';

describe('ExpensecategoryComponent', () => {
  let component: ExpensecategoryComponent;
  let fixture: ComponentFixture<ExpensecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensecategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpensecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
