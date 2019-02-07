import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';

interface writersData {
  success: boolean,
  name: String,
  stories: [any],
  created_at: Date,
  updated_at: Date
}

interface addWriter {
  success: boolean,
  msg: String,
  error: any
}

@Injectable({
  providedIn: 'root'
})
export class WritersService {

	writers: Array<any> = null;
  writers_chunk: Array<any> = null;
  available_writers: Array<String> = null;
	private subject = new Subject<any>();
  serverUrl = environment.baseUrl.concat(":", environment.port.toString());
	message: any;
  subscription: Subscription;
  selfMessage: String = "Personal Message for writersService.";

  constructor(private http: HttpClient, private authService: AuthService) {
  	console.log("Writers Service constructor called...");
  	this.getWriters();
  	this.subscription = this.getMessage().subscribe(message => {
  		console.log("Message recieved by writers-service: ", message);
  		this.message = message;
  		if (message.text == this.selfMessage || message.text == this.selfMessage.toString()) {
  			//
  		} else {
  			this.getWriters();
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

  addWriter(name: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type':  'application/json',
        'Authorization': this.authService.getJwtToken()
      })
    };
    return this.http.post<addWriter>(this.serverUrl.concat("/writers"), {
      name: name
    }, httpOptions);
  }

  getWriters() {
	  return this.http.get<writersData[]>(this.serverUrl.concat("/writers"), {}).subscribe(data => {
	  	console.log("Writers Data from server: ", data);
	  	this.writers = data;
	  	this.sendMessage(this.selfMessage);
	  });
  }

  getAvailableWriters() {
    console.log();
      return this.http.get<string>(this.serverUrl.concat("/writers/list"), {}).subscribe(data => {
        console.log("Available Writers Data from server: ", data);
        this.available_writers = JSON.parse(data);
        this.sendMessage(this.selfMessage);
      });
  }

  getOneWriter(writer_id: string) {
    return this.http.get<writersData[]>(this.serverUrl.concat("/writers/getOne/").concat(writer_id), {});
  }

  getWritersVariable() {
  	return this.writers;
  }

  getAvailableWriterVariable() {
    return this.available_writers;
  }

  getWritersVariableViaCallback(callback) {
  	return this.http.get<writersData[]>(this.serverUrl.concat("/writers"), {}).subscribe(data => {
	  		console.log("Data from server: ", data);
        this.writers = data;
	  		callback(this.writers);
	  	});
  }

  getAvailableWritersVariableViaCallback(callback) {
    return this.http.get<string>(this.serverUrl.concat("/writers/list"), {}).subscribe(data => {
        console.log("Data from server: ", data);
        this.available_writers = JSON.parse(data);
        callback(this.available_writers);
      });
  }

  getWritersVariableChunkViaCallback(offset: number, size: number, callback) {
    return this.http.get<writersData[]>(this.serverUrl.concat("/writers/chunk/", offset.toString(), "/", size.toString()), {}).subscribe(data => {
        this.writers_chunk = data;
        callback(this.writers_chunk);
      });
  }

  searchWriters(name: string, callback) {
    return this.http.get<writersData[]>(this.serverUrl.concat("/writers/search?name=", name), {}).subscribe(data => {
        this.writers = data;
        callback(data);
      });
  }

}
