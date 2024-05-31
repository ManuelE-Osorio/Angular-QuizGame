import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { UserComponent } from './user/user/user.component';
import { LogInComponent } from './authentication/log-in/log-in.component';
import { QuestionDetailsComponent } from './admin/questiondetails/questiondetails.component';
import { QuestionsComponent } from './admin/questions/questions.component';
import { QuizzesComponent } from './admin/quizzes/quizzes/quizzes.component';
import { QuizWizardComponent } from './admin/quizzes/quiz-wizard/quiz-wizard.component';
import { GamesComponent } from './admin/games/games/games.component';
import { GameWizardComponent } from './admin/games/game-wizard/game-wizard.component';
import { PendingGamesComponent } from './user/pending-games/pending-games.component';
import { GameSessionComponent } from './user/game-session/game-session.component';
import { ScoresComponent } from './user/scores/scores.component';

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
        path: 'admin/games',
        component: GamesComponent,
    },
    {
        path: 'admin/games/creation/:id',
        component: GameWizardComponent,
    },
    {
        path: 'user',
        component: UserComponent
    },
    {
        path: 'user/games',
        component: PendingGamesComponent
    },
    {
        path: 'user/gamesession/:id',
        component: GameSessionComponent
    },
    {
        path: 'user/scores',
        component: ScoresComponent
    },
    {
        path: 'login',
        component: LogInComponent
    },
    
];
