import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFillterComponent } from './product-fillter.component';

describe('ProductFillterComponent', () => {
  let component: ProductFillterComponent;
  let fixture: ComponentFixture<ProductFillterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductFillterComponent]
    });
    fixture = TestBed.createComponent(ProductFillterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
