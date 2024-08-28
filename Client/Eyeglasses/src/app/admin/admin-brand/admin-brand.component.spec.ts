import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBrandComponent } from './admin-brand.component';

describe('AdminBrandComponent', () => {
  let component: AdminBrandComponent;
  let fixture: ComponentFixture<AdminBrandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBrandComponent]
    });
    fixture = TestBed.createComponent(AdminBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
