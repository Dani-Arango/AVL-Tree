import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AVLtreeComponent } from './avltree.component';

describe('AVLtreeComponent', () => {
  let component: AVLtreeComponent;
  let fixture: ComponentFixture<AVLtreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AVLtreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AVLtreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
