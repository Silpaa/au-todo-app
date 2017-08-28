import {customElement, bindable, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@customElement('todo-item')
@inject(Router)
export class TodoItem {
  @bindable todo;
  @bindable removeCallback;
  @bindable updateCallback;
  @bindable cancelEditCallback;

  constructor(router) {
    this.router = router;
  }

  attached() {
  }

  updateSingleInNewPage(todo) {
    this.router.navigate(this.router.generate('todo', { id: todo.id}));
  }
}
