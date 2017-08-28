import {inject, Aurelia} from 'aurelia-framework';

@inject(Aurelia)
export class Shell {
  constructor(aurelia) {
    this.aurelia = aurelia;
  }
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: '', name: 'default', redirect: 'todos'},
      { route: 'todos', name: 'todos', moduleId: 'todo-manager/index', nav: true },
      { route: 'todo/:id', name: 'todo', moduleId: 'todo/todo' }
    ]);

    this.router = router;
  }
}
