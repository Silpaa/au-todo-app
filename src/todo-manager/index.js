import {inject, Aurelia} from 'aurelia-framework';
import {Todo} from '../models/todo';
import {PouchDBTodoPromiseService} from '../services/pouchdb-todo-promise-service';

@inject(Aurelia)
export class Index {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', ':filter'], name: 'todos-filter', moduleId: 'todo-manager/no-selection'},
      { route: 'detail/:id', name: 'todos-detail-id', moduleId: 'todo-manager/detail'}
    ]);

    this.router = router;
  }

  constructor() {
    this.appName = 'Todo List';
    this.self = this;
    this.todoTitle = '';
    this.previousTitle = '';
    this.todoCompleted = false;
    this.activeFilter = 'all';
    this.todoService = new PouchDBTodoPromiseService();
    this.filterTodos(this.activeFilter);
  }

  activate(params) {
    this.activeFilter = (params.filter) ? params.filter : 'all';
    this.filterTodos(this.activeFilter);
  }

  get allTodosCount() {
    return this.todoService.allTodosCount;
  }

  get activeTodosCount() {
    return this.todoService.activeTodosCount;
  }

  get completedTodosCount() {
    return this.todoService.completedTodosCount;
  }

  filterTodos(filterCriteria) {
    this.activeFilter = filterCriteria;
    this.todoService.filterTodos(this.activeFilter).then(todos => {
      this.todos = todos;
    });
  }

  addTodo(todo) {
    this.todoService.addTodo(new Todo(todo.title, todo.completed)).then(addedTodo => {
      this.todoTitle = '';
      console.log(addedTodo);
      this.todoService.filterTodos(this.activeFilter).then(todos => {
        this.todos = todos;
      });
    });
  }

  removeTodo(todo) {
    this.todoService.deleteTodoById(todo.id).then(deletedTodo => {
      console.log(deletedTodo);
      this.todoService.filterTodos(this.activeFilter).then(todos => {
        this.todos = todos;
      });
    }).catch(error => {
      console.log('ERROR: ' + error);
    });
  }

  updateTodo(todo) {
    if (todo.editMode) {
      todo.editMode = false;
      this.todoService.updateTodoById(todo.id, todo);
    } else {
      this.previousTitle = todo.title;
      todo.editMode = true;
    }
  }

  cancelEditTodo(todo) {
    todo.title = this.previousTitle;
    todo.editMode = false;
  }

  checkIfAllTodosAreCompleted() {
    return this.todos.every(todo => todo.completed);
  }

  toggleAllTodos() {
    this.todoService.toggleAllTodos().then(result => {
      if (result) {
        this.filterTodos(this.activeFilter);
      }
    });
  }

  completeAllTodos() {
    this.todoService.completeAllTodos().then(result => {
      if (result) {
        this.checkIfAllTodosAreCompleted();
        this.filterTodos(this.activeFilter);
      }
    });
  }

  removeAllTodos() {
    this.todoService.removeAllTodos().then(result => {
      if (result) {
        this.filterTodos(this.activeFilter);
      }
    });
  }

  removeCompletedTodos() {
    this.todoService.removeCompletedTodos().then(result => {
      if (result) {
        this.filterTodos(this.activeFilter);
      }
    });
  }
}
