import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { QuizForm } from '../../../models/quiz';

@Component({
  selector: 'app-quiz-wizard',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: './quiz-wizard.component.html',
  styleUrl: './quiz-wizard.component.css'
})
export class QuizWizardComponent {

  quizForm : FormGroup<QuizForm>;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  stepperOrientation: Observable<StepperOrientation>;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
  )
  {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    this.quizForm = this.createEmptyForm();
  }

  createEmptyForm() : FormGroup<QuizForm> {
    return new FormGroup<QuizForm>({
      id: new FormControl<number | null> (0),
      name: new FormControl<string | null> (''),
      description: new FormControl<string | null> (''),
    })
  }

}
