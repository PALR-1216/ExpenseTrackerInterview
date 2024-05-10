import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Login/login/login.component';
import { LandingComponent } from './Components/Landing/landing/landing.component';
import { SignupComponent } from './Components/SignUp/signup/signup.component';
import { AboutusComponent } from './Components/AboutUs/aboutus/aboutus.component';
import { HomeComponent } from './Components/Home/home/home.component';
import { AuthGuard } from './AuthGuard/auth.guard';
import { ExpensecategoryComponent } from './Components/ExpenseCategorys/expensecategory/expensecategory.component';

export const routes: Routes = [
    {path:'landing', component:LandingComponent},
    {path: 'aboutUs', component:AboutusComponent},
    {path:'login', component:LoginComponent},
    {path:'signup', component:SignupComponent},
    {path:'home', component:HomeComponent, canActivate: [AuthGuard]},
    {path:'expenseCategory', component:ExpensecategoryComponent, canActivate:[AuthGuard]},
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
];
