import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCreateDialogComponent } from './question-create-dialog.component';

describe('QuestionCreateDialogComponent', () => {
  let component: QuestionCreateDialogComponent;
  let fixture: ComponentFixture<QuestionCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionCreateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
