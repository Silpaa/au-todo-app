export class InMemoryTodoPromiseService {
  constructor() {
    this.todos = [];
    this.latency = 100;
    this.isRequesting = false;
  }

  getAllTodos() {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.todos);
        this.isRequesting = false;
      }, this.latency);
    });
  }

  getTodoById(id) {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        let found = this.todos.filter(todo => todo.id === id).pop();
        resolve(JSON.parse(JSON.stringify(found)));
        this.isRequesting = false;
      }, this.latency);
    });
  }

  addTodo(todo) {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(todo));
        this.todos.push(todo);
        this.isRequesting = false;
        resolve(instance);
      }, this.latency);
    });
  }

  deleteTodoById(id) {
    this.isRequesting = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.getTodoById(id).then( deletedTodo => {
          // throw new Error('Simulating an error');
          this.todos = this.todos.filter(todo => todo.id !== id);
          this.isRequesting = false;
          resolve(deletedTodo);
        }).catch(ex => {
          reject(ex);
        });
      }, this.latency);
    });
  }

  updateTodoById(id, values = {}) {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.getTodoById(id).then( updatedTodo => {
          Object.assign(updatedTodo, values);
          this.isRequesting = false;
          resolve(updatedTodo);
        });
      }, this.latency);
    });
  }

  toggleTodoCompleted(todo) {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.updateTodoById(todo.id, { completed: !todo.completed }).then(
        updatedTodo => {
          this.isRequesting = false;
          resolve(updatedTodo);
        });
      }, this.latency);
    });
  }

  filterTodosSync(filterCriteria) {
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
  filterTodos(filterCriteria) {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (filterCriteria) {
        case 'active':
          resolve(this.todos.filter((t) => !t.completed));
          break;
        case 'completed':
          resolve(this.todos.filter((t) => t.completed));
          break;
        case 'all':
        default:
          resolve(this.todos);
        }
        this.isRequesting = false;
      }, this.latency);
    });
  }

  toggleAllTodos() {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.todos.forEach((t) => t.completed = !t.completed);
        resolve(true);
        this.isRequesting = false;
      }, this.latency);
    });
  }

  completeAllTodos() {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.todos.forEach((t) => t.completed = true);
        resolve(true);
        this.isRequesting = false;
      }, this.latency);
    });
  }

  removeAllTodos() {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.todos.splice(0);
        resolve(true);
        this.isRequesting = false;
      }, this.latency);
    });
  }

  removeCompletedTodos() {
    this.isRequesting = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.todos = this.todos.filter((todo) => !todo.completed);
        resolve(true);
        this.isRequesting = false;
      }, this.latency);
    });
  }
}
