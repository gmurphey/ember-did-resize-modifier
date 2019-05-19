import { setModifierManager } from '@ember/modifier';
import { assert } from '@ember/debug';

const SERVICE_NAME = 'service:did-resize-detector';

function setupListener(owner, element, callback) {
  assert(
    `ember-did-resize-modifier: '${callback}' is not a valid callback. Provide a function.`,
    typeof callback === 'function'
  );

  owner.lookup(SERVICE_NAME).setup(element, callback, { callOnAdd: false });

  return callback;
}

function destroyListener(owner, element, callback) {
  owner.lookup(SERVICE_NAME).teardown(element, callback);
}

export default setModifierManager(
  (owner) => ({
    createModifier() {
      return {
        element: null,
        callback: null
      };
    },

    installModifier(state, element, { positional: [ callback ] }) {
      state.element = element;
      state.callback = setupListener(owner, element, callback);
    },

    updateModifier(state, { positional: [callback]}) {
      destroyListener(owner, state.element, state.callback);
      state.callback = setupListener(owner, state.element, callback);
    },

    destroyModifier({ element, callback }) {
      destroyListener(owner, element, callback);
    }
  }),
  class DidResizeModifier {}
);
