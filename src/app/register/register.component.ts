import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';

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

	constructor(private registerService: RegisterService, private router: Router) {}

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

	registerUser() : void {
		if (this.form_data.password != this.password_verify) {
			this.password_warning = "passwords don't match"; 
			return;
		}
		this.registerService.registerUser(this.form_data).subscribe(data => {
			if (data.success) {
				console.log("Login successful!!");
				this.router.navigate(["login"]);
			} else {
				console.log("Login failed");
				this.warning = "Fill all fields.";
			}
			console.log("Data: ", data, ' recieved from the server.');
		});
	}

}
