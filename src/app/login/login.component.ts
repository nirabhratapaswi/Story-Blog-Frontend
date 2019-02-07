import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService, private appComponent: AppComponent) {}

  ngOnInit() {}

  username : string;
  password : string;
  warning: string = "";
  message: string = null;

  login() : void {
    this.message = null;
    this.authService.getUserDetails(this.username, this.password).subscribe(data => {
      if (data.success) {
        console.log("Login successful!!");
        this.authService.setLoggedIn(true);
        this.authService.setJwtToken(data.jwt);
        this.authService.setAdminStatus(data.admin);
        this.cookieService.set("jwt-authentication", data.jwt);
        console.log("Sending data to setUserData after login...");
        this.authService.setUserData({
          name: data.name,
          username:data.username,
          id: data.id
        });
        if (data.admin) {
          this.appComponent.routerClick("admin");
        } else {
          this.appComponent.routerClick("stories");
        }
      } else {
        console.log("Login failed");
        this.authService.setLoggedIn(false);
        this.warning = "incorrect username / password";
        if (data.email_not_confirmed) {
          this.warning = "Confirm your email before attempting login.";
        }
      }
      console.log("Data: ", data, ' recieved from the server.');
    });
  }
  
  logoutUser(event) {
    this.message = null;
  	event.preventDefault();
  	this.authService.logout().subscribe(data => {
  		if (data.success) {
  			console.log("Logout successful!!");
  			this.router.navigate([""]);
  			this.authService.setLoggedIn(false);
  		} else {
  			console.log("Logout failed");
  		}
  		console.log("Data: ", data, ' recieved from the server.');
  	});
  }

  validateEmail(mail: string) {
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  changePassword() {
    if (this.username == "" || this.username == null || !this.validateEmail(this.username)) {
      this.warning = "Please enter the associated email id!";
      return;
    }
    this.authService.forgotPassword(this.username).subscribe(data => {
      console.log("Data: ", data);
      if (!data.success) {
        if (data.message == null || data.message == "" || data.message == undefined) {
          data.message = "Something wrong with server, try again later.";
        }
        this.warning = data.message.toString();
        this.message = null;
        return;
      }

      this.warning = null;
      this.message = "Mail with new password sent, login and update password.";
    });
  }

  resendConfirmationMail() {
    if (this.username == "" || this.username == null || !this.validateEmail(this.username)) {
      this.warning = "Please enter the associated email id!";
      return;
    }
    this.authService.resendConfirmationMail(this.username).subscribe(data => {
      console.log("Data: ", data);
      if (!data.success) {
        if (data.message == null || data.message == "" || data.message == undefined) {
          data.message = "Something wrong with server, try again later.";
        }
        this.warning = data.message.toString();
        this.message = null;
        return;
      }

      this.warning = null;
      this.message = "Confirmation mail resent, check your mail and confirm your email before logging in!!";
    });
  }

}
