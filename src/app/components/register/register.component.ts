import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ISubscription } from "rxjs/Subscription";
import { AuthService } from "../../providers/auth/auth.service";
import { LoaderService } from "../../providers/loader/loader.service";
import { User } from "../../models/user";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private loaderSubscription : ISubscription;

  signupForm: FormGroup;
  errorMessage : string;
  loader: boolean;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private loaderService: LoaderService) { }

  ngOnInit() {

    //Connecting loader
    this.loaderService.getLoader().subscribe(loaderData => this.loader = loaderData);

    this.createSignupForm();
  }

  createSignupForm() {
    //Validator login form model
    this.signupForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      displayName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  signup({value, valid} : {value: User, valid: boolean}) {
    //Starts the loader
    this.loaderService.showLoader();
    this.authService.register(value.email, value.password, value.displayName)
      .then((cb) => {
        if (cb != undefined) {
          if (cb.code === "auth/invalid-email" || cb.code === "auth/email-already-in-use" || cb.code === "auth/wrong-password" || cb.code === "auth/user-not-found") {
            this.errorMessage = cb.message;
          }
        }else {
          this.loaderService.hideLoader();
          this.errorMessage == "";
          this.router.navigateByUrl("/login");
        }
      });
  }

  //Clean up the subscriptions
  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
  }

}
