import { setModifierManager, capabilities } from '@ember/modifier';
import { assert } from '@ember/debug';
import { debounce as runloopDebounce, cancel } from '@ember/runloop';
import { gte } from 'ember-compatibility-helpers';

const SERVICE_NAME = 'service:did-resize-detector';

class BaseResizeModifierManager {
  constructor(owner) {
    this.owner = owner;
  }

  installModifier(
    instance,
    element,
    { positional: [callback], named: { debounce = 0 } }
  ) {
    instance.element = element;
    instance.debounce = debounce;

    instance.setupListener(this.owner, callback);
  }

  updateModifier(
    instance,
    { positional: [callback], named: { debounce = 0 } }
  ) {
    instance.destroyListener(this.owner);

    instance.debounce = debounce;

    instance.setupListener(this.owner, callback);
  }

  destroyModifier(instance) {
    instance.destroyListener(this.owner);
  }
}

class ResizeModifierManager313 extends BaseResizeModifierManager {
  capabilities = capabilities('3.13');

  createModifier(factory) {
    return new factory.class();
  }
}

class ResizeModifierManager322 extends BaseResizeModifierManager {
  capabilities = capabilities('3.22');

  createModifier(Modifier, args) {
    return new Modifier(args);
  }
}

const ModifierManager = gte('3.22.0')
  ? ResizeModifierManager322
  : ResizeModifierManager313;

export default class DidResizeModifier {
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

setModifierManager((owner) => new ModifierManager(owner), DidResizeModifier);
