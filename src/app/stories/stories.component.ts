import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { StoriesServiceService } from '../stories-service.service';
import { WritersService } from '../writers.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

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
	mostLikedStories: Array<any> = null;
	message: any;
    subscription: Subscription;
    writers: Array<any> = null;
    singleStory: any = null;
    storyId: String = "";
    selectedFilter: string = "All Stories";
  	filters: string[] = ["All Stories", "Maximum Likes", "Writers"];
  	serverUrl = environment.baseUrl.concat(":", environment.port.toString());

	constructor(private http: HttpClient, private auth: AuthService, private storiesService: StoriesServiceService, private writersService: WritersService) {
		/*for (let i=0; i<10; i++) {
			this.cards.push('hello');
		}*/
		this.subscription = this.storiesService.getMessage().subscribe(message => {
			console.log("Message recieved by storiesComponent: ", message);
			this.message = message;
			this.stories = this.storiesService.getStoriesVariable();
			this.mostLikedStories = this.storiesService.getMostLikedStoriesVariable();
			if (this.selectedFilter == "Single Story") {
				this.goToStory(this.storyId);
			}
		});
	}

	ngOnInit() {
		this.getStories();
		this.getWriters();
		this.getMostLikedStories();
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

  	getMostLikedStories() {
	  	let self = this;
	  	function callback(mostLikedStories) {
	  		self.mostLikedStories = mostLikedStories;
	  	}
	  	if (this.storiesService.getMostLikedStoriesVariable() == null) {
	  		this.storiesService.getMostLikedStoriesVariableViaCallback(callback);
	  	} else {
	  		this.mostLikedStories = this.storiesService.getMostLikedStoriesVariable();
	  	}
  	}

  	getWriters() {
  		let self = this;
		function callback(writers) {
	  		self.writers = writers;
	  	}
	  	if (this.writersService.getWritersVariable() == null) {
	  		this.writersService.getWritersVariableViaCallback(callback);
	  	} else {
	  		this.writers = this.writersService.getWritersVariable();
	  	}
  	}

  	goToStory(storyId) {
  		this.storyId = storyId;
  		console.log("Requested to go to story with id:", storyId);
  		this.storiesService.getOneStory(storyId).subscribe(data => {
	        // console.log("Single story data from server: ", data);
	        this.selectedFilter = "Single Story";
	        this.singleStory = data;
	        console.log("singleStory: ", data);
      	});
  	}

  /*getStoriesVariable() {
  	return this.stories;
  }*/

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
    return this.http.get<storiesData>(this.serverUrl.concat("/stories/like/", storyId), httpOptions).subscribe(data => {
		console.log("Data from server: ", data);
		if (data.success) {
			if (storyIndex) {
				this.stories[storyIndex].likeStatus = !this.stories[storyIndex].likeStatus;
			}
			/*this.storiesService.getStories();
			this.getStories();*/
			this.storiesService.sendMessage("Message from Stories Component!");
		}
	});
  }

}
