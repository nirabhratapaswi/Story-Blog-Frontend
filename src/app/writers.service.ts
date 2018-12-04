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

@Injectable({
  providedIn: 'root'
})
export class WritersService {

	writers: Array<any> = null;
	private subject = new Subject<any>();
  serverUrl = environment.baseUrl.concat(":", environment.port.toString());
	message: any;
    subscription: Subscription;
    selfMessage: String = "Personal Message for writersService.";

  	constructor(private http: HttpClient, private auth: AuthService) {
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

  getWriters() {
		console.log();
	  	return this.http.get<writersData[]>(this.serverUrl.concat("/writers"), {}).subscribe(data => {
	  		console.log("Writers Data from server: ", data);
	  		this.writers = data;
	  		this.sendMessage(this.selfMessage);
	  	});
  }

  getOneWriter(writer_id: string) {
    return this.http.get<writersData[]>(this.serverUrl.concat("/writers/getOne/").concat(writer_id), {});
  }

  getWritersVariable() {
  	return this.writers;
  }

  getWritersVariableViaCallback(callback) {
  	return this.http.get<writersData[]>(this.serverUrl.concat("/writers"), {}).subscribe(data => {
	  		console.log("Data from server: ", data);
	  		callback(data);
	  	});
  }
}
