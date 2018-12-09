import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoriesComponent }   from './stories/stories.component';
import { RegisterComponent }      from './register/register.component';
import { LoginComponent }  from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
	{ 
  		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},
	{ 
  		path: 'stories',
		component: StoriesComponent
	},
	{ 
  		path: 'story/:id',
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
  		path: 'profile',
		component: ProfileComponent
	},
	{ 
  		path: 'home',
		component: HomeComponent
	},
	{ 
  		path: 'upload',
		component: UploadComponent,
        canActivate: [AuthGuard]
	},
	{ 
  		path: 'register',
		component: RegisterComponent
	},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}