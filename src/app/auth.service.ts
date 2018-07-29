import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  private userData: any = {
    name: "",
    username: "",
    id: ""
  };

  constructor(private http: HttpClient) {}

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
  	return this.http.post<myData>("http://localhost:3000/login", {
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
        'Content-Type':  'application/json',
        'Authorization': this.jwtToken
      })
    };
    return this.http.get<myData>("http://localhost:3000/login/secured", httpOptions);
  }

  logout() {
    this.loggedInStatus = false;
    this.isAdmin = false;
    this.jwtToken = null;
    return this.http.post<myData>("http://localhost:3000/login/logout", {});
  }

}
