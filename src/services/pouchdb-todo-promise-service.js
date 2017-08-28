export class PouchDBTodoPromiseService {
    constructor() {
      this.db = new PouchDB('todos-db', {adapter: 'websql'});
      this.todos = [];
      this.latency = 100;
      this.isRequesting = false;
      this.completedTodosCount = 0;
      this.allTodosCount = 0;
      this.activeTodosCount = 0;
    }
  
    getAllTodos() {
      this.isRequesting = true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.db.allDocs({
            include_docs: true
          }).then(result => {
            this.todos = [];
            result.rows.forEach(todo => {
              this.todos.push(todo.doc);
            });
            this.allTodosCount = result.rows.length;
            this.activeTodosCount = this.todos.filter((t) => !t.completed).length;
            this.completedTodosCount = this.todos.filter((t) => t.completed).length;
            resolve(true);
            this.isRequesting = false;
          }).catch(err => {
            console.log(err);
            reject(err);
          });
        }, this.latency);
      });
    }
  
    getTodoById(id) {
      this.isRequesting = true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.db.get(id).then( found => {
            resolve(JSON.parse(JSON.stringify(found)));
            this.isRequesting = false;
          }).catch(err => {
            console.log(err);
            reject(err);
          });
        }, this.latency);
      });
    }
  
    addTodo(todo) {
      this.isRequesting = true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          todo.id = (this.todos.length > 0) ? this.todos[this.todos.length - 1].id + 1 : 1;
          //console.log(this.todos[this.todos.length - 1].id);
          console.log('Next Id: ' + todo.id);
          todo['_id'] = todo.id.toString();
          let instance = JSON.parse(JSON.stringify(todo));
          this.db.put(instance).then(response => {
            this.isRequesting = false;
            resolve(instance);
          }).catch(err => {
            console.log(err);
            reject(err);
          });
        }, this.latency);
      });
    }
  
    deleteTodoById(id) {
      this.isRequesting = true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.db.get(id.toString()).then( deletedTodo => {
            // throw new Error('Simulating an error');
            return this.db.remove(deletedTodo);
          }).then(deletedTodo => {
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
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.db.get(id.toString()).then( updatedTodo => {
            Object.assign(updatedTodo, values);
            return this.db.put(updatedTodo);
          }).then(response => {
            this.isRequesting = false;
            this.db.get(id.toString()).then( updatedTodo => {
              resolve(updatedTodo);
            });
          }).catch(ex => {
            reject(ex);
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
  
    filterTodos(filterCriteria) {
      return this.getAllTodos().then(result => {
        console.log(result);
        //return this.filterTodos(filterCriteria);
        return new Promise((resolve) => {
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
            break;
          }
        });
      });
    }
  
    toggleAllTodos() {
      this.isRequesting = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          this.todos.forEach((t) => t.completed = !t.completed);
          this.db.bulkDocs(this.todos).then(result => {
            resolve(true);
            this.isRequesting = false;
          }).catch(err => {
            reject(err);
          });
        }, this.latency);
      });
    }
  
    completeAllTodos() {
      this.isRequesting = true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.todos.forEach((t) => t.completed = true);
          this.db.bulkDocs(this.todos).then(result => {
            resolve(true);
            this.isRequesting = false;
          }).catch(err => {
            reject(err);
          });
        }, this.latency);
      });
    }
  
    removeAllTodos() {
      this.isRequesting = true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.db.allDocs().then(result => {
            return Promise.all(result.rows.map(row => {
              return this.db.remove(row.id, row.value.rev);
            }));
          }).then(() => {
            this.todos.splice(0);
            resolve(true);
            this.isRequesting = false;
          }).catch(err => {
            reject(err);
          });
        }, this.latency);
      });
    }
  
    removeCompletedTodos() {
      this.isRequesting = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          this.tobeDeletedTodos = this.todos.filter((todo) => todo.completed);
          this.tobeDeletedTodos.forEach(t => t._deleted = true);
          this.db.bulkDocs(this.tobeDeletedTodos).then(result => {
            this.todos = this.todos.filter((todo) => !todo.completed);
            resolve(true);
            this.isRequesting = false;
          }).catch(err => {
            reject(err);
          });
        }, this.latency);
      });
    }
  }  