import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoriesServiceService } from '../stories-service.service';
import { WritersService } from '../writers.service';
import { environment } from '../../environments/environment';

interface myData {
  success: boolean,
  msg: String,
  data: String,
  jwt: string
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

	title: string;
	text: string;
	author: string;
  serverUrl = environment.baseUrl.concat(":", environment.port.toString());

  constructor(private http: HttpClient, private auth: AuthService, private storiesService: StoriesServiceService, private writersService: WritersService) {
  	console.log("Upload component initialized...");
  }

  ngOnInit() {
  	console.log("Upload component called...");
  }

  uploadStory(event) {
  	event.preventDefault();
  	console.log("title: ", this.title, ", text: ", this.text, ", author: ", this.author);
  	let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth.getJwtToken()
      })
    };
  	return this.http.post<myData>(this.serverUrl.concat("/stories/upload"), {
  		title: this.title,
  		text: this.text,
  		authors: this.author
  	}, httpOptions).subscribe(data => {
  		console.log("Data from server: ", data);
      if (data.success) {
        this.title = null;
        this.text = null;
        this.author = null;
        this.storiesService.sendMessage('Deleted Story from Admin Component!');
        this.writersService.sendMessage('Deleted Story from Admin Component!');
      }
  	});
  }

}
