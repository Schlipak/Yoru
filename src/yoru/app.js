//
// 夜/App
//

import Yoru from 'yoru';
import YoruObject from 'yoru/object';
import { Logger } from 'yoru/utils';
import { ShadowMaker, TemplateConsumer } from 'yoru/shadow';
import { Preloader, Builtins } from 'yoru/internals';
import { readonly } from 'core-decorators';

const YORU_INFO_STYLE = `background: #000;
  color: #FFF;
  font-size: 1.5em;
  padding: .5em 1em;
  border-radius: 1.5em;`;

class YoruApp extends YoruObject {
  constructor() {
    super(...arguments);
    Logger.raw('');
    Logger.style(`夜 ー ＹＯＲＵ ー Version ${Yoru.VERSION}`, YORU_INFO_STYLE);
    Logger.raw('');

    this.__setupServerListener();

    this.set('documents', Yoru.A(document));
    this.templateConsumer = new TemplateConsumer(this);
    this.shadowMaker = new ShadowMaker(this.templateConsumer);
    this.preloader = new Preloader();
    this.preloader.init();

    this.__registerBuiltins();
  }

  @readonly
  async boot() {
    Logger.info('Booting Yoru');

    this.templateConsumer.consume();
    await this.shadowMaker.init();
    this.preloader.tearDown();
  }

  @readonly
  find(selector) {
    let results = Yoru.A();
    this.get('documents').forEach(doc => {
      results.push(...doc.querySelectorAll(selector));
    });
    return results;
  }

  @readonly
  registerComponent(name, opts = {}) {
    this.shadowMaker.registerComponent(name, opts);
  }

  @readonly
  __setupServerListener() {
    try {
      this.ws = new WebSocket(`ws://${location.host}/yoru/server`);
      this.ws.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        if (data.status === 'closing') {
          Logger.info(
            'You will not see this, but the server told me to quit. See ya soon!'
          );
          window.open('', '_self').close();
          window.top.close();
        } else if (data.status === 'changed') {
          Logger.info('Files changed, reloading app');
          window.location.reload(true);
        }
      });
    } catch (err) {
      Logger.warn(err);
    }
  }

  @readonly
  __registerBuiltins() {
    for (let name in Builtins.default) {
      if (Builtins.default.hasOwnProperty(name)) {
        const builtin = Builtins.default[name];

        this.registerComponent(...builtin.component);
        const builtinTemplateContainer = document.createElement('template');
        builtinTemplateContainer.id = `yoru-${builtin.component[0]}`;
        builtinTemplateContainer.classList.add('yoru-builtin-component');
        builtinTemplateContainer.innerHTML = builtin.template;
        document.body.insertBefore(
          builtinTemplateContainer,
          document.body.firstChild
        );
      }
    }
  }
}

export default YoruApp;
