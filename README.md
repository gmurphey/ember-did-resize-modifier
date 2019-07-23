# ember-did-resize-modifier

[![Build Status](https://travis-ci.org/gmurphey/ember-did-resize-modifier.svg?branch=master)](https://travis-ci.org/gmurphey/ember-did-resize-modifier)

This [Ember.js](https://emberjs.com/) addon provides a `{{did-resize}}` modifier that calls a callback whenever a given element is resized.

The resize detection itself is handled by [element-resize-detector](https://github.com/wnr/element-resize-detector).

## Compatibility

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

## Installation

```
ember install ember-did-resize-modifier
```

## Usage

```
<div {{did-resize this.onResize}}>
  Resize the window to see the modifier in action
</div>
```

```
import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class ResizableComponent extends Component {
  @action
  onResize(element: HTMLElement) {
    console.log('div resized!');
  }
}
```

The [`@action` decorator](https://github.com/emberjs/rfcs/blob/master/text/0408-decorators.md#method-binding) is used to bind the `onResize` method to the component instance.

### Debouncing Resize Events

In the case of an element resizing fluidly (based on the percentage of the screen when the user resizes a window, for example), one may not want their `{{did-resize}}` callback to be called continiously. The `debounce` property may be used to only call the callback after no resize has been detected for a given time.

```
<div
  {{did-resize this.onResize debounce=250}}
>
  Will only have this.onResize called if a resize has not been detected in the last 250ms
</div>
```

There is no debounce by default. This means you can also use a restartable ember-concurrency task as a debounce mechanism if that better suits your needs.

### Handling Multiple Resize Callbacks

You can use the `{{did-resize}}` modifier multiple times on the same element.

```hbs
<div
  {{did-resize this.onResize}}
  {{did-resize this.onResizeAgain}}
>
  Resize the window to see the modifier in action
</div>
```

### Calling the Resize Callback on Creation

The `{{did-resize}}` modifier is designed to only call handlers when the element is actually resized. If you would like to also call the resize handler when the element is created, it is recommended that you install [`ember-render-modifiers`](https://github.com/emberjs/ember-render-modifiers) and use the `{{did-insert}}` modifier.

```hbs
<div
  {{did-insert this.onResize}}
  {{did-resize this.onResize}}
>
  Resize the window to see the modifier in action
</div>
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
