import {customElement, bindable, inject} from 'aurelia-framework';
import { Router} from 'aurelia-router';
@customElement('todo-popup-item')
@inject(Router)
export class TodoPopupItem {
  @bindable todo;
  @bindable removeCallback;
  @bindable updateCallback;
  @bindable cancelEditCallback;

  constructor(router) {
    this.router = router;
  }
  attached() {
  }

  todoChanged(newValue, oldValue) {
    console.log(newValue);
  }

  toggleCompleted(todo) {
    todo.completed = !todo.completed;
    todo.editMode = true;
    //Object.assign(todo, this.updateCallback(todo));
    this.updateCallback(todo);
    return true;
  }
}
