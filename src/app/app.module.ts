import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RecordsService } from './records.service';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatGridListModule, MatRadioModule, MatDialogModule, MatMenuModule, MatProgressSpinnerModule, MatCheckboxModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule } from '@angular/material';
import { StoriesComponent } from './stories/stories.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from "./auth.guard";
import { UploadComponent } from './upload/upload.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ProfileComponent } from './profile/profile.component';
// import { AppRoutingModule } from './/app-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { StoriesServiceService } from './stories-service.service';
import { RegisterComponent } from './register/register.component';
import { RegisterService } from './register.service';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StoriesComponent,
    LoginComponent,
    AdminComponent,
    UploadComponent,
    ProfileComponent,
    RegisterComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatGridListModule,
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    AngularSvgIconModule,
    Ng2SmartTableModule,
    AppRoutingModule
  ],
  providers: [CookieService, RecordsService, AuthGuard, StoriesServiceService, RegisterService],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }
