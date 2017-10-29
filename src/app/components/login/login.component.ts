import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../providers/auth/auth.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from "../../providers/loader/loader.service";
import { User } from "../../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private isLoggedIn : boolean;
  loginForm: FormGroup;
  message: string;
  loader : boolean;
  constructor(private authService: AuthService, private loaderService: LoaderService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {

    //Connecting loader
    this.loaderService.getLoader().subscribe(loaderData => this.loader = loaderData);

    //if logged in redirect
    this.authService.isLoggedIn().subscribe((isLoggedIn => {
      if(isLoggedIn) {
        this.router.navigate(['/todolist']);
      }
    }));

    //init validation form
    this.createLoginForm();
  }

  createLoginForm() {
    //Validator login form model
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  login({value, valid} : { value : User, valid: boolean }) {
    //Starts the loader
    this.loaderService.showLoader();
    this.authService.login(value.email, value.password)
      .then((data) => {
        this.message = data;
        this.loaderService.hideLoader();
      })
      .catch((error) => this.message = error);
  }

}
