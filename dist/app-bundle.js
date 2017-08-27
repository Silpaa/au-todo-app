define('app',['exports', './models/todo', './services/inmemory-todo-service'], function (exports, _todo, _inmemoryTodoService) {
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
      this.todoService = new _inmemoryTodoService.InMemoryTodoService();
      this.activeFilter = 'all';
      this.filterTodos(this.activeFilter);
    }

    App.prototype.addTodo = function addTodo() {
      this.todoService.addTodo(new _todo.Todo(this.todoTitle, false));
      this.todoTitle = '';
      this.todos = this.todoService.filterTodos(this.activeFilter);
    };

    App.prototype.removeTodo = function removeTodo(todo) {
      this.todoService.deleteTodoById(todo.id);
      this.todos = this.todoService.filterTodos(this.activeFilter);
    };

    App.prototype.filterTodos = function filterTodos(filterCriteria) {
      this.activeFilter = filterCriteria;
      console.log(filterCriteria);
      this.todos = this.todoService.filterTodos(this.activeFilter);
    };

    App.prototype.getTodosCount = function getTodosCount(filter) {
      return this.todoService.filterTodos(filter).length;
    };

    App.prototype.updateTodo = function updateTodo(todo) {
      if (todo.editMode) {
        todo.editMode = false;
        this.todoService.updateTodoById(todo.id, todo);
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
      this.todoService.toggleAllTodos();
      this.filterTodos(this.activeFilter);
    };

    App.prototype.completeAllTodos = function completeAllTodos() {
      this.todoService.completeAllTodos();
      this.checkIfAllTodosAreCompleted();
    };

    App.prototype.removeAllTodos = function removeAllTodos() {
      this.todoService.removeAllTodos();
      this.checkIfAllTodosAreCompleted();
    };

    App.prototype.removeCompletedTodos = function removeCompletedTodos() {
      this.todoService.removeCompletedTodos();
      this.checkIfAllTodosAreCompleted();
    };

    _createClass(App, [{
      key: 'allTodosCount',
      get: function get() {
        console.log("what is length of allTodosCount " + this.getTodosCount('all'));
        return this.getTodosCount('all');
      }
    }, {
      key: 'completedTodoCount',
      get: function get() {
        console.log("what is length of completedTodoCount " + this.getTodosCount('completed'));
        return this.getTodosCount('completed');
      }
    }, {
      key: 'activeTodosCount',
      get: function get() {
        return this.getTodosCount('active');
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
            console.log("from service " + filterCriteria);
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
define('services/inmemory-todo-promise-service',[], function () {
  "use strict";
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"../styles/styles.css\"></require><h1>${appName}</h1><form method=\"post\" submit.trigger=\"addTodo()\"><input type=\"text\" placeholder=\"What would you like to do?\" value.bind=\"todoTitle\"> <button type=\"submit\">Add</button></form><div><a href=\"#\" click.trigger=\"filterTodos('all')\">All</a> <a href=\"#\" click.trigger=\"filterTodos('active')\">Active</a> <a href=\"#\" click.trigger=\"filterTodos('completed')\">Completed</a></div><div><button disabled.bind=\"allTodosCount === 0\" click.trigger=\"removeAllTodos()\">Remove All</button> <button disabled.bind=\"completedTodoCount === 0\" click.trigger=\"removeCompletedTodos()\">Remove Completed</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"toggleAllTodos()\">Toggle All</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"completeAllTodos()\">Complete All</button></div><ul><li repeat.for=\"t of todos\"><input type=\"checkbox\" checked.bind=\"t.completed\"> <input show.bind=\"t.editMode\" type=\"text\" value.bind=\"t.title\"> <span show.two-way=\"!t.editMode\" click.trigger=\"updateTodo(t)\" class.bind=\"t.completed ? 'strikeout': ''\">${t.id} -${t.title}</span><button type=\"button\" click.trigger=\"removeTodo(t)\">Remove</button> <button type=\"button\" click.trigger=\"updateTodo(t)\">${t.editMode ? 'Update' : 'Edit'}</button></li></ul></template>"; });
define('text!../styles/styles.css', ['module'], function(module) { module.exports = "body {\n  font-family: Verdana, Arial;\n  color: blue; }\n\n.strikeout {\n  text-decoration: line-through; }\n\nul {\n  padding-left: 10px; }\n\nli {\n  list-style-type: none; }\n"; });
//# sourceMappingURL=app-bundle.js.map