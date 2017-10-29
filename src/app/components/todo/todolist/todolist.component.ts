import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Todo } from "../../../models/todo";
import { TodoService } from "../../../providers/todo/todo.service";
import { LoaderService } from "../../../providers/loader/loader.service";
import { AlertService } from "../../../providers/alert/alert.service";

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  todos : Todo[];
  loader: boolean;
  addNewTodoField: boolean = false;
  constructor(private todoService: TodoService, private loaderService: LoaderService, private alertService: AlertService) {
    //init loader status
    this.loaderService.getLoader().subscribe(loaderData => this.loader = loaderData);

    this.getTodos();
   }

  ngOnInit() {
  }

  getTodos() {
    this.loaderService.showLoader();
    this.todoService.getTodosList().subscribe((data) => {
      if(data) {
        this.todos = data;
        this.loaderService.hideLoader();
      }
    });
  }


  toogleStatus(todo:Todo) {
    if(todo) {
      this.todoService.toggleStatus(todo);
    }
  }

  deleteTodo(todo:Todo) {
    this.loaderService.showLoader();
    this.todoService.deleteTodo(todo).subscribe((message) => {
      if(message) {
        this.alertService.error(message, false);
        this.loaderService.hideLoader();
      }
    });
  }

}
