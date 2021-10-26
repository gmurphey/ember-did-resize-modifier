import { setModifierManager, capabilities } from '@ember/modifier';
import { assert } from '@ember/debug';
import { debounce as runloopDebounce, cancel } from '@ember/runloop';

const SERVICE_NAME = 'service:did-resize-detector';

export default setModifierManager(
  (owner) => ({
    capabilities: capabilities('3.13'),

    createModifier(factory) {
      return new factory.class();
    },

    installModifier(
      instance,
      element,
      { positional: [callback], named: { debounce = 0 } }
    ) {
      instance.element = element;
      instance.debounce = debounce;

      instance.setupListener(owner, callback);
    },

    updateModifier(
      instance,
      { positional: [callback], named: { debounce = 0 } }
    ) {
      instance.destroyListener(owner);

      instance.debounce = debounce;

      instance.setupListener(owner, callback);
    },

    destroyModifier(instance) {
      instance.destroyListener(owner);
    },
  }),

  class DidResizeModifier {
    setupListener(owner, callback) {
      assert(
        `ember-did-resize-modifier: '${callback}' is not a valid callback. Provide a function.`,
        typeof callback === 'function'
      );

      let cb = (...args) => {
        if (this.debounce !== 0) {
          this.debounceId = runloopDebounce(callback, ...args, this.debounce);
        } else {
          callback(...args);
        }
      };

      owner.lookup(SERVICE_NAME).setup(this.element, cb, { callOnAdd: false });

      this.callback = cb;
    }

    destroyListener(owner) {
      cancel(this.debounceId);
      owner.lookup(SERVICE_NAME).teardown(this.element, this.callback);
    }
  }
);
