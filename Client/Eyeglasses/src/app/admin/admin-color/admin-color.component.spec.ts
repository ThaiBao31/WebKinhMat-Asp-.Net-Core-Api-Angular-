import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminColorComponent } from './admin-color.component';

describe('AdminColorComponent', () => {
  let component: AdminColorComponent;
  let fixture: ComponentFixture<AdminColorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminColorComponent]
    });
    fixture = TestBed.createComponent(AdminColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
