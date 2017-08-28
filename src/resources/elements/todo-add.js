import { customElement, bindable, bindingMode } from 'aurelia-framework';

@customElement('todo-add')
export class TodoAdd {
  @bindable({ defaultBindingMode: bindingMode.twoway }) todoTitle;
  @bindable({ defaultBindingMode: bindingMode.twoway }) todoCompleted;
  @bindable addCallback;
}

