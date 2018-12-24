import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	old_password: string;
	new_password: string;
	confirm_new_password: string;
	password_warning: string = null;
	warning: string = null;
	success_message: string = null;
	name_warning: string = null;
	name_success_message: string = null;
	name: string = null;
	submit_disabled: boolean = false;

	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit() {}

	deleteUser() {
		console.log(this.authService.getUserData());
		this.authService.deleteUser().subscribe(data => {
			console.log("Returned data: ", data);
			this.authService.logout();
			this.router.navigate(["register"]);
    	});
	}

	changeName() {
		this.submit_disabled = true;
		this.authService.changeName(this.name).subscribe(data => {
			this.submit_disabled = false;
			if (!data.success) {
				if (data.message == null || data.message == "" || data.message == undefined) {
					data.message = "Some error occurred, try again...";
				}
				this.name_warning = data.message.toString();
				this.name_success_message = null;
				return;
			}

			this.name_warning = null;
			this.name_success_message = "Name update successful!";
		});
	}

	changePassword() {
		console.log(this.old_password, this.new_password, this.confirm_new_password);
		this.submit_disabled = true;
		if (this.new_password != this.confirm_new_password) {
			this.password_warning = "passwords don't match"; 
			this.submit_disabled = false;
			return;
		}

		this.authService.changePassword(this.old_password, this.new_password).subscribe(data => {
			this.submit_disabled = false;
			console.log("Server returned: ", data);
			if (!data.success) {
				if (data.message == null || data.message == "" || data.message == undefined) {
					data.message = "Some error occurred, try again...";
				}
				this.warning = data.message.toString();
				this.success_message = null;
				this.password_warning = null;
				return;
			}

			this.warning = null;
			this.success_message = "Password update successful!";
			this.password_warning = null;
			this.authService.logout();
			this.router.navigate(["login"]);
		});
	}

}
