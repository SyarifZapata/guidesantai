import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {DataService} from './data.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserComponent } from './user/user.component';
import {HttpClientModule} from '@angular/common/http';
import {SettingsComponent} from './settings/settings.component';
import { TwoFAComponent } from './two-fa/two-fa.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { ChatComponent } from './chat/chat.component';
import { U2fComponent } from './u2f/u2f.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetComponent } from './reset/reset.component';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'home/:message_id/:arg', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'user', component: UserComponent,
    children: [
      {path: '', component: FriendListComponent}
    ]},
  {path: 'reset/:token', component: ResetComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'chat/:room_id/:to_id', component: ChatComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login/:message_id', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'twofa', component: TwoFAComponent},
  {path: 'u2f', component: U2fComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutComponent,
    HomeComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    SettingsComponent,
    TwoFAComponent,
    FriendListComponent,
    ChatComponent,
    U2fComponent,
    ForgotPasswordComponent,
    ResetComponent
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
