import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingGamesComponent } from './pending-games.component';

describe('PendingGamesComponent', () => {
  let component: PendingGamesComponent;
  let fixture: ComponentFixture<PendingGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingGamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
