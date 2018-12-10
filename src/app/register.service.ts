import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

interface myData {
	success: boolean,
	msg: String,
	key_exists: boolean
}

interface registerData {
	name: String,
	username: String,
	email: String,
	password: String
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

	private loggedInStatus = false;
	private jwtToken: string = "lol-auth";
	private isAdmin: Boolean = false;
	serverUrl = environment.baseUrl.concat(":", environment.port.toString());
	private userData: any = {
		name: "",
		username: "",
		id: ""
	};

	constructor(private http: HttpClient) {}

	registerUser(data: registerData) {
		console.log("Data for registration: ", data);
		return this.http.post<myData>(this.serverUrl.concat("/register"), data);
	}

	hello(data: string) {
		console.log("Data for hello: ", data);
	}

}
