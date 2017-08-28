import {customElement, bindable, bindingMode} from 'aurelia-framework';

@customElement('todo-action')
export class TodoAction {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) allTodosCount;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) completedTodosCount;
  @bindable removeAllTodosCallback;
  @bindable removeCompletedTodosCallback;
  @bindable toggleAllTodosCallback;
  @bindable completeAllTodosCallback;
}
