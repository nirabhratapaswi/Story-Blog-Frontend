import { Component, OnInit, HostListener } from '@angular/core';
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
    singleWriter: any = null;
    story_id: String = "";
    writer_id: String = "";
    selectedFilter: string = "All Stories";
  	filters: string[] = ["All Stories", "Maximum Likes", "Writers"];
  	private storyOffset: number;
  	private storyChunkSize: number;
  	private mostLikedOffset: number;
  	private mostLikedChunkSize: number;
  	serverUrl = environment.baseUrl.concat(":", environment.port.toString());
  	screen_columns: number = 3;
  	detect_mobile: boolean = false;
  	image_dimensions: any = {
  		width: '90%',
  		height: '30%',
  		padding_left: '2px',
  		padding_top: '15px'
  	};
  	row_height: string = "1:1";

  	getHeight(percentage: number) {
  		return (window.innerHeight * percentage / 100).toString() + "px";
  	}

  	getWidth(percentage: number) {
  		return (window.innerWidth * percentage / 100).toString() + "px";
  	}

  	onResize(event) {
  		if (window.innerWidth <= 600) {
  			this.screen_columns = 1;
  			this.detect_mobile = true;
  			this.image_dimensions = {
		  		width: '120px',
		  		height: '120px',
		  		padding_left: '2px',
		  		padding_top: '0px'
		  	};
		  	this.row_height = "350px";
  		} else if (window.innerWidth < 1000) {
  			this.screen_columns = 2;
  			this.detect_mobile = false;
  			this.image_dimensions = {
		  		width: '90%',
		  		height: '25%',
		  		padding_left: '0px',
		  		padding_top: '15px'
		  	};
		  	this.row_height = "350px";
  		} else {
  			this.screen_columns = 3;
  			this.detect_mobile = false;
  			this.image_dimensions = {
		  		width: '90%',
		  		height: '30%',
		  		padding_left: '0px',
		  		padding_top: '15px'
		  	};
		  	this.row_height = "350px";
  		}
  	}

	constructor(private http: HttpClient, private auth: AuthService, private storiesService: StoriesServiceService, private writersService: WritersService) {
		this.stories = this.storiesService.getStoriesVariableChunk();
		this.mostLikedStories = this.storiesService.getMostLikedStoriesVariableChunk();
		console.log("Stories, ", this.stories, ", mostLiekdStories: ", this.mostLikedStories);
		this.storyChunkSize = 10;
		if (this.stories == null) {
			this.storyOffset = 0;
			this.loadMoreStories();
		} else {
			this.storyOffset = this.stories.length;
		}
		this.mostLikedChunkSize = 10;
		if (this.mostLikedStories == null) {
			this.mostLikedOffset = 0;
			this.loadMoreMostLikedStories();
		} else {
			this.mostLikedOffset = this.mostLikedStories.length;
		}
		this.getWriters();
		this.subscription = this.storiesService.getMessage().subscribe(message => {
			console.log("Message recieved by storiesComponent: ", message);
			this.message = message;
			this.stories = this.storiesService.getStoriesVariableChunk();	// this.storiesService.getStoriesVariable();
			this.mostLikedStories = this.storiesService.getMostLikedStoriesVariableChunk();	// this.storiesService.getMostLikedStoriesVariable();
			if (this.selectedFilter == "Single Story") {
				this.goToStory(this.story_id);
			}
		});

		this.onResize(null);
	}

	ngOnInit() {}

	loadMoreStories() {
		let self = this;
	  	function callback(stories) {
	  		self.stories = stories;
	  		self.storyOffset = self.stories.length;
	  		console.log("Story Offset: ", self.storyOffset, ", Story Chunk Size: ", self.storyChunkSize, ", stories: ", stories);
	  	}
	  	this.storiesService.getStoriesVariableChunkViaCallback(this.storyOffset, this.storyChunkSize, callback);
	  	console.log("Story Offset: ", this.storyOffset, ", Story Chunk Size: ", this.storyChunkSize);
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

  	loadMoreMostLikedStories() {
		let self = this;
	  	function callback(mostLikedStories) {
	  		self.mostLikedStories = mostLikedStories;
	  		self.mostLikedOffset = self.mostLikedStories.length;
	  		console.log("Most Liked Offset: ", self.mostLikedOffset, ", most liked chunk size: ", self.mostLikedChunkSize, ", stories: ", mostLikedStories);
	  	}
	  	this.storiesService.getMostLikedStoriesVariableChunkViaCallback(this.mostLikedOffset, this.mostLikedChunkSize, callback);
	  	console.log("Most Liked Offset: ", this.mostLikedOffset, ", most liked chunk size: ", this.mostLikedChunkSize);
	}

  	getWriters() {
  		let self = this;
		function callback(writers) {
	  		self.writers = writers;
	  		console.log("Writers in stories component: ", writers);
	  	}
	  	if (this.writersService.getWritersVariable() == null) {
	  		this.writersService.getWritersVariableViaCallback(callback);
	  	} else {
	  		this.writers = this.writersService.getWritersVariable();
	  		console.log("Writers: ", this.writers);
	  	}
  	}

  	goToStory(story_id) {
  		this.story_id = story_id;
  		console.log("Requested to go to story with id:", story_id);
  		this.storiesService.getOneStory(story_id).subscribe(data => {
	        this.selectedFilter = "Single Story";
	        this.singleStory = data;
	        console.log("singleStory: ", data);
      	});
  	}

  likeStory(story_id: string, story_index: number) {
    console.log("Trying to like: ", story_id);
    if (!this.auth.getJwtToken()) {
    	return;
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth.getJwtToken()
      })
    };
    return this.http.get<storiesData>(this.serverUrl.concat("/stories/like/", story_id), httpOptions).subscribe(data => {
		console.log("Data from server: ", data);
		if (data.success) {
			if (story_index) {
				this.stories[story_index].likeStatus = !this.stories[story_index].likeStatus;
			}
			
			this.storiesService.setStoriesVariableChunk(null);
			this.storiesService.setMostLikedStoriesVariableChunk(null);
			let storyOffsetSave = this.storyOffset;
			for (let i=0; i<storyOffsetSave; i++) {
				this.storyOffset = i;
				this.loadMoreStories();
				i += this.storyChunkSize;
			}
			this.storyOffset = storyOffsetSave;
			let mostLikedOffsetSave = this.mostLikedOffset;
			for (let i=0; i<storyOffsetSave; i++) {
				this.mostLikedOffset = i;
				this.loadMoreMostLikedStories();
				i += this.storyChunkSize;
			}
			this.mostLikedOffset = mostLikedOffsetSave;

			this.storiesService.sendMessage("Message from Stories Component!");
		}
	});
  }

  goToWriter(writer_id: string) {
	this.writer_id = writer_id;
	console.log("Requested to go to writer with id:", writer_id);
	this.writersService.getOneWriter(writer_id).subscribe(data => {
		this.selectedFilter = "Single Writer";
		this.singleWriter = data;
		console.log("singleWriter: ", data);
	});
  }

}
