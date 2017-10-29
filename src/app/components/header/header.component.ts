import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../providers/auth/auth.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private loggedIn: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    //check if user logged in
    this.authService.isLoggedIn().subscribe((data) => {
      this.loggedIn = data;
    });

  }

  myProfile() {

  }

  signOut() {
    this.authService.signout();
  }

}
