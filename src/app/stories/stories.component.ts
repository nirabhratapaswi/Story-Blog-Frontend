import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

	cards: Array<any> = [];
	date: String = (new Date()).toString();

	constructor() {
		for (let i=0; i<10; i++) {
			this.cards.push('hello');
		}
	}

	ngOnInit() {
	}

}
