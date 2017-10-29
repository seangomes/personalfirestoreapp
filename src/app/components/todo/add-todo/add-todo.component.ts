import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Todo } from "../../../models/todo";
import { TodoService } from "../../../providers/todo/todo.service";
import { LoaderService } from "../../../providers/loader/loader.service";
import { AlertService } from "../../../providers/alert/alert.service";
import { FormControl, FormBuilder, FormGroup,  Validators } from '@angular/forms';


@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {

  newTodoForm: FormGroup;
  loader: boolean;
  constructor(private todoService: TodoService, private loaderService: LoaderService, private alertService: AlertService, private fb: FormBuilder) { }

  ngOnInit() {
    this.addNewTodoForm();
    this.loaderService.getLoader().subscribe(loaderData => this.loader = loaderData);
  }

  addNewTodoForm() {
    //Validator login form model
    this.newTodoForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  addTodo({value, valid} : { value : Todo, valid: boolean }) {
    this.loaderService.showLoader();
    this.todoService.addTodo(value).subscribe((message) => {
      if(message) {
        this.alertService.success(message, false);
        this.newTodoForm.reset();
        this.loaderService.hideLoader();
      }
    });
  }

}
