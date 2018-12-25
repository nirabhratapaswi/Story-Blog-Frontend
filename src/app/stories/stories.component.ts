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

	stories: Array<any> = null;
	message: any;
    subscription: Subscription;
    writers: Array<any> = null;
    singleStory: any = null;
    singleWriter: any = null;
    story_id: String = "";
    writer_id: String = "";
    selectedFilter: string = "All Stories";
  	filters: string[] = ["All Stories", "Maximum Likes", "Writers"];
  	story_offset: number = 0;
  	story_chunk_size: number = 5;
  	writer_offset: number = 0;
  	writer_chunk_size: number = 5;
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
  	load_function: any = null;
  	items_per_page: Array<number> = [5, 10, 20, 50];
  	selected_item_per_page: number = 5;
  	search_query: string = null;

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
		this.subscription = this.storiesService.getMessage().subscribe(message => {
			console.log("Message recieved by storiesComponent: ", message);
			this.message = message;
			this.stories = this.storiesService.getStoriesVariableChunk();	// this.storiesService.getStoriesVariable();
			if (this.selectedFilter == "Single Story") {
				this.goToStory(this.story_id);
			}
		});

		this.onResize(null);
	}

	ngOnInit() {
		this.load_function = this.storiesService.getStoriesVariableChunkViaCallback;
		if (this.stories == null) {
			this.story_offset = 0;
			this.nextStories();
		} else {
			this.story_offset = this.stories.length;
		}
	}

	changeItemsPerPage(items: number) {
		console.log(`Items: ${items}`);
		this.story_chunk_size = items;
		this.writer_chunk_size = items;
		console.log(`Selected filter: ${this.selectedFilter}`);
		this.changeView(this.selectedFilter);
	}

	changeView(filter) {
		if (filter == this.filters[0]) {
			this.story_offset = -this.story_chunk_size;
			this.load_function = this.storiesService.getStoriesVariableChunkViaCallback;
			this.nextStories();
		} else if (filter == this.filters[1]) {
			this.story_offset = -this.story_chunk_size;
			this.load_function = this.storiesService.getMostLikedStoriesVariableChunkViaCallback;
			this.nextStories();
		} else if (filter == this.filters[2]) {
			this.writer_offset = -this.writer_chunk_size;
			this.nextWriters();
		}
	}

	setNextPrevDisableForStories(stories) {
		if (this.story_chunk_size > this.stories.length || stories == null || (stories != null && stories.length == 0)) {
			this.next_disabled = true;
		} else {
			this.next_disabled = false;
		}
		if (this.story_offset == 0) {
			this.prev_disabled = true;
		} else {
			this.prev_disabled = false;
		}
	}

	setNextPrevDisableForWriters(writers) {
		if (this.writer_chunk_size > this.writers.length || writers == null || (writers != null && writers.length == 0)) {
			this.next_disabled = true;
		} else {
			this.next_disabled = false;
		}
		if (this.writer_offset == 0) {
			this.prev_disabled = true;
		} else {
			this.prev_disabled = false;
		}
	}

	prevStories() {
		this.story_offset =  (this.story_offset - this.story_chunk_size >= 0) ? (this.story_offset - this.story_chunk_size) : 0;
		let self = this;
	  	function callback(stories) {
	  		self.stories = stories;
	  		self.setNextPrevDisableForStories(stories);
	  	}
	  	this.load_function(this.story_offset, this.story_chunk_size, callback);
	}

	nextStories() {
		if (this.stories != null && this.story_offset >= 0) {
			this.story_offset = (this.story_chunk_size > this.stories.length) ? this.story_offset : (this.story_offset + this.story_chunk_size);
		} else {
			this.story_offset = 0;
		}
		let self = this;
	  	function callback(stories) {
	  		if (stories != null && stories.length != 0) {
	  			self.stories = stories;
	  		} else {
	  			self.story_offset = self.story_offset - self.story_chunk_size;
	  		}
	  		self.setNextPrevDisableForStories(stories);
	  	}
	  	this.load_function(this.story_offset, this.story_chunk_size, callback);
	}

	prevWriters() {
		this.writer_offset =  (this.writer_offset - this.writer_chunk_size >= 0) ? (this.writer_offset - this.writer_chunk_size) : 0;
		let self = this;
	  	function callback(writers) {
	  		self.writers = writers;
	  		self.setNextPrevDisableForWriters(writers);
	  	}
	  	this.writersService.getWritersVariableChunkViaCallback(this.writer_offset, this.writer_chunk_size, callback);
	}

	nextWriters() {
		if (this.writers != null && this.writer_offset >= 0) {
			this.writer_offset = (this.writer_chunk_size > this.writers.length) ? this.writer_offset : (this.writer_offset + this.writer_chunk_size);
		} else {
			this.writer_offset = 0;
		}
		let self = this;
	  	function callback(writers) {
	  		if (writers != null && writers.length != 0) {
	  			self.writers = writers;
	  		} else {
	  			self.writer_offset = self.writer_offset - self.writer_chunk_size;
	  		}
	  		self.setNextPrevDisableForWriters(writers);
	  	}
	  	this.writersService.getWritersVariableChunkViaCallback(this.writer_offset, this.writer_chunk_size, callback);
	}

  	goToStory(story_id) {
  		this.story_id = story_id;
  		console.log("Requested to go to story with id:", story_id);
  		this.storiesService.getOneStory(story_id).subscribe(data => {
	        this.selectedFilter = "Single Story";
	        this.singleStory = data;
      	});
  	}

	likeStory(story_id: string, story_index: number) {
    	if (!this.auth.getJwtToken()) {
    		return;
    	}
    	let self = this;
    	let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'Authorization': this.auth.getJwtToken()
			})
    	};
    	this.http.get<storiesData>(this.serverUrl.concat("/stories/like/", story_id), httpOptions).subscribe(data => {
			if (data.success) {
				this.story_offset -= this.story_chunk_size;
				this.nextStories();
			}
		});
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

	goToWriter(writer_id: string) {
		this.writer_id = writer_id;
		this.writersService.getOneWriter(writer_id).subscribe(data => {
			this.selectedFilter = "Single Writer";
			this.singleWriter = data;
		});
	}

	searchQuery(story: boolean) {
		console.log("Trying to search: ", "\"".concat(this.search_query, "\""));
		let self = this;
		function callback_stories(stories) {
			if (stories != null) {
				self.stories = stories;
			} else {
				self.stories = [];
			}
			self.setNextPrevDisableForStories(stories);
		}
		function callback_writers(writers) {
			if (writers != null) {
				self.writers = writers;
			} else {
				self.writers = [];
			}
			self.setNextPrevDisableForStories(writers);
		}
		if (story) {	// search Stories
			this.story_offset = 0;
			if (this.search_query != null && this.search_query.length >= 3) {
				this.storiesService.searchStories("\"".concat(this.search_query, "\""), callback_stories);	// \" is added as mongodb searches a normal string by splitting the whitespaces, so we provide "string" instead of string
			} else {
				this.prevStories();
			}
		} else {	// search Writers
			this.writer_offset = 0;
			if (this.search_query != null && this.search_query.length >= 3) {
				this.writersService.searchWriters("\"".concat(this.search_query, "\""), callback_writers);	// \" is added as mongodb searches a normal string by splitting the whitespaces, so we provide "string" instead of string
			} else {
				this.prevWriters();
			}
		}
	}

}
