//
// 夜/心/listener.js
//

import YoruObject from 'yoru/object';

export default class Listener extends YoruObject {

}

// (function() {
//   Logger.debug('Registering prototype extensions');
//   Function.prototype.listen = function() {
//     Array.from(arguments).forEach(source => {
//       ((src) => {
//         // ${this.get('objectId')}
//         console.log(this);
//         console.log(this.get);
//         window.addEventListener(`yoru.internal.${src}`, () => {
//           console.log(src);
//         });
//       })(source);
//     });
//     return this;
//   };
// })();
