class _IdGenerator {
  constructor() {
    this.id = 0;
  }

  getNextId() {
    return ++this.id;
  }
}

export let IdGenerator = new _IdGenerator();
