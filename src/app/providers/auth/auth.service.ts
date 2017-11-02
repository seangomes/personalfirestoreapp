import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from "../../models/user";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from "@angular/router";

@Injectable()
export class AuthService {

  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(null);
  public authStateSubject = new BehaviorSubject<any>(null);


  public currentUser$ = this.userSubject.asObservable();
  constructor(private router: Router, private afs: AngularFirestore, private afAuth: AngularFireAuth) {

    //check if loggedin
    let userLocalStorage = localStorage.getItem('currentUser');

    if(userLocalStorage) {
      //Extra check for loggedIn
      this.afAuth.authState.subscribe((user) => {
        if(user) {
          this.isLoggedInSubject.next(true);
          this.currentUser(user.uid).subscribe();
        }
      });

    }else {
      this.router.navigateByUrl('/login');
    }

   }


  //Check if user loggedIn
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setIsLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  getAuthState() : Observable<any> {
    return this.authStateSubject.asObservable();
  }

  getUserInfo() : User {
    return this.userSubject.getValue();
  }

  //Email + password login
  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        //Signed in
        this.isLoggedInSubject.next(true);
        //Get firebase user
        //console.log("login user data: ", user.uid);
        localStorage.setItem('currentUser', JSON.stringify(user.uid));
        //Get user from FB db
        this.currentUser(user.uid).subscribe(userData => {
          this.userSubject.next(userData);
          this.router.navigateByUrl('/todolist');
        });
      })
      .catch((error) => {
        return error;
      })
  }

  register(email: string, password: string, displayName: string) {
    if (email !== null && password !== null) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {

          if (user !== null) {
            user.updateProfile({ displayName: displayName })
              .then((data) => {
                //CreateFireStore User
                this.afs.collection('users').doc(user.uid).set({
                  displayName: displayName,
                  email: email,
                  photoURL: 'https://www.fancyhands.com/images/default-avatar-250x250.png',
                  userId: user.uid,
                  status: "offline"
                });
              })
          }
          //this.createNewUserObjInFirebase(user, username);
        })
        .catch((error) => {
          console.log("error: ", error);
          return error;
        })
    }
  }

  // Returns current logged in user data from FIRESTORE
  currentUser(userId: string): Observable<User> {
    let userDoc = this.afs.collection<User>('users/');
    userDoc.doc(userId).snapshotChanges().map(action => {
      const data = action.payload.data() as User;
      return data;
    }).subscribe((data) => {
      this.userSubject.next(data);
    });
    return this.currentUser$;
  }

  //Signout
  signout(): void {
    this.afAuth.auth.signOut();
    //resetting subjects
    this.isLoggedInSubject.next(false);
    this.userSubject.next(null);
    this.authStateSubject.next(null);
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    //Routing
    this.router.navigate(['/login']);
  }
}
