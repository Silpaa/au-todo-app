import {inject, customAttribute, bindingMode, TaskQueue} from 'aurelia-framework';

@inject(Element,TaskQueue)
@customAttribute('auto-focus',bindingMode.twoWay)
export class AutoFocusCustomAttribute {
  constructor(element, taskQueue) {
    this.element = element;
    this.taskQueue = taskQueue;
  }

  giveFocus(){
    this.taskQueue.queueMicroTask(() => {
      this.element.focus();
    });
  }

  attached(){
    this.giveFocus();
  }

  valueChanged(newValue, oldValue) {

  }
}

