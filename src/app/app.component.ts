import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// @classDecorator
export class AppComponent {
  title = 'app';
  inputVal = 'hello';
  selectedTab: String = "";
  selectedTabMap: any = {
    "": "Home",
    "stories": "Stories",
    "login": "Login",
    "upload": "Upload",
    "register": "Register",
  };
  name: string = "";
  subscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.subscription = this.authService.getMessage().subscribe(message => {
      console.log("Message recieved by appComponent: ", message);
      if (message.data && message.data.name) {
        this.name = message.data.name;
      }
      /*this.message = message;
      this.stories = this.storiesService.getStoriesVariableChunk();  // this.storiesService.getStoriesVariable();
      this.mostLikedStories = this.storiesService.getMostLikedStoriesVariableChunk();  // this.storiesService.getMostLikedStoriesVariable();
      if (this.selectedFilter == "Single Story") {
        this.goToStory(this.story_id);
      }*/
    });
  }

  routerClick(page) {
  	console.log("Page: ", page);
    this.selectedTab = this.selectedTabMap[page];
  	this.router.navigateByUrl('/'.concat(page));
  }

  isAdmin() {
  	return this.authService.getAdminStatus();
  }

  isLoggedIn() {
  	return this.authService.isLoggedIn;
  }

  logoutUser() {
  	this.authService.logout().subscribe(data => {
  		if (data.success) {
  			console.log("Logout successful!!");
  			this.authService.setLoggedIn(false);
  		} else {
  			console.log("Logout failed");
  		}
      this.router.navigate([""]);
  		console.log("Data: ", data, ' recieved from the server.');
  	});
  }
}
