import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { UserComponent } from './user/user/user.component';
import { LogInComponent } from './authentication/log-in/log-in.component';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'user',
        component: UserComponent
    },
    {
        path: 'login',
        component: LogInComponent
    }
];
