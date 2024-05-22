import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDetailsComponent } from './questiondetails.component';

describe('QuestiondetailsComponent', () => {
  let component: QuestionDetailsComponent;
  let fixture: ComponentFixture<QuestionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
