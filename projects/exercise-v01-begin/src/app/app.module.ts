import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule, ScreenTrackingService } from '@angular/fire/analytics';
import { environment } from '../environments/environment';
import { SignUpComponent } from './pages/signup/sign-up.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireFunctionsModule, FUNCTIONS_ORIGIN } from '@angular/fire/functions';
import { UserService } from './services/user.service';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ChannelService } from './services/channel.service';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    // Firebase https://github.com/angular/angularfire/blob/master/docs/install-and-setup.md
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFirestoreModule
  ],
  providers: [
    ScreenTrackingService,
    UserService,
    ChannelService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
