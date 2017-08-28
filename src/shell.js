import {Todo} from './models/todo';
import {InMemoryTodoPromiseService} from './services/inmemory-todo-promise-service';

export class Shell {
  constructor() {
    this.appName = 'Todo List';
    this.self = this;
    this.todoTitle = '';
    this.todoCompleted = false;
    this.activeFilter = 'all';
    this.todoService = new InMemoryTodoPromiseService();
    this.filterTodos(this.activeFilter);
  }
  get allTodosCount() {
    return this.todoService.filterTodosSync('all').length;
  }

  get activeTodosCount() {
    return this.todoService.filterTodosSync('active').length;
  }

  get completedTodosCount() {
    return this.todoService.filterTodosSync('completed').length;
  }

  filterTodos(filterCriteria) {
    this.activeFilter = filterCriteria;
    this.todos = this.todoService.filterTodosSync(this.activeFilter);
  }

  addTodo(todo) {
    this.todoService.addTodo(new Todo(todo.title, todo.completed)).then(addedTodo => {
      this.todoTitle = '';
      todo.title = '';
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
      todo.editMode = true;
    }
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