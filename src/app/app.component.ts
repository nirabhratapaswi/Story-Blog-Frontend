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
  selected_tab: String = "";
  selectedTabMap: any = {
    "": "Home",
    "stories": "Stories",
    "login": "Login",
    "upload": "Upload",
    "register": "Register",
    "admin": "Admin",
  };
  name: string = "";
  subscription: Subscription;
  detect_mobile: boolean = false;

  onResize(event) {
    if (window.innerWidth <= 600) {
      this.detect_mobile = true;
    } else {
      this.detect_mobile = false;
    }
   }

  constructor(private authService: AuthService, private router: Router) {
    this.subscription = this.authService.getMessage().subscribe(message => {
      console.log("Message recieved by appComponent: ", message);
      if ((message.data != undefined || message.data != null) && (message.data.name != undefined || message.data.name != null)) {
        this.name = message.data.name;
      }
    });

    this.onResize(null);
  }

  routerClick(page) {
  	console.log("Page: ", page);
    this.selected_tab = this.selectedTabMap[page];
  	this.router.navigateByUrl('/'.concat(page));
  }

  isAdmin() {
  	return this.authService.getAdminStatus();
  }

  isLoggedIn() {
  	return this.authService.isLoggedIn;
  }

  setSelectedTab(selected_tab: string) {
    this.selected_tab = selected_tab;
  }

  setName(name: string) {
    this.name = name;
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
