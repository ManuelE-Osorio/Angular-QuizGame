import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { UserComponent } from './user/user/user.component';
import { LogInComponent } from './authentication/log-in/log-in.component';
import { QuestionDetailsComponent } from './admin/questiondetails/questiondetails.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: 'question',
                component: QuestionDetailsComponent
            }
        ]
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
