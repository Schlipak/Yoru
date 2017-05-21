// 小物/scribe.js

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

  camelize: function(str = '') {
    let words = str.split(/[-_\s]/);
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
};

export default Scribe;
