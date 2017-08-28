export class InMemoryTodoService {
    todos = [];
  
    constructor() { }
  
    getAllTodos() {
      return this.todos;
    }
  
    getTodoById(id) {
      return this.todos.filter(todo => todo.id === id).pop();
    }
  
    addTodo(todo) {
      this.todos.push(todo);
      return this;
    }
  
    deleteTodoById(id) {
      this.todos = this.todos.filter(todo => todo.id !== id);
      return this;
    }
  
    updateTodoById(id, values = {}) {
      let todo = this.getTodoById(id);
      if (!todo) {
        return null;
      }
      Object.assign(todo, values);
      return todo;
    }
  
    filterTodos(filterCriteria) {
      switch (filterCriteria) {
      case 'active':
        return this.todos.filter((t) => !t.completed);
      case 'completed':
        return this.todos.filter((t) => t.completed);
      case 'all':
      default:
        return this.todos;
      }
    }
  
    toggleAllTodos() {
      this.todos.forEach((t) => t.completed = !t.completed);
    }
  
    completeAllTodos() {
      this.todos.forEach((t) => t.completed = true);
    }
  
    removeAllTodos() {
      this.todos.splice(0);
    }
  
    removeCompletedTodos() {
      this.todos = this.todos.filter((todo) => !todo.completed);
    }
  }
  
  