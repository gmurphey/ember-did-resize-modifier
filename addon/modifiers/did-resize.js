import { setModifierManager } from '@ember/modifier';
import { assert } from '@ember/debug';
import { debounce as runloopDebounce, cancel } from '@ember/runloop';

const SERVICE_NAME = 'service:did-resize-detector';

function setupListener(state, owner, element, callback, debounce) {
  assert(
    `ember-did-resize-modifier: '${callback}' is not a valid callback. Provide a function.`,
    typeof callback === 'function'
  );

  let cb = function(...args) {
    if (debounce !== 0) {
      state.debounceId = runloopDebounce(callback, ...args, debounce);
    } else {
      callback(...args);
    }
  };

  owner.lookup(SERVICE_NAME).setup(element, cb, { callOnAdd: false });

  return cb;
}

function destroyListener(state, owner, element, callback) {
  cancel(state.debounceId);
  owner.lookup(SERVICE_NAME).teardown(element, callback);
}

export default setModifierManager(
  (owner) => ({
    createModifier() {
      return {
        element: null,
        callback: null,
        debounce: null,
        debounceId: null
      };
    },

    installModifier(state, element, { positional: [ callback ], named: { debounce = 0 } }) {
      state.element = element;
      state.callback = setupListener(state, owner, element, callback, debounce);
    },

    updateModifier(state, { positional: [callback], named: { debounce = 0 }}) {
      destroyListener(state, owner, state.element, state.callback);
      state.callback = setupListener(state, owner, state.element, callback, debounce);
    },

    destroyModifier(state) {
      destroyListener(state, owner, state.element, state.callback);
    }
  }),
  class DidResizeModifier {}
);
