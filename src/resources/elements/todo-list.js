import {customElement, bindable} from 'aurelia-framework';

@customElement('todo-list')
export class TodoList {
  @bindable todos;
  @bindable host;
  @bindable removeCallback;
  @bindable updateCallback;
  constructor() {}
  activate() {
  }
  removeTodo(todo) {
    this.host.removeTodo(todo);
  }

  updateTodo(todo) {
    this.host.updateTodo(todo);
  }
}