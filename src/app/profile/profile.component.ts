import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';

interface myData {
  success: boolean,
  msg: String,
  data: String,
  jwt: string,
  accessLevel: String,
  admin: Boolean,
  username: String,
  name: String,
  likedStories: Array<any>
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  stories: Array<any> = [];
  serverUrl = environment.baseUrl.concat(":", environment.port.toString());
  user: any = {
    name: String,
    username: String,
    id: String
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    this.user = {
      name: "",
      username: "",
      id: ""
    };
  }

  ngOnInit() {
  	if (!this.auth.getJwtToken()) {
    	return;
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.auth.getJwtToken()
      })
    };
    let userDetails = this.auth.getUserData();
    console.log("User Details: ", userDetails);
    this.http.get<myData>(this.serverUrl.concat("/users/getOne/", userDetails.id), httpOptions).subscribe(data => {
  		console.log("Data from server: ", data);
  		if (data.success) {
  			//
  		}
  		this.stories = data.likedStories;
  	});

    this.user = this.auth.getUserData();
  }

}
