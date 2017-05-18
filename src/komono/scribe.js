// 小物/scribe.js

export default class Scribe {
  static upper(str = '') {
    return str.toUpperCase();
  }

  static lower(str = '') {
    return str.toLowerCase();
  }

  static capitalize(str = '') {
    return Scribe.upper(str.charAt(0)) + str.slice(1);
  }

  static camelize(str = '') {
    let words = str.split(/[-_\s]/);
    return words.map(word => {
      return Scribe.capitalize(Scribe.lower(word));
    }).join('');
  }

  static dasherize(str = '') {
    let words = str.split(/(?=[A-Z])/);
    return words.map(word => {
      return Scribe.lower(word);
    }).join('-');
  }
}
