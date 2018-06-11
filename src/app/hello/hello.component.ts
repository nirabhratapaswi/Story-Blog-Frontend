import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms'
import { RecordsService } from './../records.service';
import { HttpClient } from '@angular/common/http'

@Component({
	selector: 'app-hello',
	templateUrl: './hello.component.html',
	styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {

	inputValue = Math.random()
	disabledValue = Math.random() > 0.5
	modelValue = Math.random().toString();
	records: Object = [];

	constructor(private recordsFromRecordsService: RecordsService) {
		console.log("Hello Component Constructor called");
		this.recordsFromRecordsService = recordsFromRecordsService;
		/*setInterval(() => {
			console.log("haha");
			this.inputValue = Math.random();
			console.log(this.inputValue);
			this.disabledValue = Math.random() > 0.5;
			console.log(this.disabledValue);
		}, 1000);*/
	}

	clickFunction(value) {
		console.log(value);
	}

 	ngOnInit() {
 		this.recordsFromRecordsService.getRecords()
	 		.subscribe(data => {
					this.records =  data.data;
				});
 		/*this.records = [
			{
				'name': 'nirabhra',
				'age': 20
			}, {
				'name': 'ishan',
				'age': 19
			}, {
				'name': 'koustav',
				'age': 19
			}, {
				'name': 'mayank',
				'age': 21
			}, {
				'name': 'srikanth',
				'age': 22
			}, {
				'name': 'siddhant',
				'age': 22
			},
		];*/
 	}

}
