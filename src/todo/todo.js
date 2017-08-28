import {PouchDBTodoPromiseService} from '../services/pouchdb-todo-promise-service';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class Todo {
  todo;
  constructor(router) {
    this.router = router;
    this.appName = 'Todo List';
    this.self = this;
    this.todoService = new PouchDBTodoPromiseService();
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    return this.todoService.getTodoById(params.id).then(todo => {
      this.todo = todo;
      this.previousTitle = this.todo.title;
      this.todo.editMode = true;
      this.routeConfig.navModel.setTitle(todo.title);
      this.todoBeforeEdit = JSON.parse(JSON.stringify(this.todo));
    });
  }

  backToList() {
    this.router.navigate(this.router.generate('todos'));
  }
  update() {
    if (this.todo.editMode) {
      this.todo.editMode = false;
      this.todoService.updateTodoById(this.todo.id, this.todo).then(updatedTodo => {
        Object.assign(this.todo, updatedTodo);
      });
    } else {
      this.previousTitle = this.todo.title;
      this.todo.editMode = true;
      return this.todo;
    }
  }

  remove() {
    this.todoService.deleteTodoById(this.todo.id).then(deletedTodo => {
      console.log(deletedTodo);
    }).catch(error => {
      console.log('ERROR: ' + error);
    });
  }

  cancel() {
    this.todo.title = this.previousTitle;
    this.todo.editMode = false;
  }

  canDeactivate() {
    if (JSON.stringify(this.todoBeforeEdit) !== JSON.stringify(this.todo)) {
      return confirm('You have modified the Todo item. Are you sure you want to navigate away?');
    }
  }
}
