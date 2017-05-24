//
// 夜/追加/array.js
//

const YoruArrayPatches = function YoruArrayPatches() {
  Array.prototype.forEachPair = function(callback) {
    for (let i = 0; i < this.length; i += 2) {
      callback(this[i], this[i + 1]);
    }
    return this;
  };
};

export default YoruArrayPatches;
