import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';

interface storiesData {
  success: boolean,
  title: String,
  text: String,
  authors: String,
  created_at: Date,
  updated_at: Date,
  likeStatus: boolean
}

interface updateStory {
  success: boolean,
  msg: String,
  error: any
}

@Injectable({
  providedIn: 'root'
})
export class StoriesServiceService {

	stories: Array<any> = null;
  mostLikedStories: Array<any> = null;
  stories_chunk: Array<any> = null;
  most_liked_stories_chunk: Array<any> = null;
	private subject = new Subject<any>();
  serverUrl = environment.baseUrl.concat(":", environment.port.toString());
	message: any;
  subscription: Subscription;
  self_message: String = "Personal Message for storiesService.";

  constructor(private http: HttpClient, private authService: AuthService) {
  	console.log("Stories Service constructor called...");
  	this.getStories();
  	this.subscription = this.getMessage().subscribe(message => {
  		console.log("Message recieved by stories-service: ", message);
  		this.message = message;
  		if (message.text == this.self_message || message.text == this.self_message.toString()) {
  			//
  		} else {
  			this.getStories();
        this.getMostLikedStories();
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

  loadStories(offset: number, size: number) {
    return this.http.get<storiesData[]>(this.serverUrl.concat("/stories/chunk/", offset.toString(), "/", size.toString()), {}).subscribe(data => {
      console.log("All Stories: ", data);
      for (let i=0; i<data.length; i++) {
        data[i].likeStatus = false;
      }
      this.stories = data;
      this.sendMessage(this.self_message);
    });
  }

  getStories() {
	  	return this.http.get<storiesData[]>(this.serverUrl.concat("/stories"), {}).subscribe(data => {
	  		console.log("All Stories: ", data);
	  		for (let i=0; i<data.length; i++) {
	  			data[i].likeStatus = false;
	  		}
	  		this.stories = data;
	  		this.sendMessage(this.self_message);
	  	});
  }

  getMostLikedStories() {
      return this.http.get<storiesData[]>(this.serverUrl.concat("/stories/mostLikes"), {}).subscribe(data => {
        console.log("Most Liked Stories: ", data);
        for (let i=0; i<data.length; i++) {
          data[i].likeStatus = false;
        }
        this.mostLikedStories = data;
        this.sendMessage(this.self_message);
      });
  }

  getMostLikedStoriesVariable() {
    return this.mostLikedStories;
  }

  getMostLikedStoriesVariableChunk() {
    return this.most_liked_stories_chunk;
  }

  setMostLikedStoriesVariableChunk(value: Array<any>) {
    this.most_liked_stories_chunk = value;
  }

  getOneStory(storyId) {
    return this.http.get<storiesData>(this.serverUrl.concat("/stories/getOne/").concat(storyId), {});
  }

  getStoriesVariable() {
  	return this.stories;
  }

  getStoriesVariableChunk() {
    return this.stories_chunk;
  }

  setStoriesVariableChunk(value: Array<any>) {
    this.stories_chunk = value;
  }

  getStoriesVariableViaCallback(callback) {
    return this.http.get<storiesData[]>(this.serverUrl.concat("/stories"), {}).subscribe(data => {
        console.log("All Stories: ", data);
        for (let i=0; i<data.length; i++) {
          data[i].likeStatus = false;
        }
        this.stories = data;
        callback(data);
      });
  }

  getMostLikedStoriesVariableViaCallback(callback) {
    return this.http.get<storiesData[]>(this.serverUrl.concat("/stories/mostLikes"), {}).subscribe(data => {
        console.log("Most Liked Stories: ", data);
        for (let i=0; i<data.length; i++) {
          data[i].likeStatus = false;
        }
        this.mostLikedStories = data;
        callback(data);
      });
  }

  getStoriesVariableChunkViaCallback(offset: number, size: number, callback) {
    return this.http.get<storiesData[]>(this.serverUrl.concat("/stories/chunk/", offset.toString(), "/", size.toString()), {}).subscribe(data => {
        console.log("All Stories: ", data);
        for (let i=0; i<data.length; i++) {
          data[i].likeStatus = false;
        }
        if (this.stories_chunk == null) {
          this.stories_chunk = new Array();
        }
        this.stories_chunk = data;
        /*for (let x in data) {
          this.stories_chunk.push(data[x]);
        }*/
        callback(this.stories_chunk);
      });
  }

  getMostLikedStoriesVariableChunkViaCallback(offset: number, size: number, callback) {
    return this.http.get<storiesData[]>(this.serverUrl.concat("/stories/chunk/mostLikes/", offset.toString(), "/", size.toString()), {}).subscribe(data => {
        console.log("Most Liked Stories: ", data);
        for (let i=0; i<data.length; i++) {
          data[i].likeStatus = false;
        }
        for (let x in data) {
          if (this.most_liked_stories_chunk == null) {
            this.most_liked_stories_chunk = new Array();
          }
          this.most_liked_stories_chunk.push(data[x]);
        }
        callback(this.most_liked_stories_chunk);
      });
  }

  updateStory(story_id: string, title: string, text: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type':  'application/json',
        'Authorization': this.authService.getJwtToken()
      })
    };
    return this.http.post<updateStory>(this.serverUrl.concat("/stories/update/?story_id=", story_id), {
      title: title,
      text: text
    }, httpOptions);
  }

  /*refreshStoriesVariableChunkViaCallback(offset: number, size: number, callback) {
    let stories_chunk_new = null,
        offsets = new Array();
    for (let i=0; i<offset; i++) {
      offsets.push(i*size);
    }
    return async.each(offsets, (offsetVariable, async_callback) => {
      this.http.get<storiesData[]>(this.serverUrl.concat("/stories/chunk/", offsetVariable.toString(), "/", size.toString()), {}).subscribe(data => {
        console.log("All Stories: ", data);
        for (let i=0; i<data.length; i++) {
          data[i].likeStatus = false;
        }
        for (let x in data) {
          if (stories_chunk_new == null) {
            stories_chunk_new = new Array();
          }
          stories_chunk_new.push(data[x]);
        }
        async_callback();
      });
    }, (err) => {
      if (err) {
        console.log("Error: ", err);
        return null;
      } else {
        this.stories_chunk = stories_chunk_new;
        return callback(this.stories_chunk);
      }
    });
  }

  refreshMostLikedStoriesVariableChunkViaCallback(offset: number, size: number, callback) {
    let most_liked_stories_chunk_new = null,
        offsets = new Array();
    for (let i=0; i<offset; i++) {
      offsets.push(i*size);
    }
    return async.each(offsets, (offsetVariable, async_callback) => {
      this.http.get<storiesData[]>(this.serverUrl.concat("/stories/chunk/mostLikes/", offsetVariable.toString(), "/", size.toString()), {}).subscribe(data => {
        console.log("All Stories: ", data);
        for (let i=0; i<data.length; i++) {
          data[i].likeStatus = false;
        }
        for (let x in data) {
          if (most_liked_stories_chunk_new == null) {
            most_liked_stories_chunk_new = new Array();
          }
          most_liked_stories_chunk_new.push(data[x]);
        }
        async_callback();
      });
    }, (err) => {
      if (err) {
        console.log("Error: ", err);
        return null;
      } else {
        this.most_liked_stories_chunk = most_liked_stories_chunk_new;
        return callback(this.most_liked_stories_chunk);
      }
    });
  }*/
}
