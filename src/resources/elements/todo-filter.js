import {customElement, bindable, bindingMode} from 'aurelia-framework';

@customElement('todo-filter')
export class TodoFilter {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) activeFilter;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) allTodosCount;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) activeTodosCount;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) completedTodosCount;
  @bindable filterTodosCallback;
}

