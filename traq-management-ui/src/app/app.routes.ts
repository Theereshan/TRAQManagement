import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';

import { PersonsComponent } from './components/persons/persons.component';
import { PersonDetailsComponent } from './components/person-details/person-details.component';

import { AccountsComponent } from './components/accounts/accounts.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  { path: 'persons', component: PersonsComponent, canActivate: [authGuard] },
  { path: 'persons/:id', component: PersonDetailsComponent, canActivate: [authGuard] },

  { path: 'accounts', component: AccountsComponent, canActivate: [authGuard] },
  { path: 'accounts/:id', component: AccountDetailsComponent, canActivate: [authGuard] },


  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  { path: '**', redirectTo: '' }
];
