import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../providers/auth/auth.service";
import { User } from "../../models/user";
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  private currentUser : User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  testCurrentUser() {
    let userId = "0RHWOSINzWPQ6eS44f3zdUcIXtw2";
    this.authService.currentUser(userId).subscribe(
      (data) => {
        if(data) {
          this.currentUser = data;
        }
    });
  }

}
