import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

interface registerData {
	name: String,
	username: String,
	email: String,
	password: String
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	constructor(private registerService: RegisterService, private router: Router, private appComponent: AppComponent) {}

	ngOnInit() {
		this.registerService.hello("Hello from the other side");
	}

	form_data: registerData = {
		name: null,
		username: null,
		email: null,
		password: null
	};
	password_verify : String;
	password_warning: String = "";
	warning: String = "";
	message: String = "";
	submit_disabled: boolean = false;

	registerUser() : void {
		this.message = "Processing request, please wait...";
		this.submit_disabled = true;
		console.log("Form data", this.form_data);
		if (this.form_data.name == null || this.form_data.email == null || this.form_data.username == null || this.form_data.password == null) {
			this.warning = "Fill all fields.";
			this.message = "";
			return;
		}
		if (this.form_data.password != this.password_verify) {
			this.message = "";
			this.password_warning = "passwords don't match"; 
			this.submit_disabled = false;
			return;
		}
		this.registerService.registerUser(this.form_data).subscribe(data => {
			if (data.success) {
				console.log("Registration successful!!");
				this.appComponent.routerClick("login");
			} else {
				console.log("Registration failed");
				this.warning = "Fill all fields.";
				if (data.key_exists) {
					this.warning = "Username/email already exists, please try a new one."
				}
			}
			this.submit_disabled = false;
			this.message = "";
			console.log("Data: ", data, ' recieved from the server.');
		});
	}

}
