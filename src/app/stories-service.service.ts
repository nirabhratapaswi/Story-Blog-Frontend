import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

interface storiesData {
  success: boolean,
  title: String,
  text: String,
  authors: String,
  created_at: Date,
  updated_at: Date,
  likeStatus: boolean
}

@Injectable({
  providedIn: 'root'
})
export class StoriesServiceService {

	stories: Array<any> = null;
	private subject = new Subject<any>();
	message: any;
    subscription: Subscription;
    selfMessage: String = "Personal Message for storiesService.";

  	constructor(private http: HttpClient, private auth: AuthService) {
  		console.log("Stories Service constructor called...");
  		this.getStories();
  		this.subscription = this.getMessage().subscribe(message => {
  			console.log("Message recieved by stories-service: ", message);
  			this.message = message;
  			if (message.text == this.selfMessage || message.text == this.selfMessage.toString()) {
  				//
  			} else {
  				this.getStories();
  			}
  		});
  	}

  	sendMessage(message: String) {
        this.subject.next({ text: message });
    }
 
    clearMessage() {
        this.subject.next();
    }
 
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

  	getStories() {
		console.log();
	  	return this.http.get<storiesData[]>("http://localhost:3000/stories", {}).subscribe(data => {
	  		console.log("Data from server: ", data);
	  		for (let i=0; i<data.length; i++) {
	  			data[i].likeStatus = false;
	  		}
	  		this.stories = data;
	  		this.sendMessage(this.selfMessage);
	  	});
  }

  getStoriesVariable() {
  	return this.stories;
  }

  getStoriesVariableViaCallback(callback) {
  	return this.http.get<storiesData[]>("http://localhost:3000/stories", {}).subscribe(data => {
	  		console.log("Data from server: ", data);
	  		for (let i=0; i<data.length; i++) {
	  			data[i].likeStatus = false;
	  		}
	  		callback(data);
	  	});
  }
}
