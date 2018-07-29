import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

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

  constructor(private http: HttpClient, private auth: AuthService) {}

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
    return this.http.get<myData>("http://localhost:3000/users/getOne/".concat(userDetails.id), httpOptions).subscribe(data => {
		console.log("Data from server: ", data);
		if (data.success) {
			//
		}
		this.stories = data.likedStories;
	});
  }

}
