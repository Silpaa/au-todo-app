define('app',['exports', './models/todo', './services/inmemory-todo-promise-service'], function (exports, _todo, _inmemoryTodoPromiseService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);

      this.appName = 'Todo List';
      this.todoTitle = '';
      this.activeFilter = 'all';
      this.todoService = new _inmemoryTodoPromiseService.InMemoryTodoPromiseService();
      this.filterTodos(this.activeFilter);
    }

    App.prototype.filterTodos = function filterTodos(filterCriteria) {
      this.activeFilter = filterCriteria;
      this.todos = this.todoService.filterTodosSync(this.activeFilter);
    };

    App.prototype.addTodo = function addTodo() {
      var _this = this;

      this.todoService.addTodo(new _todo.Todo(this.todoTitle, false)).then(function (addedTodo) {
        _this.todoTitle = '';
        console.log(addedTodo);
        _this.todoService.filterTodos(_this.activeFilter).then(function (todos) {
          _this.todos = todos;
        });
      });
    };

    App.prototype.removeTodo = function removeTodo(todo) {
      var _this2 = this;

      this.todoService.deleteTodoById(todo.id).then(function (deletedTodo) {
        console.log(deletedTodo);
        _this2.todoService.filterTodos(_this2.activeFilter).then(function (todos) {
          _this2.todos = todos;
        });
      }).catch(function (error) {
        console.log('ERROR: ' + error);
      });
    };

    App.prototype.updateTodo = function updateTodo(todo) {
      if (todo.editMode) {
        todo.editMode = false;
        this.todoService.updateTodoById(todo.id, todo).then(function (updatedTodo) {
          console.log(updatedTodo);
        });
      } else {
        todo.editMode = true;
      }
    };

    App.prototype.checkIfAllTodosAreCompleted = function checkIfAllTodosAreCompleted() {
      return this.todos.every(function (todo) {
        return todo.completed;
      });
    };

    App.prototype.toggleAllTodos = function toggleAllTodos() {
      var _this3 = this;

      this.todoService.toggleAllTodos().then(function (result) {
        if (result) {
          _this3.filterTodos(_this3.activeFilter);
        }
      });
    };

    App.prototype.completeAllTodos = function completeAllTodos() {
      var _this4 = this;

      this.todoService.completeAllTodos().then(function (result) {
        if (result) {
          _this4.checkIfAllTodosAreCompleted();
          _this4.filterTodos(_this4.activeFilter);
        }
      });
    };

    App.prototype.removeAllTodos = function removeAllTodos() {
      var _this5 = this;

      this.todoService.removeAllTodos().then(function (result) {
        if (result) {
          _this5.filterTodos(_this5.activeFilter);
        }
      });
    };

    App.prototype.removeCompletedTodos = function removeCompletedTodos() {
      var _this6 = this;

      this.todoService.removeCompletedTodos().then(function (result) {
        if (result) {
          _this6.filterTodos(_this6.activeFilter);
        }
      });
    };

    _createClass(App, [{
      key: 'allTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('all').length;
      }
    }, {
      key: 'activeTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('active').length;
      }
    }, {
      key: 'completedTodosCount',
      get: function get() {
        return this.todoService.filterTodosSync('completed').length;
      }
    }]);

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('models/todo',['exports', '../utilities/idgenerators'], function (exports, _idgenerators) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Todo = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Todo = exports.Todo = function Todo(title) {
        var completed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, Todo);

        this.id = _idgenerators.IdGenerator.getNextId();
        this.title = title;
        this.completed = completed;
    };
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/inmemory-todo-promise-service',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var InMemoryTodoPromiseService = exports.InMemoryTodoPromiseService = function () {
    function InMemoryTodoPromiseService() {
      _classCallCheck(this, InMemoryTodoPromiseService);

      this.todos = [];
      this.latency = 100;
      this.isRequesting = false;
    }

    InMemoryTodoPromiseService.prototype.getAllTodos = function getAllTodos() {
      var _this = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(_this.todos);
          _this.isRequesting = false;
        }, _this.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.getTodoById = function getTodoById(id) {
      var _this2 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var found = _this2.todos.filter(function (todo) {
            return todo.id === id;
          }).pop();
          resolve(JSON.parse(JSON.stringify(found)));
          _this2.isRequesting = false;
        }, _this2.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.addTodo = function addTodo(todo) {
      var _this3 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var instance = JSON.parse(JSON.stringify(todo));
          _this3.todos.push(todo);
          _this3.isRequesting = false;
          resolve(instance);
        }, _this3.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.deleteTodoById = function deleteTodoById(id) {
      var _this4 = this;

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          _this4.getTodoById(id).then(function (deletedTodo) {
            throw new Error('Simulating an error');
            _this4.todos = _this4.todos.filter(function (todo) {
              return todo.id !== id;
            });
            _this4.isRequesting = false;
            resolve(deletedTodo);
          }).catch(function (ex) {
            reject(ex);
          });
        }, _this4.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.updateTodoById = function updateTodoById(id) {
      var _this5 = this;

      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this5.getTodoById(id).then(function (updatedTodo) {
            Object.assign(updatedTodo, values);
            _this5.isRequesting = false;
            resolve(updatedTodo);
          });
        }, _this5.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.toggleTodoCompleted = function toggleTodoCompleted(todo) {
      var _this6 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this6.updateTodoById(todo.id, { completed: !todo.completed }).then(function (updatedTodo) {
            _this6.isRequesting = false;
            resolve(updatedTodo);
          });
        }, _this6.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.filterTodosSync = function filterTodosSync(filterCriteria) {
      switch (filterCriteria) {
        case 'active':
          return this.todos.filter(function (t) {
            return !t.completed;
          });
        case 'completed':
          return this.todos.filter(function (t) {
            return t.completed;
          });
        case 'all':
        default:
          return this.todos;
      }
    };

    InMemoryTodoPromiseService.prototype.filterTodos = function filterTodos(filterCriteria) {
      var _this7 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          switch (filterCriteria) {
            case 'active':
              resolve(_this7.todos.filter(function (t) {
                return !t.completed;
              }));
              break;
            case 'completed':
              resolve(_this7.todos.filter(function (t) {
                return t.completed;
              }));
              break;
            case 'all':
            default:
              resolve(_this7.todos);
          }
          _this7.isRequesting = false;
        }, _this7.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.toggleAllTodos = function toggleAllTodos() {
      var _this8 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this8.todos.forEach(function (t) {
            return t.completed = !t.completed;
          });
          resolve(true);
          _this8.isRequesting = false;
        }, _this8.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.completeAllTodos = function completeAllTodos() {
      var _this9 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this9.todos.forEach(function (t) {
            return t.completed = true;
          });
          resolve(true);
          _this9.isRequesting = false;
        }, _this9.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.removeAllTodos = function removeAllTodos() {
      var _this10 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this10.todos.splice(0);
          resolve(true);
          _this10.isRequesting = false;
        }, _this10.latency);
      });
    };

    InMemoryTodoPromiseService.prototype.removeCompletedTodos = function removeCompletedTodos() {
      var _this11 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this11.todos = _this11.todos.filter(function (todo) {
            return !todo.completed;
          });
          resolve(true);
          _this11.isRequesting = false;
        }, _this11.latency);
      });
    };

    return InMemoryTodoPromiseService;
  }();
});
define('services/inmemory-todo-service',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var InMemoryTodoService = exports.InMemoryTodoService = function () {
    function InMemoryTodoService() {
      _classCallCheck(this, InMemoryTodoService);

      this.todos = [];
    }

    InMemoryTodoService.prototype.getAllTodos = function getAllTodos() {
      return this.todos;
    };

    InMemoryTodoService.prototype.getTodoById = function getTodoById(id) {
      return this.todos.filter(function (todo) {
        return todo.id === id;
      }).pop();
    };

    InMemoryTodoService.prototype.addTodo = function addTodo(todo) {
      this.todos.push(todo);
      return this;
    };

    InMemoryTodoService.prototype.deleteTodoById = function deleteTodoById(id) {
      this.todos = this.todos.filter(function (todo) {
        return todo.id !== id;
      });
      return this;
    };

    InMemoryTodoService.prototype.updateTodoById = function updateTodoById(id) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var todo = this.getTodoById(id);
      if (!todo) {
        return null;
      }
      Object.assign(todo, values);
      return todo;
    };

    InMemoryTodoService.prototype.filterTodos = function filterTodos(filterCriteria) {
      switch (filterCriteria) {
        case 'active':
          return this.todos.filter(function (t) {
            return !t.completed;
          });
        case 'completed':
          return this.todos.filter(function (t) {
            return t.completed;
          });
        case 'all':
        default:
          return this.todos;
      }
    };

    InMemoryTodoService.prototype.toggleAllTodos = function toggleAllTodos() {
      this.todos.forEach(function (t) {
        return t.completed = !t.completed;
      });
    };

    InMemoryTodoService.prototype.completeAllTodos = function completeAllTodos() {
      this.todos.forEach(function (t) {
        return t.completed = true;
      });
    };

    InMemoryTodoService.prototype.removeAllTodos = function removeAllTodos() {
      this.todos.splice(0);
    };

    InMemoryTodoService.prototype.removeCompletedTodos = function removeCompletedTodos() {
      this.todos = this.todos.filter(function (todo) {
        return !todo.completed;
      });
    };

    return InMemoryTodoService;
  }();
});
define('utilities/idgenerators',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _IdGenerator = function () {
        function _IdGenerator() {
            _classCallCheck(this, _IdGenerator);

            this.id = 0;
        }

        _IdGenerator.prototype.getNextId = function getNextId() {
            return ++this.id;
        };

        return _IdGenerator;
    }();

    var IdGenerator = exports.IdGenerator = new _IdGenerator();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"../styles/styles.css\"></require><h1>${appName}</h1><form method=\"post\" submit.trigger=\"addTodo()\"><input type=\"text\" placeholder=\"What would you like to do?\" value.bind=\"todoTitle\"> <button type=\"submit\">Add</button></form><br><br><div><a href=\"#\" click.trigger=\"filterTodos('all')\">All</a> <a href=\"#\" click.trigger=\"filterTodos('active')\">Active</a> <a href=\"#\" click.trigger=\"filterTodos('completed')\">Completed</a></div><div><strong>${allTodosCount}</strong>${allTodosCount === 1 ? ' task ': ' tasks '} | <strong>${activeTodosCount}</strong>${activeTodosCount === 1 ? ' task ': ' tasks '} left | <strong>${completedTodosCount}</strong>${completedTodosCount === 1 ? ' task ': ' tasks '} completed</div><br><div><button disabled.bind=\"allTodosCount === 0\" click.trigger=\"removeAllTodos()\">Remove All</button> <button disabled.bind=\"completedTodosCount === 0\" click.trigger=\"removeCompletedTodos()\">Remove Completed</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"toggleAllTodos()\">Toggle All</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"completeAllTodos()\">Complete All</button></div><ul><li repeat.for=\"t of todos\"><input type=\"checkbox\" checked.bind=\"t.completed\"> <input show.bind=\"t.editMode\" type=\"text\" value.bind=\"t.title\"> <span show.two-way=\"!t.editMode\" click.trigger=\"updateTodo(t)\" class.bind=\"t.completed ? 'strikeout': ''\">${t.id} -${t.title}</span><button type=\"button\" click.trigger=\"removeTodo(t)\">Remove</button> <button type=\"button\" click.trigger=\"updateTodo(t)\">${t.editMode ? 'Update' : 'Edit'}</button></li></ul></template>"; });
define('text!../styles/styles.css', ['module'], function(module) { module.exports = "body {\n  font-family: Verdana, Arial;\n  color: blue; }\n\n.strikeout {\n  text-decoration: line-through; }\n\nul {\n  padding-left: 10px; }\n\nli {\n  list-style-type: none; }\n"; });
//# sourceMappingURL=app-bundle.js.map