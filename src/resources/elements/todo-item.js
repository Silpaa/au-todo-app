import {customElement, bindable} from 'aurelia-framework';

@customElement('todo-item')
export class TodoItem {
  @bindable todo;
  @bindable removeCallback;
  @bindable updateCallback;
  attached() {
  }
}

