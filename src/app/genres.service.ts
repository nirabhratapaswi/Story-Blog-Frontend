import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';

interface genresData {
  success: boolean,
  name: String,
  created_at: Date,
  updated_at: Date
}

interface addGenre {
  success: boolean,
  msg: String,
  error: any
}

@Injectable({
  providedIn: 'root'
})
export class GenresService {

	genres: Array<any> = null;
	available_genres: Array<String> = null;
	private subject = new Subject<any>();
	serverUrl = environment.baseUrl.concat(":", environment.port.toString());
	message: any;
    subscription: Subscription;
    selfMessage: String = "Personal Message for genresService.";

  	constructor(private http: HttpClient, private authService: AuthService) {
  		console.log("Genres Service constructor called...");
  		this.getGenres();
  		this.subscription = this.getMessage().subscribe(message => {
  			console.log("Message recieved by genres-service: ", message);
  			this.message = message;
  			if (message.text == this.selfMessage || message.text == this.selfMessage.toString()) {
  				//
  			} else {
  				this.getGenres();
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

  addGenre(name: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type':  'application/json',
        'Authorization': this.authService.getJwtToken()
      })
    };
    return this.http.post<addGenre>(this.serverUrl.concat("/genres"), {
      name: name
    }, httpOptions);
  }

  getGenres() {
	return this.http.get<genresData[]>(this.serverUrl.concat("/genres"), {}).subscribe(data => {
		console.log("Genres Data from server: ", data);
		this.genres = data;
		this.sendMessage(this.selfMessage);
	});
  }

  getAvailableGenres() {
    console.log();
      return this.http.get<string>(this.serverUrl.concat("/genres/list"), {}).subscribe(data => {
        console.log("Available Genres Data from server: ", data);
        this.available_genres = JSON.parse(data);
        this.sendMessage(this.selfMessage);
      });
  }

  getGenresVariable() {
  	return this.genres;
  }

  getAvailableGenreVariable() {
    return this.available_genres;
  }

  getGenresVariableViaCallback(callback) {
  	return this.http.get<genresData[]>(this.serverUrl.concat("/genres"), {}).subscribe(data => {
		console.log("Data from server: ", data);
        this.genres = data;
	  		callback(this.genres);
	  	});
  }

  getAvailableGenresVariableViaCallback(callback) {
    return this.http.get<string>(this.serverUrl.concat("/genres/list"), {}).subscribe(data => {
        console.log("Data from server: ", data);
        this.available_genres = JSON.parse(data);
        callback(this.available_genres);
      });
  }
}
