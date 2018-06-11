import { Component } from '@angular/core';

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

  constructor() {
  	console.log(this.aSimpleMethod(5, 2));
  }

  @functionDecorator
  aSimpleMethod(a, b) {
  	console.log("Hello World!!");
  	return a*b;
  }
}
