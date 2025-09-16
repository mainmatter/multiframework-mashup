import { Signal } from 'signal-polyfill';
import { consumeTag, dirtyTag, tagFor } from '@glimmer/validator';
import { createSubscriber } from 'svelte/reactivity';

export function signal(target, property, descriptor) {
  let value;
  let initialized = false;

  // Reactivity

  // Ember
  let tag;
  // Svelte
  let subscribe;
  let notifySvelte;

  return {
    get() {
      if (!initialized) {
        initialized = true;
        value = new Signal.State(descriptor.initializer?.call(this));

        // Ember
        tag = tagFor(value);

        // Svelte
        subscribe = createSubscriber((update) => {
          notifySvelte = update;
          return () => {
            subscribe = undefined;
            notifySvelte = undefined;
          };
        });
      }

      consumeTag(tag); // Ember
      subscribe?.(); // Svelte

      return value.get();
    },

    set(newValue) {
      value.set(newValue);

      dirtyTag(tag); // Ember
      notifySvelte?.(); // Svelte
    },

    subscribe() {
      console.log('subscribe!');
    },
  };
}
