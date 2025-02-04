import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sales',
        //loadComponent: () => import('./Auth/login.component'),
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login.component')
    },
    {
        path: 'whitepage',
        loadComponent: () => import('./pages/white/white.component')
    },
    {
        path: 'sales',
        loadComponent: () => import('./pages/sales/sales.component')
    }
];
 