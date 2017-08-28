export class KeyupEscCustomAttribute {
  static inject = [Element];
  element;
  value;
  escPressed;

  constructor(element) {
    this.element = element;

    this.escPressed = e => {
      let key = e.which || e.keyCode;
      if (key === 27) {
        this.value();//'this' won't be changed so you have access to your VM properties in 'called' method
      }
    };
  }

  attached() {
    this.element.addEventListener('keyup', this.escPressed);
  }

  detached() {
    this.element.removeEventListener('keyup', this.escPressed);
  }
}


