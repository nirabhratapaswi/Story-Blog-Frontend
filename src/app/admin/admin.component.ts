import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { StoriesServiceService } from '../stories-service.service';
import { WritersService } from '../writers.service';
import { GenresService } from '../genres.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

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

	title: string = null;
	text: string = null;
	author: string;
  genre: string;
  author_message: string = null;
  author_warning: string = null;
  genre_message: string = null;
  genre_warning: string = null;
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
        field: 'creattexted_at',
        search: query
      }
    ], false); 
    // second parameter specifying whether to perform 'AND' or 'OR' search 
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }

  constructor(private http: HttpClient, private auth: AuthService, public storiesService: StoriesServiceService, private writersService: WritersService, private genresService: GenresService, public dialog: MatDialog) {
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

  openDialog(data: any, callback) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = (window.innerHeight*0.9).toString() + "px";
    dialogConfig.width = (window.innerWidth*0.9).toString() + "px";

    dialogConfig.data = data;

    const dialogRef = this.dialog.open(AppAdminEditDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(updated_story => {
      console.log(`Dialog result:`, updated_story);
      callback(updated_story);
    });
  }

  ngOnInit() {
    this.author_warning = null;
    this.author_message = null;
    this.genre_warning = null;
    this.genre_message = null;
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

    let self = this;
    function callback(updated_story: any) {
      self.storiesService.updateStory(event.data._id, updated_story.title, updated_story.text).subscribe(resp => {
        if (!resp.success) {
          return;
        }

        console.log("Story updated .. from admin !!");
      });
    }

    this.openDialog(event.data, callback);
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

  getTitle() {
    console.log("Requesting title: ", this.title);
    return this.title;
  }

  addAuthor() {
    this.writersService.addWriter(this.author).subscribe(resp => {
      if (resp.success) {
        this.author_message = resp.msg.toString();
        this.author_warning = null;
        this.storiesService.sendMessage('Added Writer from Admin Component!');
        this.writersService.sendMessage('Added Writer from Admin Component!');
      } else {
        this.author_warning = resp.msg.toString();
        this.author_message = null;
      }
    });
  }

  addGenre() {
    this.genresService.addGenre(this.genre).subscribe(resp => {
      if (resp.success) {
        this.genre_message = resp.msg.toString();
        this.genre_warning = null;
        this.storiesService.sendMessage('Added Genre from Admin Component!');
        this.writersService.sendMessage('Added Genre from Admin Component!');
      } else {
        this.genre_warning = resp.msg.toString();
        this.genre_message = null;
      }
    });
  }

}

@Component({
  selector: 'app-admin-edit-dialog',
  templateUrl: './admin.edit.component.html',
  styleUrls: ['./admin.component.edit.css']
})
export class AppAdminEditDialog implements OnInit {

  data: any = null;

  constructor(private dialogRef: MatDialogRef<AppAdminEditDialog>, @Inject(MAT_DIALOG_DATA) data) {
    this.data = data;
  }

  ngOnInit() {
    console.log("Oninit data: ", this.data);
  }

  save() {
    this.dialogRef.close(this.data);
  }

  close() {
    this.dialogRef.close();
  }
}
