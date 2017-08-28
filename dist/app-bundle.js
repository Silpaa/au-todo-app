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
      return aurelia.setRoot('shell');
    });
  }
});
define('shell',['exports', './models/todo', './services/pouchdb-todo-promise-service'], function (exports, _todo, _pouchdbTodoPromiseService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Shell = undefined;

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

  var Shell = exports.Shell = function () {
    function Shell() {
      _classCallCheck(this, Shell);

      this.appName = 'Todo List';
      this.self = this;
      this.todoTitle = '';
      this.previousTitle = '';
      this.todoCompleted = false;
      this.activeFilter = 'all';
      this.todoService = new _pouchdbTodoPromiseService.PouchDBTodoPromiseService();
      this.filterTodos(this.activeFilter);
    }

    Shell.prototype.filterTodos = function filterTodos(filterCriteria) {
      var _this = this;

      this.activeFilter = filterCriteria;
      this.todoService.filterTodos(this.activeFilter).then(function (todos) {
        _this.todos = todos;
      });
    };

    Shell.prototype.addTodo = function addTodo(todo) {
      var _this2 = this;

      this.todoService.addTodo(new _todo.Todo(todo.title, todo.completed)).then(function (addedTodo) {
        _this2.todoTitle = '';
        console.log(addedTodo);
        _this2.todoService.filterTodos(_this2.activeFilter).then(function (todos) {
          _this2.todos = todos;
        });
      });
    };

    Shell.prototype.removeTodo = function removeTodo(todo) {
      var _this3 = this;

      this.todoService.deleteTodoById(todo.id).then(function (deletedTodo) {
        console.log(deletedTodo);
        _this3.todoService.filterTodos(_this3.activeFilter).then(function (todos) {
          _this3.todos = todos;
        });
      }).catch(function (error) {
        console.log('ERROR: ' + error);
      });
    };

    Shell.prototype.updateTodo = function updateTodo(todo) {
      if (todo.editMode) {
        todo.editMode = false;
        this.todoService.updateTodoById(todo.id, todo);
      } else {
        this.previousTitle = todo.title;
        todo.editMode = true;
      }
    };

    Shell.prototype.cancelEditTodo = function cancelEditTodo(todo) {
      todo.title = this.previousTitle;
      todo.editMode = false;
    };

    Shell.prototype.checkIfAllTodosAreCompleted = function checkIfAllTodosAreCompleted() {
      return this.todos.every(function (todo) {
        return todo.completed;
      });
    };

    Shell.prototype.toggleAllTodos = function toggleAllTodos() {
      var _this4 = this;

      this.todoService.toggleAllTodos().then(function (result) {
        if (result) {
          _this4.filterTodos(_this4.activeFilter);
        }
      });
    };

    Shell.prototype.completeAllTodos = function completeAllTodos() {
      var _this5 = this;

      this.todoService.completeAllTodos().then(function (result) {
        if (result) {
          _this5.checkIfAllTodosAreCompleted();
          _this5.filterTodos(_this5.activeFilter);
        }
      });
    };

    Shell.prototype.removeAllTodos = function removeAllTodos() {
      var _this6 = this;

      this.todoService.removeAllTodos().then(function (result) {
        if (result) {
          _this6.filterTodos(_this6.activeFilter);
        }
      });
    };

    Shell.prototype.removeCompletedTodos = function removeCompletedTodos() {
      var _this7 = this;

      this.todoService.removeCompletedTodos().then(function (result) {
        if (result) {
          _this7.filterTodos(_this7.activeFilter);
        }
      });
    };

    _createClass(Shell, [{
      key: 'allTodosCount',
      get: function get() {
        return this.todoService.allTodosCount;
      }
    }, {
      key: 'activeTodosCount',
      get: function get() {
        return this.todoService.activeTodosCount;
      }
    }, {
      key: 'completedTodosCount',
      get: function get() {
        return this.todoService.completedTodosCount;
      }
    }]);

    return Shell;
  }();
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
define('resources/attributes/auto-focus',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AutoFocusCustomAttribute = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var AutoFocusCustomAttribute = exports.AutoFocusCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element, _aureliaFramework.TaskQueue), _dec2 = (0, _aureliaFramework.customAttribute)('auto-focus', _aureliaFramework.bindingMode.twoWay), _dec(_class = _dec2(_class = function () {
    function AutoFocusCustomAttribute(element, taskQueue) {
      _classCallCheck(this, AutoFocusCustomAttribute);

      this.element = element;
      this.taskQueue = taskQueue;
    }

    AutoFocusCustomAttribute.prototype.giveFocus = function giveFocus() {
      var _this = this;

      this.taskQueue.queueMicroTask(function () {
        _this.element.focus();
      });
    };

    AutoFocusCustomAttribute.prototype.attached = function attached() {
      this.giveFocus();
    };

    AutoFocusCustomAttribute.prototype.valueChanged = function valueChanged(newValue, oldValue) {};

    return AutoFocusCustomAttribute;
  }()) || _class) || _class);
});
define('resources/attributes/keyup-enter',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _class, _temp;

  var KeyupEnterCustomAttribute = exports.KeyupEnterCustomAttribute = (_temp = _class = function () {
    function KeyupEnterCustomAttribute(element) {
      var _this = this;

      _classCallCheck(this, KeyupEnterCustomAttribute);

      this.element = element;

      this.enterPressed = function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
          _this.value();
        }
      };
    }

    KeyupEnterCustomAttribute.prototype.attached = function attached() {
      this.element.addEventListener('keyup', this.enterPressed);
    };

    KeyupEnterCustomAttribute.prototype.detached = function detached() {
      this.element.removeEventListener('keyup', this.enterPressed);
    };

    return KeyupEnterCustomAttribute;
  }(), _class.inject = [Element], _temp);
});
define('resources/attributes/keyup-esc',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _class, _temp;

  var KeyupEscCustomAttribute = exports.KeyupEscCustomAttribute = (_temp = _class = function () {
    function KeyupEscCustomAttribute(element) {
      var _this = this;

      _classCallCheck(this, KeyupEscCustomAttribute);

      this.element = element;

      this.enterPressed = function (e) {
        var key = e.which || e.keyCode;
        if (key === 27) {
          _this.value();
        }
      };
    }

    KeyupEscCustomAttribute.prototype.attached = function attached() {
      this.element.addEventListener('keyup', this.enterPressed);
    };

    KeyupEscCustomAttribute.prototype.detached = function detached() {
      this.element.removeEventListener('keyup', this.enterPressed);
    };

    return KeyupEscCustomAttribute;
  }(), _class.inject = [Element], _temp);
});
define('resources/elements/todo-action',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoAction = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

  var TodoAction = exports.TodoAction = (_dec = (0, _aureliaFramework.customElement)('todo-action'), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = function TodoAction() {
    _classCallCheck(this, TodoAction);

    _initDefineProp(this, 'allTodosCount', _descriptor, this);

    _initDefineProp(this, 'completedTodosCount', _descriptor2, this);

    _initDefineProp(this, 'removeAllTodosCallback', _descriptor3, this);

    _initDefineProp(this, 'removeCompletedTodosCallback', _descriptor4, this);

    _initDefineProp(this, 'toggleAllTodosCallback', _descriptor5, this);

    _initDefineProp(this, 'completeAllTodosCallback', _descriptor6, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'allTodosCount', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'completedTodosCount', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'removeAllTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'removeCompletedTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'toggleAllTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'completeAllTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/todo-add',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoAdd = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var TodoAdd = exports.TodoAdd = (_dec = (0, _aureliaFramework.customElement)('todo-add'), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoway }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoway }), _dec(_class = (_class2 = function TodoAdd() {
    _classCallCheck(this, TodoAdd);

    _initDefineProp(this, 'todoTitle', _descriptor, this);

    _initDefineProp(this, 'todoCompleted', _descriptor2, this);

    _initDefineProp(this, 'addCallback', _descriptor3, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'todoTitle', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'todoCompleted', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'addCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/todo-filter',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoFilter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

  var TodoFilter = exports.TodoFilter = (_dec = (0, _aureliaFramework.customElement)('todo-filter'), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec4 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec5 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = function TodoFilter() {
    _classCallCheck(this, TodoFilter);

    _initDefineProp(this, 'activeFilter', _descriptor, this);

    _initDefineProp(this, 'allTodosCount', _descriptor2, this);

    _initDefineProp(this, 'activeTodosCount', _descriptor3, this);

    _initDefineProp(this, 'completedTodosCount', _descriptor4, this);

    _initDefineProp(this, 'filterTodosCallback', _descriptor5, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'activeFilter', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'allTodosCount', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'activeTodosCount', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'completedTodosCount', [_dec5], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'filterTodosCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/todo-item',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoItem = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var TodoItem = exports.TodoItem = (_dec = (0, _aureliaFramework.customElement)('todo-item'), _dec(_class = (_class2 = function () {
    function TodoItem() {
      _classCallCheck(this, TodoItem);

      _initDefineProp(this, 'todo', _descriptor, this);

      _initDefineProp(this, 'removeCallback', _descriptor2, this);

      _initDefineProp(this, 'updateCallback', _descriptor3, this);

      _initDefineProp(this, 'cancelEditCallback', _descriptor4, this);
    }

    TodoItem.prototype.attached = function attached() {};

    return TodoItem;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'todo', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'removeCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'updateCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'cancelEditCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/todo-list',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TodoList = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

  var TodoList = exports.TodoList = (_dec = (0, _aureliaFramework.customElement)('todo-list'), _dec(_class = (_class2 = function () {
    function TodoList() {
      _classCallCheck(this, TodoList);

      _initDefineProp(this, 'todos', _descriptor, this);

      _initDefineProp(this, 'host', _descriptor2, this);

      _initDefineProp(this, 'removeCallback', _descriptor3, this);

      _initDefineProp(this, 'updateCallback', _descriptor4, this);

      _initDefineProp(this, 'cancelEditCallback', _descriptor5, this);
    }

    TodoList.prototype.activate = function activate() {};

    TodoList.prototype.removeTodo = function removeTodo(todo) {
      this.host.removeTodo(todo);
    };

    TodoList.prototype.updateTodo = function updateTodo(todo) {
      this.host.updateTodo(todo);
    };

    return TodoList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'todos', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'host', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'removeCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'updateCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'cancelEditCallback', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('services/pouchdb-todo-promise-service',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var PouchDBTodoPromiseService = exports.PouchDBTodoPromiseService = function () {
    function PouchDBTodoPromiseService() {
      _classCallCheck(this, PouchDBTodoPromiseService);

      this.db = new PouchDB('todos-db', { adapter: 'websql' });
      this.todos = [];
      this.latency = 100;
      this.isRequesting = false;
      this.completedTodosCount = 0;
      this.allTodosCount = 0;
      this.activeTodosCount = 0;
    }

    PouchDBTodoPromiseService.prototype.getAllTodos = function getAllTodos() {
      var _this = this;

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          _this.db.allDocs({
            include_docs: true
          }).then(function (result) {
            _this.todos = [];
            result.rows.forEach(function (todo) {
              _this.todos.push(todo.doc);
            });
            _this.allTodosCount = result.rows.length;
            _this.activeTodosCount = _this.todos.filter(function (t) {
              return !t.completed;
            }).length;
            _this.completedTodosCount = _this.todos.filter(function (t) {
              return t.completed;
            }).length;
            resolve(true);
            _this.isRequesting = false;
          }).catch(function (err) {
            console.log(err);
            reject(err);
          });
        }, _this.latency);
      });
    };

    PouchDBTodoPromiseService.prototype.getTodoById = function getTodoById(id) {
      var _this2 = this;

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          _this2.db.get(id).then(function (found) {
            resolve(JSON.parse(JSON.stringify(found)));
            _this2.isRequesting = false;
          }).catch(function (err) {
            console.log(err);
            reject(err);
          });
        }, _this2.latency);
      });
    };

    PouchDBTodoPromiseService.prototype.addTodo = function addTodo(todo) {
      var _this3 = this;

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          todo.id = _this3.todos.length > 0 ? _this3.todos[_this3.todos.length - 1].id + 1 : 1;

          console.log('Next Id: ' + todo.id);
          todo['_id'] = todo.id.toString();
          var instance = JSON.parse(JSON.stringify(todo));
          _this3.db.put(instance).then(function (response) {
            _this3.isRequesting = false;
            resolve(instance);
          }).catch(function (err) {
            console.log(err);
            reject(err);
          });
        }, _this3.latency);
      });
    };

    PouchDBTodoPromiseService.prototype.deleteTodoById = function deleteTodoById(id) {
      var _this4 = this;

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          _this4.db.get(id.toString()).then(function (deletedTodo) {
            return _this4.db.remove(deletedTodo);
          }).then(function (deletedTodo) {
            _this4.isRequesting = false;
            resolve(deletedTodo);
          }).catch(function (ex) {
            reject(ex);
          });
        }, _this4.latency);
      });
    };

    PouchDBTodoPromiseService.prototype.updateTodoById = function updateTodoById(id) {
      var _this5 = this;

      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          _this5.db.get(id.toString()).then(function (updatedTodo) {
            Object.assign(updatedTodo, values);
            return _this5.db.put(updatedTodo);
          }).then(function (response) {
            _this5.isRequesting = false;
            _this5.db.get(id.toString()).then(function (updatedTodo) {
              resolve(updatedTodo);
            });
          }).catch(function (ex) {
            reject(ex);
          });
        }, _this5.latency);
      });
    };

    PouchDBTodoPromiseService.prototype.toggleTodoCompleted = function toggleTodoCompleted(todo) {
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

    PouchDBTodoPromiseService.prototype.filterTodos = function filterTodos(filterCriteria) {
      var _this7 = this;

      return this.getAllTodos().then(function (result) {
        console.log(result);

        return new Promise(function (resolve) {
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
              break;
          }
        });
      });
    };

    PouchDBTodoPromiseService.prototype.toggleAllTodos = function toggleAllTodos() {
      var _this8 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this8.todos.forEach(function (t) {
            return t.completed = !t.completed;
          });
          _this8.db.bulkDocs(_this8.todos).then(function (result) {
            resolve(true);
            _this8.isRequesting = false;
          }).catch(function (err) {
            reject(err);
          });
        }, _this8.latency);
      });
    };

    PouchDBTodoPromiseService.prototype.completeAllTodos = function completeAllTodos() {
      var _this9 = this;

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          _this9.todos.forEach(function (t) {
            return t.completed = true;
          });
          _this9.db.bulkDocs(_this9.todos).then(function (result) {
            resolve(true);
            _this9.isRequesting = false;
          }).catch(function (err) {
            reject(err);
          });
        }, _this9.latency);
      });
    };

    PouchDBTodoPromiseService.prototype.removeAllTodos = function removeAllTodos() {
      var _this10 = this;

      this.isRequesting = true;
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          _this10.db.allDocs().then(function (result) {
            return Promise.all(result.rows.map(function (row) {
              return _this10.db.remove(row.id, row.value.rev);
            }));
          }).then(function () {
            _this10.todos.splice(0);
            resolve(true);
            _this10.isRequesting = false;
          }).catch(function (err) {
            reject(err);
          });
        }, _this10.latency);
      });
    };

    PouchDBTodoPromiseService.prototype.removeCompletedTodos = function removeCompletedTodos() {
      var _this11 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          _this11.tobeDeletedTodos = _this11.todos.filter(function (todo) {
            return todo.completed;
          });
          _this11.tobeDeletedTodos.forEach(function (t) {
            return t._deleted = true;
          });
          _this11.db.bulkDocs(_this11.tobeDeletedTodos).then(function (result) {
            _this11.todos = _this11.todos.filter(function (todo) {
              return !todo.completed;
            });
            resolve(true);
            _this11.isRequesting = false;
          }).catch(function (err) {
            reject(err);
          });
        }, _this11.latency);
      });
    };

    return PouchDBTodoPromiseService;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"../styles/styles.css\"></require><require from=\"./resources/attributes/auto-focus\"></require><h1>${appName}</h1><form method=\"post\" submit.trigger=\"addTodo()\"><input type=\"text\" placeholder=\"What would you like to do?\" value.bind=\"todoTitle\" auto-focus> <button type=\"submit\">Add</button></form><br><br><div><a href=\"#\" click.trigger=\"filterTodos('all')\">All</a> <a href=\"#\" click.trigger=\"filterTodos('active')\">Active</a> <a href=\"#\" click.trigger=\"filterTodos('completed')\">Completed</a></div><div><strong>${allTodosCount}</strong>${allTodosCount === 1 ? ' task ': ' tasks '} | <strong>${activeTodosCount}</strong>${activeTodosCount === 1 ? ' task ': ' tasks '} left | <strong>${completedTodosCount}</strong>${completedTodosCount === 1 ? ' task ': ' tasks '} completed</div><br><div><button disabled.bind=\"allTodosCount === 0\" click.trigger=\"removeAllTodos()\">Remove All</button> <button disabled.bind=\"completedTodosCount === 0\" click.trigger=\"removeCompletedTodos()\">Remove Completed</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"toggleAllTodos()\">Toggle All</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"completeAllTodos()\">Complete All</button></div><ul><li repeat.for=\"t of todos\"><input type=\"checkbox\" checked.bind=\"t.completed\"> <input show.bind=\"t.editMode\" type=\"text\" value.bind=\"t.title\"> <span show.two-way=\"!t.editMode\" click.trigger=\"updateTodo(t)\" class.bind=\"t.completed ? 'strikeout': ''\">${t.id} -${t.title}</span><button type=\"button\" click.trigger=\"removeTodo(t)\">Remove</button> <button type=\"button\" click.trigger=\"updateTodo(t)\">${t.editMode ? 'Update' : 'Edit'}</button></li></ul></template>"; });
define('text!../styles/styles.css', ['module'], function(module) { module.exports = ".strikeout {\n  text-decoration: line-through; }\n"; });
define('text!shell.html', ['module'], function(module) { module.exports = "<template><require from=\"../styles/styles.css\"></require><require from=\"./resources/elements/todo-add\"></require><require from=\"./resources/elements/todo-filter\"></require><require from=\"./resources/elements/todo-action\"></require><require from=\"./resources/elements/todo-list\"></require><div class=\"container\"><div class=\"row\"><div class=\"col m8 offset-m2\"><h2 class=\"center-align\">${appName}</h2><todo-add todo-title.bind=\"todoTitle\" todo-completed.bind=\"todoCompleted\" add-callback.call=\"addTodo($event)\"></todo-add><todo-filter all-todos-count.bind=\"allTodosCount\" active-todos-count.bind=\"activeTodosCount\" completed-todos-count.bind=\"completedTodosCount\" active-filter.bind=\"activeFilter\" filter-todos-callback.call=\"filterTodos($event)\"></todo-filter><br><todo-action all-todos-count.bind=\"allTodosCount\" completed-todos-count.bind=\"completedTodosCount\" remove-all-todos-callback.call=\"removeAllTodos()\" remove-completed-todos-callback.call=\"removeCompletedTodos()\" toggle-all-todos-callback.call=\"toggleAllTodos()\" complete-all-todos-callback.call=\"completeAllTodos()\"></todo-action><br><todo-list todos.bind=\"todos\" host.bind=\"self\" remove-callback.call=\"removeTodo($event)\" update-callback.call=\"updateTodo($event)\" cancel-edit-callback.call=\"cancelEditTodo($event)\"></todo-list></div></div></div></template>"; });
define('text!resources/elements/todo-action.html', ['module'], function(module) { module.exports = "<template><div><button disabled.bind=\"allTodosCount === 0\" click.trigger=\"removeAllTodosCallback()\">Remove All</button> <button disabled.bind=\"completedTodosCount === 0\" click.trigger=\"removeCompletedTodosCallback()\">Remove Completed</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"toggleAllTodosCallback()\">Toggle All</button> <button disabled.bind=\"allTodosCount === 0\" click.trigger=\"completeAllTodosCallback()\">Complete All</button></div></template>"; });
define('text!resources/elements/todo-add.html', ['module'], function(module) { module.exports = "<template><require from=\"../attributes/auto-focus\"></require><require from=\"../attributes/keyup-enter\"></require><div class=\"row\"><div class=\"row\"><div class=\"input-field col s1\"><input type=\"checkbox\" checked.bind=\"todoCompleted\" id=\"completed\"><label for=\"completed\"></label></div><div class=\"input-field col s11\"><input type=\"text\" value.bind=\"todoTitle\" auto-focus placeholder=\"what needs to be done?\" keyup-enter.call=\"addCallback({title: todoTitle, completed: todoCompleted})\"></div></div><div class=\"row\"><div class=\"col m12\"><p class=\"right-align\"><button class=\"btn btn-large waves-effect waves-light\" type=\"button\" name=\"action\" click.delegate=\"addCallback({title: todoTitle, completed: todoCompleted})\"><i class=\"material-icons left\">add</i>Add</button></p></div></div></div></template>"; });
define('text!resources/elements/todo-filter.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"fixed-action-btn\"><a class=\"btn-floating btn-large green\"><i class=\"large material-icons\">filter_list</i></a><ul><li class=\"btn-floating blue waves-effect waves-light\"><a href=\"#!\" class.bind=\"activeFilter === 'all' ? 'active item' : 'item'\" click.trigger=\"filterTodosCallback('all')\"><i class=\"material-icons\">list</i></a></li><li class=\"btn-floating green waves-effect waves-light\"><a href=\"#!\" class.bind=\"activeFilter === 'active' ? 'active item' : 'item'\" click.trigger=\"filterTodosCallback('active')\"><i class=\"material-icons\">view_list</i></a></li><li class=\"btn-floating red waves-effect waves-light\"><a href=\"#!\" class.bind=\"activeFilter === 'completed' ? 'active item' : 'item'\" click.trigger=\"filterTodosCallback('completed')\"><i class=\"material-icons\">playlist_add_check</i></a></li></ul></div></div><div class=\"row center\"><div class=\"col s12\"><ul class=\"tabs\"><li class=\"tab col s3\"><a href=\"#test1\" class.bind=\"activeFilter === 'all' ? 'active item' : 'item'\" click.trigger=\"filterTodosCallback('all')\"><i class=\"material-icons\">list</i>All</a></li><li class=\"tab col s3\"><a href=\"#test2\" class.bind=\"activeFilter === 'active' ? 'active item' : 'item'\" click.trigger=\"filterTodosCallback('active')\"><i class=\"material-icons\">view_list</i>Active</a></li><li class=\"tab col s3\"><a href=\"#test3\" class.bind=\"activeFilter === 'completed' ? 'active item' : 'item'\" click.trigger=\"filterTodosCallback('completed')\"><i class=\"material-icons\">playlist_add_check</i>Completed</a></li></ul></div><div id=\"test1\" class=\"tab col s3\"><i class=\"large material-icons blue\">list</i><div class=\"label blue\"><strong>${allTodosCount}</strong>${allTodosCount === 1 ? ' task ': ' tasks '} </div></div><div id=\"test2\" class=\"tab col s3\"><i class=\"large material-icons green\">view_list</i><div class=\"label green\"><strong>${activeTodosCount}</strong>${activeTodosCount === 1 ? ' task ': ' tasks '} left</div></div><div id=\"test3\" class=\"tab col s3\"><i class=\"large material-icons red\">playlist_add_check</i><div class=\"label red\"><strong>${completedTodosCount}</strong>${completedTodosCount === 1 ? ' task ': ' tasks '} completed</div></div></div></template>"; });
define('text!resources/elements/todo-item.html', ['module'], function(module) { module.exports = "<template><require from=\"../attributes/auto-focus\"></require><require from=\"../attributes/keyup-enter\"></require><require from=\"../attributes/keyup-esc\"></require><div class=\"row\"><div class=\"input-field col s1\"><i class=\"small left material-icons\">list</i></div><div class=\"input-field col s5\" show.bind=\"!todo.editMode\"><input type=\"checkbox\" checked.bind=\"todo.completed\" id=\"id_${todo.id}\"><label for=\"id_${todo.id}\"><span show.two-way=\"!todo.editMode\" click.delegate=\"updateCallback(todo)\" class.bind=\"todo.completed ? 'red-text strikeout' : 'green-text'\">${todo.id} - ${todo.title}</span></label></div><div class=\"input-field col s5\" show.bind=\"todo.editMode\"><input type=\"text\" value.bind=\"todo.title\" ref=\"todoTextBox\" keyup-enter.call=\"updateCallback(todo)\" keyup-esc.call=\"cancelEditCallback(todo)\"></div><div class=\"input-field col s6\"><button type=\"button\" click.delegate=\"removeCallback(todo)\" class=\"btn btn-medium waves-effect waves-light red\"><i class=\"medium material-icons\">delete</i>Remove</button> <button type=\"button\" click.delegate=\"updateCallback(todo)\" class=\"btn btn-medium waves-effect waves-light blue\"><i class=\"medium material-icons\">edit</i>${todo.editMode ? 'Update' : 'Edit'}</button></div></div><template></template></template>"; });
define('text!resources/elements/todo-list.html', ['module'], function(module) { module.exports = "<template><require from=\"./todo-item\"></require><todo-item repeat.for=\"todo of todos\" todo.bind=\"todo\" remove-callback.call=\"removeCallback($event)\" update-callback.call=\"updateCallback($event)\" cancel-edit-callback.call=\"cancelEditCallback($event)\"></todo-item></template>"; });
//# sourceMappingURL=app-bundle.js.map