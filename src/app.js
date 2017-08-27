import {Todo} from './models/todo';
import {InMemoryTodoService} from './services/inmemory-todo-service';

export class App {
  constructor() {
    this.appName = 'Todo List';
    this.todoTitle = '';
    this.todoService = new InMemoryTodoService();
    this.activeFilter = 'all';
    this.filterTodos(this.activeFilter);
  }
  addTodo() {
    this.todoService.addTodo(new Todo(this.todoTitle,false));
    this.todoTitle = '';
    this.todos = this.todoService.filterTodos(this.activeFilter);
  }

  removeTodo(todo){
    this.todoService.deleteTodoById(todo.id);
    this.todos = this.todoService.filterTodos(this.activeFilter);
  }
  filterTodos(filterCriteria){
    this.activeFilter = filterCriteria;
    console.log(filterCriteria);
    this.todos = this.todoService.filterTodos(this.activeFilter);
  }

  getTodosCount(filter){
    return this.todoService.filterTodos(filter).length;
  }

  get  allTodosCount(){
    console.log("what is length of allTodosCount "+this.getTodosCount('all'));
    return this.getTodosCount('all');
  }

  get completedTodoCount(){
    console.log("what is length of completedTodoCount "+this.getTodosCount('completed'));
    return this.getTodosCount('completed');
  }

  get activeTodosCount(){
    return this.getTodosCount('active');
  }

  updateTodo(todo){
    if(todo.editMode){
        todo.editMode = false;
        this.todoService.updateTodoById(todo.id,todo);
    } else {
      todo.editMode = true;
    }
  }

  //wrapper methods
  checkIfAllTodosAreCompleted(){
    return this.todos.every(todo => todo.completed);
  }

  toggleAllTodos(){
    this.todoService.toggleAllTodos();
    this.filterTodos(this.activeFilter);
  }

  completeAllTodos(){
    this.todoService.completeAllTodos();
    this.checkIfAllTodosAreCompleted();
  }
  
  removeAllTodos(){
    this.todoService.removeAllTodos();
    this.checkIfAllTodosAreCompleted();
  }

  removeCompletedTodos(){
    this.todoService.removeCompletedTodos();
    this.checkIfAllTodosAreCompleted();
  }

}
