import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenteComponent } from './assistente.component';

describe('AssistenteComponent', () => {
  let component: AssistenteComponent;
  let fixture: ComponentFixture<AssistenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssistenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
