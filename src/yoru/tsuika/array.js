//
// 夜/追加/array.js
//

/**
* YoruArray - Extension of native JavaScript arrays
* @extends Array
*/
export default class YoruArray extends Array {
  constructor() {
    super(...arguments);
    this.__native_extention__ = true;
    this.__superclass__ = Array;
  }

  /**
   * @static isYoruArray - Checks if the parameter is a YoruArray instance
   *
   * @param {any} el The element to test
   *
   * @returns {boolean} The result
   */
  static isYoruArray(el) {
    return el.constructor.name === YoruArray.prototype.constructor.name;
  }

  /**
   * forEachPair - Iterates over each pair of elements
   *
   * @param  {function} callback - The callback to apply to each pair
   * @returns {YoruArray} The YoruArray instance
   */
  forEachPair(callback) {
    for (let i = 0; i < this.length; i += 2) {
      callback(this[i], this[i + 1]);
    }
    return this;
  }

  /**
   * sample - Returns a random element from the array
   *
   * @returns {any} A random element from the array
   */
  sample() {
    return this[Math.floor(Math.random() * this.length)];
  }

  /**
   * toNative - Returns a native JavaScript array with the same contents
   *
   * @returns {Array} The native array
   */
  toNative() {
    return this.__superclass__.from(this);
  }

  /**
   * first - Returns the first element of the array
   *
   * Is equivalent to array[0]
   *
   * @returns {any} the first element of the array
   */
  first() {
    return this[0];
  }

  /**
   * last - Returns the last element of the array
   *
   * Is equivalent to array[array.length - 1]
   *
   * @returns {any} the last element of the array
   */
  last() {
    return this[this.length - 1];
  }

  /**
   * compact - Removes null and undefined values from the array
   *
   * @returns {YoruArray} The compacted array
   */
  compact() {
    return this.filter(el => {
      if (el !== null && typeof el !== typeof void 0) {
        return el;
      }
    });
  }

  /**
   * count - Counts elements in the array
   *
   * Given no parameters, returns the length of the array
   * Given any value, returns the count of that value in the array
   * Given a callback, returns the count of elements that match the given
   *  comparison function
   *
   * Can not count `undefined' elements
   *
   * @param {any|function} elementOrCallback The element to compare to,
   *  or the callback to use for comparison
   *
   * @returns {number} The element count
   */
  count(elementOrCallback) {
    const __compare = function __compare(elementOrCallback, el) {
      if (typeof elementOrCallback === typeof (() => {})) {
        return elementOrCallback(el);
      }
      return el === elementOrCallback;
    };

    if (typeof elementOrCallback === typeof void 0) {
      return this.length;
    }

    let count = 0;
    this.forEach(el => {
      if (__compare(elementOrCallback, el)) {
        count++;
      }
    });
    return count;
  }

  /**
   * delete - Deletes the given elements from the array
   *
   * Does not mutate the array instance
   *
   * @param {any} element The element to remove from the array
   *
   * @returns {YoruArray} The resulting array
   */
  delete(element) {
    return this.reduce((acc, el) => {
      if (el !== element) {
        acc.push(el);
      }
      return acc;
    }, new YoruArray());
  }

  /**
   * deleteAt - Deletes the element at the given index
   *
   * Does not mutate the array intance
   *
   * @param {number} index The position of the element to remove
   *
   * @returns {YoruArray} The resulting array
   */
  deleteAt(index) {
    let clone = YoruArray.from(this);
    clone.splice(index, 1);
    return clone;
  }

  /**
   * deleteIf - Deletes elements that match the comparison callback
   *
   * Does not mutate the array instance
   *
   * @param {function} callback The callback to use as comparison
   *
   * @returns {YoruArray} The resulting array
   */
  deleteIf(callback) {
    return this.reduce((acc, el) => {
      if (!callback(el)) {
        acc.push(el);
      }
      return acc;
    }, new YoruArray());
  }

  /**
   * keepIf - Keeps elements that match the comparison callback
   *
   * This is the opposite of YoruArray#deleteIf
   *
   * @param {function} callback The callback to use as comparison
   *
   * @returns {YoruArray} The resulting array
   */
  keepIf(callback) {
    return this.deleteIf(el => {
      return !callback(el);
    });
  }

  /**
   * isEmpty - Returns whether or not the array contains no elements
   *
   * @returns {boolean} The result
   */
  isEmpty() {
    return this.length === 0;
  }

  /**
   * flatten - Returns a new array that is a one-dimentional flattening
   *  of this array
   *
   * Does not mutate the array instance
   *
   * @returns {YoruArray} The flattened array
   */
  flatten() {
    return this.reduce((acc, el) => {
      if (YoruArray.isYoruArray(el)) {
        return acc.concat(el.flatten());
      } else if (this.__superclass__.isArray(el)) {
        return acc.concat(YoruArray.from(el).flatten());
      }
      return acc.concat(el);
    }, new YoruArray());
  }

  /**
   * shuffle - Randomizes the array elements' position
   *
   * Does not mutate the array instance
   *
   * @returns {YoruArray} The shuffled array
   */
  shuffle() {
    let clone = YoruArray.from(this);
    for (let i = clone.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [clone[i - 1], clone[j]] = [clone[j], clone[i - 1]];
    }
    return clone;
  }

  /**
   * unique - Returns a new array by removing duplicate values
   *
   * Does not mutate the array instance
   *
   * @returns {YoruArray} The resulting array
   */
  unique() {
    return this.reduce((acc, el) => {
      if (!acc.includes(el)) {
        acc.push(el);
      }
      return acc;
    }, new YoruArray());
  }

  /**
   * union - Returns a new array containing the values from this array and the
   *  parameter, without duplicates
   *
   * Does not mutate the array instance nor the parameters
   *
   * @returns {YoruArray} The resulting array
   */
  union() {
    return this.concat(YoruArray.from(...arguments)).unique();
  }

  /**
   * intersect - Returns a new array containing the values present in
   *  both this array and the parameter, without duplicates
   *
   * Does not mutate the array instance nor the parameters
   *
   * @returns {YoruArray} The resulting array
   */
  intersect(other) {
    other = YoruArray.from(other);
    return this.union(other).reduce((acc, el) => {
      if (this.includes(el) && other.includes(el)) {
        acc.push(el);
      }
      return acc;
    }, new YoruArray());
  }

  /**
   * difference - Returns a new array containing the values NOT present
   *  in both this array and the parameter, without duplicates
   *
   * Does not mutate the array instance nor the parameters
   *
   * @returns {YoruArray} The resulting array
   */
  difference(other) {
    other = YoruArray.from(other);
    return this.union(other).reduce((acc, el) => {
      if (!this.includes(el) || !other.includes(el)) {
        acc.push(el);
      }
      return acc;
    }, new YoruArray());
  }
}
