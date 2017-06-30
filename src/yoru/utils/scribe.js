//
// 夜/Utils/Scribe
//

import YoruArray from 'yoru/extensions/array';

const Scribe = {
  upper: function(str = '') {
    return str.toUpperCase();
  },

  lower: function(str = '') {
    return str.toLowerCase();
  },

  capitalize: function(str = '') {
    return Scribe.upper(str.charAt(0)) + str.slice(1);
  },

  capitalizeStrict: function(str = '') {
    return Scribe.upper(str.charAt(0)) + Scribe.lower(str.slice(1));
  },

  capitalizeEach: function(str = '') {
    let words = YoruArray.from(str.split(/([-_/\\&,;:\s])/));
    return words
      .mapEachPair((word, separator) => {
        return Scribe.capitalize(word) + (separator || '');
      })
      .join('');
  },

  camelize: function(str = '') {
    let words = str.split(/[-_\s]|(?=[A-Z])/);
    return words
      .map(word => {
        return Scribe.capitalize(Scribe.lower(word));
      })
      .join('');
  },

  dasherize: function(str = '') {
    let words = str.split(/(?=[A-Z])/);
    return words
      .map(word => {
        return Scribe.lower(word);
      })
      .join('-');
  },

  constantize: function(str = '') {
    return Scribe.capitalize(Scribe.camelize(str));
  },
};

export default Scribe;
