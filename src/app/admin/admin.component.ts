import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { StoriesServiceService } from '../stories-service.service';
import { WritersService } from '../writers.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DialogData {
  animal: string;
  name: string;
}

interface myData {
  success: boolean,
  msg: String,
  data: String,
  jwt: string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

	title: string;
	text: string;
	author: string;
  source: LocalDataSource; // add a property to the component
  stories: Array<any> = [];
  message: any;
  subscription: Subscription;
  serverUrl = environment.baseUrl.concat(":", environment.port.toString());

  settings = {
    columns: {
      authors: {
        title: 'Authors',
        filter: true
      },
      title: {
        title: 'Title',
        filter: true
      },
      likes: {
        title: 'Likes',
        filter: true
      },
      created_at: {
        title: 'Created At',
        filter: true
      }
    },
    mode: "inline",
    edit: {
      saveButtonContent: "Save",
      confirmSave: true
    },
    delete: {
      confirmDelete: true
    }
  };

  onSearch(query: string = '') {
    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'authors',
        search: query
      },
      {
        field: 'title',
        search: query
      },
      {
        field: 'likes',
        search: query
      },
      {
        field: 'created_at',
        search: query
      }
    ], false); 
    // second parameter specifying whether to perform 'AND' or 'OR' search 
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }

  constructor(private http: HttpClient, private auth: AuthService, private storiesService: StoriesServiceService, private writersService: WritersService) {
    this.source = new LocalDataSource(this.stories); // create the source
    this.subscription = this.storiesService.getMessage().subscribe(message => {
      console.log("Message recieved by Admin Component: ", message);
      this.message = message;
      this.stories = this.storiesService.getStoriesVariable();
      for (let i=0; i<this.stories.length; i++) {
        this.stories[i].likes = this.stories[i].likes.length;
      }
    });
  }

  ngOnInit() {
    console.log("Stories read: ", this.storiesService.getStoriesVariable());
    let self = this;
      function callback(stories) {
        self.stories = stories;
        for (let i=0; i<self.stories.length; i++) {
          self.stories[i].likes = self.stories[i].likes.length;
        }
        self.source.load(self.stories);
        self.source.refresh();
        console.log("Stories: ", self.stories);
      }
      if (this.storiesService.getStoriesVariable() == null) {
        this.storiesService.getStoriesVariableViaCallback(callback);
      } else {
        this.stories = this.storiesService.getStoriesVariable();
        for (let i=0; i<this.stories.length; i++) {
          this.stories[i].likes = this.stories[i].likes.length;
        }
        self.source.load(this.stories);
        self.source.refresh();
        console.log("Stories: ", this.stories);
      }
  }

  rowSelect(event) {
    console.log("Row clicked: ", event);
  }

  editRow(event) {
    // console.log("Editing row: ", event);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth.getJwtToken()
      })
    };
    return this.http.post<myData>(this.serverUrl.concat("/stories/update/", event.newData._id), {
      authors: event.newData.authors.join(),
      text: event.newData.text,
      title: event.newData.title
    }, httpOptions).subscribe(data => {
      if (data.success) {
        event.confirm.resolve(event.newData);
        // this.storiesService.getStories();
        this.storiesService.sendMessage('Edited Story from Admin Component!');
        this.writersService.sendMessage('Edited Story from Admin Component!');
      } else {
        event.confirm.reject();
      }
    });
  }

  deleteRow(event) {
    // console.log("Deleting row: ", event);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth.getJwtToken()
      })
    };
    return this.http.get<myData>(this.serverUrl.concat("/stories/delete/", event.data._id), httpOptions).subscribe(data => {
      if (data.success) {
        event.confirm.resolve();
        // this.storiesService.getStories();
        this.storiesService.sendMessage('Deleted Story from Admin Component!');
        this.writersService.sendMessage('Deleted Story from Admin Component!');
      } else {
        event.confirm.reject();
      }
    });
  }

  ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

}