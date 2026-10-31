import { Routes } from '@angular/router';
import {ServicesList} from "./pages/services-list/services-list";
import {Booking} from "./pages/booking/booking";
import {Admin} from './pages/admin/admin';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {path: '',redirectTo: 'services',pathMatch: 'full'},
    {path: 'services',component:ServicesList},
    {path: 'booking/:idService',component: Booking},
    {path: 'admin', component: Admin},
    {path: 'register',component:Register}


];
