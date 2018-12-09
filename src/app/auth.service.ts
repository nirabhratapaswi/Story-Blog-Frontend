import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

interface myData {
  success: boolean,
  msg: String,
  data: String,
  admin: Boolean,
  jwt: string,
  name: String,
  username: String,
  id: String
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = false;
  private jwtToken: string = "lol-auth";
  private isAdmin: Boolean = false;
  serverUrl = environment.baseUrl.concat(":", environment.port.toString());
  private userData: any = {
    name: "",
    username: "",
    id: ""
  };
  private subject = new Subject<any>();
  subscription: Subscription;

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    if (this.cookieService.check("jwt-authentication")) {
      this.confirmUser(this.cookieService.get("jwt-authentication"), (data: myData) => {
        if (!data || !data.success) {
        } else if (data.success) {
          this.jwtToken = this.cookieService.get("jwt-authentication");
          this.isAdmin = data.admin;
          this.loggedInStatus = true;
          this.sendMessage("User is logged in.", data);
          this.router.navigate(["stories"]);
        }
      });
    }
    this.subscription = this.getMessage().subscribe(message => {
      console.log("Message recieved by authService: ", message);
    });
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }

  sendMessage(message: String, data: any) {
      this.subject.next({ text: message, data: data });
  }
 
  clearMessage() {
      this.subject.next();
  }

  confirmUser(jwtToken: string, callback) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type':  'application/json',
        'Authorization': jwtToken
      })
    };
    let response = this.http.get<myData>(this.serverUrl.concat("/is_logged_in"), httpOptions);
    response.subscribe(data => {
      console.log("Returned data: ", data);
      callback(data);
    });
  }

  setLoggedIn(loggedInStatus: boolean) {
    this.loggedInStatus = loggedInStatus;
  }

  get isLoggedIn() {
    return this.loggedInStatus;
  }

  setAdminStatus(status: Boolean) {
    this.isAdmin = status;
  }

  getAdminStatus() {
    return this.isAdmin;
  }

  setUserData(data) {
    this.userData.name = data.name;
    this.userData.username = data.username;
    this.userData.id = data.id;
    console.log("Setting user data from: ", data, ", to: ", this.userData);
  }

  getUserData() {
    return this.userData;
  }

  setJwtToken(jwtToken: string) {
    this.jwtToken = jwtToken;
  }

  getUserDetails(username: String, password: String) {
  	console.log("Username: ", username, "\nPassword: ", password);
  	return this.http.post<myData>(this.serverUrl.concat("/login"), {
  		username: username,
  		password: password
  	});
  	// post to API Server
  }

  getJwtToken() {
    return this.jwtToken;
  }

  getSecureRoute() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type':  'application/json',
        'Authorization': this.jwtToken
      })
    };
    return this.http.get<myData>(this.serverUrl.concat("/login/secured"), httpOptions);
  }

  logout() {
    this.loggedInStatus = false;
    this.isAdmin = false;
    this.jwtToken = null;
    this.cookieService.delete("jwt-authentication");
    return this.http.post<myData>(this.serverUrl.concat("/login/logout"), {});
  }

}
