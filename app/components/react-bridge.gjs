import { registerDestructor } from '@ember/destroyable';
import Modifier from 'ember-modifier';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

function cleanup(instance) {
  instance.root?.unmount();
}

class ReactModifier extends Modifier {
  root = null;

  modify(element, positional, { component, props }) {
    if (!this.root) {
      this.root = createRoot(element);
      registerDestructor(this, cleanup);
    }

    const wrappedComponent = createElement(component, props);
    this.root.render(wrappedComponent);
  }
}

<template>
  <div {{ReactModifier component=@component props=@props}}></div>
</template>
