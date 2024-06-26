import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Login/login/login.component';
import { LandingComponent } from './Components/Landing/landing/landing.component';
import { SignupComponent } from './Components/SignUp/signup/signup.component';
import { AboutusComponent } from './Components/AboutUs/aboutus/aboutus.component';
import { HomeComponent } from './Components/Home/home/home.component';
import { AuthGuard } from './AuthGuard/auth.guard';
import { ExpensecategoryComponent } from './Components/ExpenseCategorys/expensecategory/expensecategory.component';
import { ProfileComponent } from './Components/Profile/profile/profile.component';
import { EditprofileComponent } from './Components/Profile/EditProfile/editprofile/editprofile.component';
import { ExpensesComponent } from './Components/Expenses/expenses/expenses.component';
import { AddexpenseComponent } from './Components/Expenses/AddExpense/addexpense/addexpense.component';
import { EditexpenseComponent } from './Components/Expenses/EditExpense/editexpense/editexpense.component';
import { ViewexpenseComponent } from './Components/Expenses/ViewExpense/viewexpense/viewexpense.component';
import { ForgotpasswordComponent } from './Components/ForgotPassword/forgotpassword/forgotpassword.component';
import { SettingsComponent } from './Components/Settings/settings/settings.component';
import { RecoveraccountComponent } from './Components/RecoverAccount/recoveraccount/recoveraccount.component';
import { ResetpasswordComponent } from './Components/ResetPassword/resetpassword/resetpassword.component';

export const routes: Routes = [
    {path:'landing', component:LandingComponent},
    {path: 'aboutUs', component:AboutusComponent},
    {path:"RecoverAccount", component:RecoveraccountComponent},
    {path:'ResetPassword/:userID', component:ResetpasswordComponent},
    {path:'login', component:LoginComponent},
    {path:'forgotPassword', component:ForgotpasswordComponent},
    {path:'signup', component:SignupComponent},
    {path:'home', component:HomeComponent, canActivate: [AuthGuard]},
    {path:'profile', component:ProfileComponent,  canActivate:[AuthGuard]},
    {path:'editProfile', component:EditprofileComponent, canActivate:[AuthGuard]},
    {path:'expenseCategory', component:ExpensecategoryComponent, canActivate:[AuthGuard]},
    {path:'expenses', component:ExpensesComponent, canActivate:[AuthGuard]},
    {path:'addExpense', component:AddexpenseComponent, canActivate:[AuthGuard]},
    {path:'editExpense/:expenseID', component: EditexpenseComponent, canActivate:[AuthGuard]},
    {path:'viewExpense/:expenseID', component:ViewexpenseComponent, canActivate:[AuthGuard]},
    {path:'settings', component:SettingsComponent, canActivate:[AuthGuard]},
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
    { path: '**', redirectTo: '/landing' }
  
];
