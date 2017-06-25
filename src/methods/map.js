module.exports = function map(fn) {
  return new this.constructor(this.items.map((item, key) => fn(item, key)));
};
