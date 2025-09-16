import { signal } from '../decorators/signal';
import Service from '@ember/service';
import { action } from '@ember/object';

export default class CounterService extends Service {
  listeners = new Set();

  @signal count = 0;

  @action
  increment() {
    this.count++;
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  @action
  subscribe(listener) {
    if (this.listeners.has(listener)) {
      return;
    }

    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
