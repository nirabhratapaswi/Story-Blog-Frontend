import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class MyNavComponent {

	opened: boolean = true;
	events: string[] = [];
	shouldRun: boolean = true;
	check: boolean = true;

	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
	  .pipe(
	    map(result => result.matches)
	  );
    
	constructor(private breakpointObserver: BreakpointObserver) {}
  
  	changeChecked() {
  		this.opened = !this.opened;
  	}

  }
