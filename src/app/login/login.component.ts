import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService, private router: Router, private cookieService: CookieService) {}

  username : string;
  password : string;
  warning: string = "";

  login() : void {
    this.Auth.getUserDetails(this.username, this.password).subscribe(data => {
      if (data.success) {
        console.log("Login successful!!");
        this.Auth.setLoggedIn(true);
        this.Auth.setJwtToken(data.jwt);
        this.Auth.setAdminStatus(data.admin);
        this.cookieService.set("jwt-authentication", data.jwt);
        console.log("Sending data to setUserData after login...");
        this.Auth.setUserData({
          name: data.name,
          username:data.username,
          id: data.id
        });
        if (data.admin) {
          this.router.navigate(["admin"]);
        } else {
          this.router.navigate(["stories"]);
        }
      } else {
        console.log("Login failed");
        this.Auth.setLoggedIn(false);
        this.warning = "incorrect username / password";
      }
      console.log("Data: ", data, ' recieved from the server.');
    });
  }

  ngOnInit() {

  }
  
  logoutUser(event) {
  	event.preventDefault();
  	this.Auth.logout().subscribe(data => {
  		if (data.success) {
  			console.log("Logout successful!!");
  			this.router.navigate([""]);
  			this.Auth.setLoggedIn(false);
  		} else {
  			console.log("Logout failed");
  		}
  		console.log("Data: ", data, ' recieved from the server.');
  	});
  }

}
