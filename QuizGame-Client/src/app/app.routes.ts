import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { UserComponent } from './user/user/user.component';

export const routes: Routes = [
    {path: 'admin',
    component: AdminComponent
    },
    {path: 'user',
    component: UserComponent
    },
];
