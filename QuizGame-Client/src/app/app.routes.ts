import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { UserComponent } from './user/user/user.component';
import { LogInComponent } from './authentication/log-in/log-in.component';
import { QuestionDetailsComponent } from './admin/questiondetails/questiondetails.component';
import { QuestionsComponent } from './admin/questions/questions.component';
import { QuizzesComponent } from './admin/quizzes/quizzes/quizzes.component';
import { QuizWizardComponent } from './admin/quizzes/quiz-wizard/quiz-wizard.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
    },
    {
        path: 'admin/questions',
        component: QuestionsComponent,
    },
    {
        path: 'admin/questions/details/:id',
        component: QuestionDetailsComponent,
    },
    {
        path: 'admin/quizzes',
        component: QuizzesComponent,
    },
    {
        path: 'admin/quizzes/creation/:id',
        component: QuizWizardComponent,
    },
    {
        path: 'user',
        component: UserComponent
    },
    {
        path: 'login',
        component: LogInComponent
    },
    
];
