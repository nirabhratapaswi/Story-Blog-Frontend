import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoriesServiceService } from '../stories-service.service';
import { WritersService } from '../writers.service';
import { GenresService } from '../genres.service';
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
  genre_tags: string;
  available_authors: Array<String> = null;
  available_genres: Array<String> = null;
  serverUrl = environment.baseUrl.concat(":", environment.port.toString());

  constructor(private http: HttpClient, private auth: AuthService, private storiesService: StoriesServiceService, private writersService: WritersService, private genresService: GenresService) {
  	console.log("Upload component initialized...");
    this.getAvailableWriters();
    this.getAvailableGenres();
  }

  ngOnInit() {
    this.available_authors = this.writersService.getAvailableWriterVariable();
    if (this.available_authors == null) {
      this.getAvailableWriters();
    }
    this.available_genres = this.genresService.getAvailableGenreVariable();
    if (this.available_genres == null) {
      this.getAvailableGenres();
    }
  	console.log("Upload component called...");
  }

  uploadStory(event) {
  	event.preventDefault();
  	console.log("title: ", this.title, ", text: ", this.text, ", author: ", this.author, ", genre_tags:", this.genre_tags);
  	let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth.getJwtToken()
      })
    };
  	return this.http.post<myData>(this.serverUrl.concat("/stories/upload"), {
  		title: this.title,
  		text: this.text,
  		authors: this.author,
      genre_tags: this.genre_tags
  	}, httpOptions).subscribe(data => {
  		console.log("Data from server: ", data);
      if (data.success) {
        this.title = null;
        this.text = null;
        this.author = null;
        this.genre_tags = null;
        this.available_authors = this.writersService.getAvailableWriterVariable();
        this.available_genres = this.genresService.getAvailableGenreVariable();
        console.log("Abailable Authors: ", this.available_authors, ", available genres:", this.available_genres);
        this.storiesService.sendMessage('Uploaded Story from Upload Component!');
        this.writersService.sendMessage('Uploaded Story from Upload Component!');
      }
  	});
  }

  getAvailableWriters() {
    let self = this;
    function callback(writers) {
      self.available_authors = writers;
    }
    this.writersService.getAvailableWritersVariableViaCallback(callback);
  }

  getAvailableGenres() {
    let self = this;
    function callback(genres) {
      self.available_genres = genres;
    }
    this.genresService.getAvailableGenresVariableViaCallback(callback);
  }

  addWriter(writer: string) {
    console.log("Adding writer");
    if (this.author == null || this.author == "") {
      this.author = writer;
    } else {
      this.author = this.author.concat(", ", writer);
    }
    console.log("Before Slicing Writer:", this.writersService.getAvailableWriterVariable());
    this.available_authors = this.available_authors.slice(0, this.available_authors.indexOf(writer)).concat(this.available_authors.slice(this.available_authors.indexOf(writer) + 1, this.available_authors.length));
    console.log("After Slicing Writer:", this.writersService.getAvailableWriterVariable());
  }

  addGenre(genre: string) {
    console.log("Adding genre");
    if (this.genre_tags == null || this.genre_tags == "") {
      this.genre_tags = genre;
    } else {
      this.genre_tags = this.genre_tags.concat(", ", genre);
    }
    console.log("Before Slicing Genre:", this.genresService.getAvailableGenreVariable());
    this.available_genres = this.available_genres.slice(0, this.available_genres.indexOf(genre)).concat(this.available_genres.slice(this.available_genres.indexOf(genre) + 1, this.available_genres.length));
    console.log("After Slicing Genre:", this.genresService.getAvailableGenreVariable());
  }

}
