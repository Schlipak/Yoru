// 心/preloader.js

import YoruObject from '../yoru-object';
import { Logger, Run } from '../komono/utils';

const PRELOAD_CSS = `body {
  transform: scale(1);
  transform-origin: top;
  opacity: 1;
  transition: transform .6s, opacity .6s;
}
body.yoru-loading {
  transform: scale(1.05);
  opacity: 0;
  transition: none;
}`;

export default class Preloader extends YoruObject {
  constructor() {
    super(...arguments);
    this.preloadStyle = document.createElement('style');
    this.preloadStyle.innerHTML = PRELOAD_CSS;
  }

  init() {
    Logger.debug('Starting preloader...');
    this.startTime = new Date();
    document.head.appendChild(this.preloadStyle);
  }

  tearDown() {
    const endTime = new Date();
    let dt = (endTime.getTime() - this.startTime.getTime());
    const unit = dt > 1000 ? 's' : 'ms';
    dt = dt > 1000 ? dt / 1000 : dt;
    Run.async(() => {
      Logger.debug(`Done in ${dt}${unit}! Tearing down preloader`);
      document.body.classList.remove('yoru-loading');
      Run.later(() => {
        this.preloadStyle.parentNode.removeChild(this.preloadStyle);
        this.preloadStyle = null;
      }, 650);
    });
  }
}
