import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapoRepartoComponent } from './capo-reparto.component';

describe('CapoRepartoComponent', () => {
  let component: CapoRepartoComponent;
  let fixture: ComponentFixture<CapoRepartoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CapoRepartoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapoRepartoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
