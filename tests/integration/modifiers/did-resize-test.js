import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, settled, setupOnerror, resetOnerror } from '@ember/test-helpers';
import { Promise } from 'rsvp';
import { later } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const timeout = (ms) => {
  return new Promise((resolve) => {
    later(resolve, ms);
  });
}

let sinonSandbox;

module('Integration | Modifier | did-resize', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    sinonSandbox = sinon.createSandbox();
  })

  hooks.afterEach(function() {
    resetOnerror();
    sinonSandbox.restore();
  });

  test('it works', async function(assert) {
    this.resizeMethod = sinonSandbox.stub();

    await render(hbs`
      <div data-test-subject {{did-resize this.resizeMethod}}>
        Hello world
      </div>
    `);

    assert.equal(this.resizeMethod.callCount, 0, 'the resize method is not called on creation');

    find('div[data-test-subject]').style.width = "25%";

    await timeout(50);

    assert.equal(this.resizeMethod.callCount, 1, 'the resize method is called when the element is resized');
    assert.equal(this.resizeMethod.args[0][0], find('div[data-test-subject'));
  });

  test('an assertion is thrown if a callback is not defined', async function(assert) {
    assert.expect(1);

    setupOnerror(function(error) {
      assert.strictEqual(
        error.message,
        "Assertion Failed: ember-did-resize-modifier: 'undefined' is not a valid callback. Provide a function."
      )
    });

    await render(hbs`
      <div data-test-subject {{did-resize}}>
        Hello world
      </div>
    `);
  });

  test('updating the callback updates the modifier', async function(assert) {
    this.resizeMethod1 = sinonSandbox.stub();
    this.resizeMethod2 = sinonSandbox.stub();

    this.set('resizeMethod', this.resizeMethod1);

    await render(hbs`
      <div data-test-subject {{did-resize this.resizeMethod}}>
        Hello world
      </div>
    `);

    find('div[data-test-subject]').style.width = "25%";

    await timeout(50);

    assert.equal(this.resizeMethod1.callCount, 1, 'the resize method is called when the element is resized');
    assert.equal(this.resizeMethod2.callCount, 0, 'the unbound resize method is not called');

    this.set('resizeMethod', this.resizeMethod2);

    await settled();

    find('div[data-test-subject]').style.width = "50%";

    await timeout(50);

    assert.equal(this.resizeMethod1.callCount, 1, 'the previously bound resize method is not called again');
    assert.equal(this.resizeMethod2.callCount, 1, 'the newly bound resize method is called');
  });
})
