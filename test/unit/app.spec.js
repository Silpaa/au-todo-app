import {App} from '../../src/app';

describe('the app', () => {
  it('says hello', () => {
    expect(new App().appName).toBe('Hello World!');
  });
});
