import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

function functionDecorator(target, name, descriptor) {
	console.log("Target:" , target, ", name:", name, ", descriptor: ", descriptor);
	const original = descriptor.value;
	descriptor.value = (...args) => {
		const result = original.apply(this, args); // see strict and non-strict modes
		return result;
	}
	return descriptor;
}

/*function classDecorator(className) {
	console.log(className);
	return (...args) => {
		console.log("Arguments passed to this class's constructor are: ", args);
		return new className(...args);
	}
}

@classDecorator
class myClass {
	constructor(arg1, arg2, arg3) {
		console.log("myClass constuctor called.");
	}
}

const myClassObj = new myClass(1, 2, 3);*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// @classDecorator
export class AppComponent {
  title = 'app';

  inputVal = 'hello';

  constructor(private Auth: AuthService, private router: Router) {
  	console.log(this.aSimpleMethod(5, 2));
  }

  @functionDecorator
  aSimpleMethod(a, b) {
  	console.log("Hello World!!");
  	return a*b;
  }

  routerClick(page) {
  	console.log("Page: ", page);
  	this.router.navigateByUrl('/'.concat(page));
  }

  isAdmin() {
  	return this.Auth.getAdminStatus();
  }

  isLoggedIn() {
  	return this.Auth.isLoggedIn;
  }

  logoutUser() {
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
