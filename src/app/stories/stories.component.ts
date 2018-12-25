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
	most_liked_stories: Array<any> = null;
	message: any;
    subscription: Subscription;
    writers: Array<any> = null;
    singleStory: any = null;
    singleWriter: any = null;
    story_id: String = "";
    writer_id: String = "";
    selectedFilter: string = "All Stories";
  	filters: string[] = ["All Stories", "Maximum Likes", "Writers"];
  	private story_offset: number;
  	private story_chunk_size: number = 5;
  	private most_liked_offset: number;
  	private most_liked_chunk_size: number = 5;
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
  	next_disabled = false;
  	prev_disabled = true;

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
		this.most_liked_stories = this.storiesService.getMostLikedStoriesVariableChunk();
		console.log("Stories, ", this.stories, ", mostLiekdStories: ", this.most_liked_stories);
		// this.story_chunk_size = 10;
		if (this.stories == null) {
			this.story_offset = 0;
			// this.loadMoreStories();
			this.nextStories();
		} else {
			this.story_offset = this.stories.length;
		}
		// this.most_liked_chunk_size = 10;
		if (this.most_liked_stories == null) {
			this.most_liked_offset = 0;
			this.loadMoreMostLikedStories();
		} else {
			this.most_liked_offset = this.most_liked_stories.length;
		}
		this.getWriters();
		this.subscription = this.storiesService.getMessage().subscribe(message => {
			console.log("Message recieved by storiesComponent: ", message);
			this.message = message;
			this.stories = this.storiesService.getStoriesVariableChunk();	// this.storiesService.getStoriesVariable();
			this.most_liked_stories = this.storiesService.getMostLikedStoriesVariableChunk();	// this.storiesService.getMostLikedStoriesVariable();
			if (this.selectedFilter == "Single Story") {
				this.goToStory(this.story_id);
			}
		});

		this.onResize(null);
	}

	ngOnInit() {}

	setNextPrevDisableForStories(stories) {
		if (this.story_chunk_size > this.stories.length || stories == null || (stories != null && stories.length == 0)) {
			console.log("Lol next happened!");
			this.next_disabled = true;
		} else {
			this.next_disabled = false;
		}
		if (this.story_offset == 0) {
			console.log("Lol prev happened!");
			this.prev_disabled = true;
		} else {
			this.prev_disabled = false;
		}
		console.log("Next, prev", this.next_disabled, this.prev_disabled);
	}

	setNextPrevDisableForMostLikedStories(stories) {
		if (this.most_liked_chunk_size > this.most_liked_stories.length || stories == null || (stories != null && stories.length == 0)) {
			console.log("Lol next happened!");
			this.next_disabled = true;
		} else {
			this.next_disabled = false;
		}
		if (this.most_liked_offset == 0) {
			console.log("Lol prev happened!");
			this.prev_disabled = true;
		} else {
			this.prev_disabled = false;
		}
		console.log("Next, prev", this.next_disabled, this.prev_disabled);
	}

	loadMoreStories() {
		let self = this;
	  	function callback(stories) {
	  		self.stories = stories;
	  		self.story_offset = self.stories.length;
	  		console.log("Story Offset: ", self.story_offset, ", Story Chunk Size: ", self.story_chunk_size, ", stories: ", stories);
	  	}
	  	this.storiesService.getStoriesVariableChunkViaCallback(this.story_offset, this.story_chunk_size, callback);
	  	console.log("Story Offset: ", this.story_offset, ", Story Chunk Size: ", this.story_chunk_size);
	}

	prevStories() {
		this.story_offset =  (this.story_offset - this.story_chunk_size >= 0) ? (this.story_offset - this.story_chunk_size) : 0;
		let self = this;
	  	function callback(stories) {
	  		self.stories = stories;
	  		self.setNextPrevDisableForStories(stories);
	  		// self.story_offset =  (self.story_offset - self.story_chunk_size >= 0) ? (self.story_offset - self.story_chunk_size) : 0;
	  		console.log("Story Offset: ", self.story_offset, ", Story Chunk Size: ", self.story_chunk_size, ", stories: ", stories);
	  	}
	  	this.storiesService.getStoriesVariableChunkViaCallback(this.story_offset, this.story_chunk_size, callback);
	  	console.log("Story Offset: ", this.story_offset, ", Story Chunk Size: ", this.story_chunk_size);
	}

	nextStories() {
		// this.story_offset = this.story_offset + this.story_chunk_size;
		if (this.stories != null) {
			this.story_offset = (this.story_chunk_size > this.stories.length) ? this.story_offset : (this.story_offset + this.story_chunk_size);
		}
		let self = this;
	  	function callback(stories) {
	  		if (stories != null && stories.length != 0) {
	  			self.stories = stories;
	  		} else {
	  			self.story_offset = self.story_offset - self.story_chunk_size;
	  		}
	  		self.setNextPrevDisableForStories(stories);
	  		// self.story_offset = (self.story_chunk_size > stories.length) ? self.story_offset : (self.story_offset + self.story_chunk_size);
	  		console.log("Story Offset: ", self.story_offset, ", Story Chunk Size: ", self.story_chunk_size, ", stories: ", stories);
	  	}
	  	this.storiesService.getStoriesVariableChunkViaCallback(this.story_offset, this.story_chunk_size, callback);
	  	console.log("Story Offset: ", this.story_offset, ", Story Chunk Size: ", this.story_chunk_size);
	}

	prevMostLikedStories() {
		this.most_liked_offset =  (this.most_liked_offset - this.most_liked_chunk_size >= 0) ? (this.most_liked_offset - this.most_liked_chunk_size) : 0;
		let self = this;
	  	function callback(most_liked_stories) {
	  		self.most_liked_stories = most_liked_stories;
	  		self.setNextPrevDisableForMostLikedStories(most_liked_stories);
	  		// self.most_liked_offset =  (self.most_liked_offset - self.most_liked_chunk_size >= 0) ? (self.most_liked_offset - self.most_liked_chunk_size) : 0;
	  		console.log("Story Offset: ", self.most_liked_offset, ", Story Chunk Size: ", self.most_liked_chunk_size, ", stories: ", most_liked_stories);
	  	}
	  	this.storiesService.getStoriesVariableChunkViaCallback(this.most_liked_offset, this.most_liked_chunk_size, callback);
	  	console.log("Story Offset: ", this.most_liked_offset, ", Story Chunk Size: ", this.most_liked_chunk_size);
	}

	nextMostLikedStories() {
		if (this.most_liked_stories != null) {
			this.most_liked_offset = (this.most_liked_chunk_size > this.most_liked_stories.length) ? this.most_liked_offset : (this.most_liked_offset + this.most_liked_chunk_size);
		}
		let self = this;
	  	function callback(most_liked_stories) {
	  		if (most_liked_stories != null && most_liked_stories.length != 0) {
	  			self.most_liked_stories = most_liked_stories;
	  		} else {
	  			self.most_liked_offset = self.most_liked_offset - self.most_liked_chunk_size;
	  		}
	  		self.setNextPrevDisableForMostLikedStories(most_liked_stories);
	  		// self.most_liked_offset = (self.most_liked_chunk_size > stories.length) ? self.most_liked_offset : (self.most_liked_offset + self.most_liked_chunk_size);
	  		console.log("Story Offset: ", self.most_liked_offset, ", Story Chunk Size: ", self.most_liked_chunk_size, ", stories: ", most_liked_stories);
	  	}
	  	this.storiesService.getStoriesVariableChunkViaCallback(this.most_liked_offset, this.most_liked_chunk_size, callback);
	  	console.log("Story Offset: ", this.most_liked_offset, ", Story Chunk Size: ", this.most_liked_chunk_size);
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
	  	function callback(most_liked_stories) {
	  		self.most_liked_stories = most_liked_stories;
	  	}
	  	if (this.storiesService.getMostLikedStoriesVariable() == null) {
	  		this.storiesService.getMostLikedStoriesVariableViaCallback(callback);
	  	} else {
	  		this.most_liked_stories = this.storiesService.getMostLikedStoriesVariable();
	  	}
  	}

  	loadMoreMostLikedStories() {
		let self = this;
	  	function callback(most_liked_stories) {
	  		self.most_liked_stories = most_liked_stories;
	  		self.most_liked_offset = self.most_liked_stories.length;
	  		console.log("Most Liked Offset: ", self.most_liked_offset, ", most liked chunk size: ", self.most_liked_chunk_size, ", stories: ", most_liked_stories);
	  	}
	  	this.storiesService.getMostLikedStoriesVariableChunkViaCallback(this.most_liked_offset, this.most_liked_chunk_size, callback);
	  	console.log("Most Liked Offset: ", this.most_liked_offset, ", most liked chunk size: ", this.most_liked_chunk_size);
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
			let story_offset_save = this.story_offset;
			for (let i=0; i<story_offset_save; i++) {
				this.story_offset = i;
				this.loadMoreStories();
				i += this.story_chunk_size;
			}
			this.story_offset = story_offset_save;
			let most_liked_offset_save = this.most_liked_offset;
			for (let i=0; i<story_offset_save; i++) {
				this.most_liked_offset = i;
				this.loadMoreMostLikedStories();
				i += this.story_chunk_size;
			}
			this.most_liked_offset = most_liked_offset_save;

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
