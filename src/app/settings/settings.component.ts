import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

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

}
