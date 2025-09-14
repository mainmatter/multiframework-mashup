import { getContext } from 'svelte';

export function reactive_props(props) {
  let state = $state({
    ...props,
  });

  return state;
}

export function use_service(service) {
  let owner = getContext('ember:owner');
  return owner.lookup(`service:${service}`);
}
