import { Injectable } from '@angular/core';
import { Todo } from "../../models/todo";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { User } from "../../models/user";
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TodoService {

  private itemsCollection: AngularFirestoreCollection<Todo>;
  private todosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(null);
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private userObjectSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  public message$: Observable<any> = this.messageSubject.asObservable();
  public todo$: Observable<Todo[]> = this.todosSubject.asObservable();

  constructor(private afs: AngularFirestore, private authService: AuthService) {

    //init todolist
    this.itemsCollection = afs.collection<Todo>('todos', ref => ref.orderBy('rangOrder'));
    this.itemsCollection.valueChanges().subscribe((data) => {
      this.todosSubject.next(data);
    });
  }

  getTodosList(): Observable<Todo[]> {
    return this.todo$;
  }

  addTodo(todo: Todo): Observable<string> {
    let message: string;
    if (todo) {

      //get userinfo
      let userInfo = this.authService.getUserInfo();

      if (userInfo) {
        let autoId = this.afs.createId()
        let dateNow = moment(Date.now()).format('DD-MM-YYYY');
         //create new obj for firebase push
         let newTodo: Todo = {
          content: todo.content,
          createdBy: userInfo.displayName,
          date: dateNow,
          status: false,
          id: autoId,
          rangOrder: 0
        };
        //add to database
        this.afs.collection('todos').doc(autoId).set(newTodo)
          .then(() => {
              this.messageSubject.next("Din todo er tilføjet");
          })
          .catch((error) => {
            if(error) {
              return this.messageSubject.next("En fejl opstod og din todo er ikke tilføjet");
            }
          });
      }
    }
    return this.message$;
  }

  deleteTodo(todo: Todo): Observable<string> {
    if (todo) {
      this.afs.collection('todos').doc(todo.id).delete()
        .then(() => {
          this.messageSubject.next("Din todo er slettet");
        })
        .catch((error) => {
          this.messageSubject.next("En fejl opstod og din todo er ikke slettet");
        });
    }
    return this.message$;
  }

  moveTodoRankOrder(todo: Todo, move: string) {
    if(move === "up") {
      //get upper todo from FB

    }
    if(move === "down") {

    }
  }

  toggleStatus(todo: Todo) {
    if (todo.status) {
      this.afs.collection('todos').doc(todo.id).set({
        content: todo.content,
        createdBy: todo.createdBy,
        date: todo.date,
        id: todo.id,
        status: false,
        rangOrder: todo.rangOrder
      });
      return;
    }
    else {
      this.afs.collection('todos').doc(todo.id).set({
        content: todo.content,
        createdBy: todo.createdBy,
        date: todo.date,
        id: todo.id,
        status: true,
        rangOrder: todo.rangOrder
      });
      return;
    }
  }

}
