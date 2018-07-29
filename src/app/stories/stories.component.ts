import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { StoriesServiceService } from '../stories-service.service';
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

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

	cards: Array<any> = [];
	date: String = (new Date()).toString();
	stories: Array<any> = null;
	message: any;
    subscription: Subscription;

	constructor(private http: HttpClient, private auth: AuthService, private storiesService: StoriesServiceService) {
		/*for (let i=0; i<10; i++) {
			this.cards.push('hello');
		}*/
		this.subscription = this.storiesService.getMessage().subscribe(message => {
			console.log("Message recieved by storiesComponent: ", message);
			this.message = message;
			this.stories = this.storiesService.getStoriesVariable();
		});
	}

	ngOnInit() {
		this.getStories();
	}

	getStories() {
	  	let self = this;
	  	function callback(stories) {
	  		self.stories = stories;
	  	}
	  	if (this.storiesService.getStoriesVariable() == null) {
	  		this.storiesService.getStoriesVariableViaCallback(callback);
	  	} else {
	  		this.stories = this.storiesService.getStoriesVariable();
	  	}
  }

  getStoriesVariable() {
  	return this.stories;
  }

  likeStory(storyId: string, storyIndex: number) {
    console.log("Trying to like: ", storyId);
    if (!this.auth.getJwtToken()) {
    	return;
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth.getJwtToken()
      })
    };
    return this.http.get<storiesData>("http://localhost:3000/stories/like/".concat(storyId), httpOptions).subscribe(data => {
		console.log("Data from server: ", data);
		if (data.success) {
			this.stories[storyIndex].likeStatus = !this.stories[storyIndex].likeStatus;
			/*this.storiesService.getStories();
			this.getStories();*/
			this.storiesService.sendMessage("Message from Stories Component!");
		}
	});
  }

}
