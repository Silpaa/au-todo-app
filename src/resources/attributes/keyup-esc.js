export class KeyupEnterCustomAttribute {
  static inject = [Element];
  element;
  value;
  enterPressed;

  constructor(element) {
    this.element = element;

    this.enterPressed = e => {
      let key = e.which || e.keyCode;
      if (key === 27) {
        this.value();//'this' won't be changed so you have access to your VM properties in 'called' method
      }
    };
  }

  attached() {
    this.element.addEventListener('keyup', this.enterPressed);
  }

  detached() {
    this.element.removeEventListener('keyup', this.enterPressed);
  }
}