import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {MomentModule} from 'angular2-moment';

//COMPONENTS
import { AppComponent } from './app.component';
import { TodolistComponent } from './components/todo/todolist/todolist.component';
import { AddTodoComponent } from './components/todo/add-todo/add-todo.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AlertComponent } from './components/alert/alert.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ShoplistComponent } from './components/shop/shoplist/shoplist.component';
import { AddshopitemComponent } from './components/shop/addshopitem/addshopitem.component';


//SERVICES
import { AlertService } from "./providers/alert/alert.service";
import { AuthService } from "./providers/auth/auth.service";
import { LoaderService } from "./providers/loader/loader.service";
import { ShopService } from "./providers/shop/shop.service";
import { TodoService } from "./providers/todo/todo.service";
import { TabMenuComponent } from './components/tab-menu/tab-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { TestComponent } from './components/test/test.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

//GUARDS
import { AuthGuard } from "./guards/auth.guard";

//ROUTES
const appRoutes: Routes = [
  { path: 'todolist',  component: TodolistComponent, canActivate: [AuthGuard]  },
  { path: 'shoplist',  component: ShoplistComponent, canActivate: [AuthGuard]  },
  { path: 'test',  component: TestComponent, canActivate: [AuthGuard] },
  { path: 'login',  component: LoginComponent },
  { path: 'register',  component: RegisterComponent },
  { path: '',
    redirectTo: '/todolist',
    pathMatch: 'full'
  },
  { path: '**', component: PagenotfoundComponent }
];


//FIREBASE
export const firebaseConfig = {
  apiKey: "AIzaSyCX4p29_KcPH8VI2lfaDB02a2Dpx1lELUY",
  authDomain: "todofirestoreapp.firebaseapp.com",
  databaseURL: "https://todofirestoreapp.firebaseio.com",
  projectId: "todofirestoreapp",
  storageBucket: "todofirestoreapp.appspot.com",
  messagingSenderId: "479746200700"
};

@NgModule({
  declarations: [
    AppComponent,
    TodolistComponent,
    AddTodoComponent,
    LoaderComponent,
    AlertComponent,
    PagenotfoundComponent,
    ShoplistComponent,
    AddshopitemComponent,
    TabMenuComponent,
    HeaderComponent,
    TestComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MomentModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }) // <-- debugging purposes only


  ],
  providers: [AlertService, AuthService, LoaderService, ShopService, TodoService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
