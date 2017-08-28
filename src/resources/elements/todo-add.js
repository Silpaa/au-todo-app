import {customElement, bindable, bindingMode} from 'aurelia-framework';

@customElement('todo-add')
export class TodoAdd {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) todoTitle;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) todoCompleted;
  @bindable addCallback;
}

