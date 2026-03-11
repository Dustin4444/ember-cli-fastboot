'use strict';

/**
 * A Map-like class that wraps arbitrary per-request user data passed to
 * FastBoot's `visit()` method, exposing it to the Ember application via
 * `fastboot.request.userdata.get(key)`.
 */
class FastBootUserdata {
  constructor(userdata) {
    this._data = userdata || {};
  }

  /**
   * Returns the value associated with the given key, or `undefined` if the
   * key is not present.
   *
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    return Object.hasOwn(this._data, key) ? this._data[key] : undefined;
  }

  /**
   * Returns `true` if the given key exists in the userdata.
   *
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return Object.hasOwn(this._data, key);
  }
}

module.exports = FastBootUserdata;
