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
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [adminGuard],
    },
    {
        path: 'admin/questions',
        component: QuestionsComponent,
        canActivate: [adminGuard],
    },
    {
        path: 'admin/questions/details/:id',
        component: QuestionDetailsComponent,
        canActivate: [adminGuard],
    },
    {
        path: 'admin/quizzes',
        component: QuizzesComponent,
        canActivate: [adminGuard],
    },
    {
        path: 'admin/quizzes/creation/:id',
        component: QuizWizardComponent,
        canActivate: [adminGuard],
    },
    {
        path: 'admin/games',
        component: GamesComponent,
        canActivate: [adminGuard],
    },
    {
        path: 'admin/games/creation/:id',
        component: GameWizardComponent,
        canActivate: [adminGuard],
    },
    {
        path: 'user',
        component: UserComponent,
        canActivate: [userGuard],
    },
    {
        path: 'user/games',
        component: PendingGamesComponent,
        canActivate: [userGuard],
    },
    {
        path: 'user/gamesession/:id',
        component: GameSessionComponent,
        canActivate: [userGuard],
    },
    {
        path: 'user/scores',
        component: ScoresComponent,
        canActivate: [userGuard],
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    },
    {
        path: 'login',
        component: LogInComponent
    },
    {
        path: '',
        component: HomeComponent
    }
];
