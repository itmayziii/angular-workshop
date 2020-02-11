import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import { SignUpComponent } from './pages/signup/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [IsAuthenticatedGuard],
    children: [
      // Authenticated Routes
      {path: 'home', component: HomeComponent}
    ],
  },
  // Unauthenticated Routes
  {path: 'signup', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [IsAuthenticatedGuard]

})
export class AppRoutingModule {
}
