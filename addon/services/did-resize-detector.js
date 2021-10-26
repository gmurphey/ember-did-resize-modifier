import Service from '@ember/service';
import elementResizeDetectorMaker from 'element-resize-detector';

export default class DidResizeDetector extends Service {
  constructor() {
    super(...arguments);
    this.detector = elementResizeDetectorMaker({
      strategy: 'scroll',
    });
  }

  setup(element, callback, options) {
    this.detector.listenTo(options, element, callback);
  }

  teardown(element, callback) {
    this.detector.removeListener(element, callback);
  }
}
