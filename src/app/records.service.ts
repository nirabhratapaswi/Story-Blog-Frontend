import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';

interface myData {
	data: Object
}

@Injectable({
	providedIn: 'root'
})
export class RecordsService {

	data: Object = [];

	constructor(private http: HttpClient) {
		this.http = http;
		this.data = [
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
			}
		];
		console.log("This is working, why not getRecords??");
	}

	getRecords() {
		// return this.data;
		return this.http.get<myData>('http://localhost:3000/data');
	}
}
