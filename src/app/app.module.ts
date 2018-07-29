import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello/hello.component';
import { RecordsService } from './records.service';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatDialogModule, MatMenuModule, MatProgressSpinnerModule, MatCheckboxModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule } from '@angular/material';
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

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    HomeComponent,
    MyNavComponent,
    StoriesComponent,
    LoginComponent,
    AdminComponent,
    UploadComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'hello',
        component: HelloComponent
      },
      {
        path: 'stories',
        component: StoriesComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'upload',
        component: UploadComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }
    ]),
    BrowserAnimationsModule,
    LayoutModule,
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
    Ng2SmartTableModule
    // AppRoutingModule
  ],
  providers: [RecordsService, AuthGuard, StoriesServiceService],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }
