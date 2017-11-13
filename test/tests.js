'use strict';

const it = require('mocha').it;
const chai = require('chai');
const expect = require('chai').expect;
const collect = require('../dist');
const dataset = require('./data');

describe('Collect.js Test Suite', function () {






























































































































  it('should return true if the collection is not empty; otherwise, false is returned', function () {
    expect(collect().isNotEmpty()).to.eql(false);
    expect(collect([]).isNotEmpty()).to.eql(false);
    expect(collect([1]).isNotEmpty()).to.eql(true);
  });

  it('should filter the collection by a given key / value not contained within the given array', function () {
    const data = [
      { product: 'Desk', price: 200 },
      { product: 'Chair', price: 100 },
      { product: 'Bookcase', price: 150 },
      { product: 'Door', price: 100 }
    ];

    const collection = collect(data);

    const filtered = collection.whereNotIn('price', ['150', 200]);

    expect(filtered.all()).to.eql([
      { product: 'Chair', price: 100 },
      { product: 'Bookcase', price: 150 },
      { product: 'Door', price: 100 }
    ]);

    expect(collection.all()).to.eql(data);
  });

  it('should separate elements that pass a given truth test from those that do not', function () {
    const collection = collect([1, 2, 3, 4, 5, 6]);

    const arr = collection.partition(function (i) {
      return i < 3;
    });

    expect(arr[0]).to.eql([1, 2]);
    expect(arr[1]).to.eql([3, 4, 5, 6]);
    expect(collection.all()).to.eql([1, 2, 3, 4, 5, 6]);
  });

  it('should split a collection into the given number of groups', function () {
    const collection = collect([1, 2, 3, 4, 5]);

    expect(collection.split(1)).to.eql([[1, 2, 3, 4, 5]]);
    expect(collection.split(2)).to.eql([[1, 2, 3], [4, 5]]);
    expect(collection.split(3)).to.eql([[1, 2], [3, 4], [5]]);
    expect(collection.split(6)).to.eql([[1], [2], [3], [4], [5], []]);

    expect(collection.all()).to.eql([1, 2, 3, 4, 5]);
  });

  it('should execute the given callback when the first argument given to the method evaluates to true', function () {
    const collection = collect([1, 2, 3]);

    collection.when(true, function (c) {
      c.push(4);
    });

    expect(collection.all()).to.eql([1, 2, 3, 4]);

    collection.when(false, function (c) {
      c.push(5);
    }, function (c) {
      c.push(6);
    });

    expect(collection.all()).to.eql([1, 2, 3, 4, 6]);
  });

  it('should execute the given callback when the first argument given to the method evaluates to false', function () {
    const collection = collect([1, 2, 3]);

    collection.unless(false, function (c) {
      c.push(4);
    });

    expect(collection.all()).to.eql([1, 2, 3, 4]);

    collection.unless(true, function (c) {
      c.push(5);
    }, function (c) {
      c.push(6);
    });

    expect(collection.all()).to.eql([1, 2, 3, 4, 6]);
  });

  it('should create a new collection by invoking the callback a given amount of times', function () {
    const collection = collect().times(10, function (number) {
      return number * 9;
    });

    expect(collection.all()).to.eql([9, 18, 27, 36, 45, 54, 63, 72, 81, 90]);
  });

  it('should passes the collection to the given callback', function () {
    let tapped = null;

    const number = collect([2, 4, 3, 1, 5])
      .sort()
      .tap(function (collection) {
        tapped = collection.all();
      })
      .shift();

    expect(tapped).to.eql([2, 3, 4, 5]);
    expect(number).to.eql(1);
  });

  it('should be able to register a custom macro/method', function () {
    collect().macro('uppercase', function () {
      return this.map(function (item) {
        return item.toUpperCase();
      });
    });

    const collection = collect(['a', 'b', 'c']);
    expect(collection.uppercase().all()).to.eql(['A', 'B', 'C']);
    expect(collection.all()).to.eql(['a', 'b', 'c']);

    collect().macro('prefix', function (prefix) {
      return this.map(function (item) {
        return prefix + item;
      });
    });

    expect(collect(['a', 'b', 'c']).prefix('xoxo').all()).to.eql(['xoxoa', 'xoxob', 'xoxoc']);
  });

  it('should convert the collection into a plain array', function () {
    const collectionArray = collect([1, 2, 3, 'b', 'c', 'ø']);

    expect(collectionArray.toArray()).to.eql([1, 2, 3, 'b', 'c', 'ø']);
    expect(collectionArray.toArray()).to.eql(collectionArray.all());

    const collectionObject = collect({
      name: 'Elon Musk',
      companies: [
        'Tesla',
        'Space X',
        'SolarCity'
      ]
    });

    expect(collectionObject.toArray()).to.eql(['Elon Musk', ['Tesla', 'Space X', 'SolarCity']]);
    expect(collectionObject.toArray()).to.eql(collectionObject.values().all());
  });

  it('should append arrays to collection', function () {
    const expected = [
      4,
      5,
      6,
      'a',
      'b',
      'c',
      'Jonny',
      'from',
      'Laroe',
      'Jonny',
      'from',
      'Laroe'
    ];

    const firstCollection = collect([4, 5, 6]);
    const firstArray = ['a', 'b', 'c'];
    const secondArray = [{
      who: 'Jonny'
    }, {
      preposition: 'from'
    }, {
      where: 'Laroe'
    }];
    const firstObj = {
      who: 'Jonny',
      preposition: 'from',
      where: 'Laroe'
    };

    firstCollection.concat(firstArray).concat(secondArray).concat(firstObj);

    expect(firstCollection.count()).to.eql(12);
    expect(firstCollection.all()).to.eql(expected);
  });

  it('should append collections to collection', function () {
    const expected = [
      4,
      5,
      6,
      'a',
      'b',
      'c',
      'Jonny',
      'from',
      'Laroe',
      'Jonny',
      'from',
      'Laroe'
    ];

    const firstCollection = collect([4, 5, 6]);
    const secondCollection = collect(['a', 'b', 'c']);
    const thirdCollection = collect([{
      who: 'Jonny'
    }, {
      preposition: 'from'
    }, {
      where: 'Laroe'
    }]);

    firstCollection
      .concat(secondCollection)
      .concat(thirdCollection)
      .concat(thirdCollection);

    expect(firstCollection.count()).to.eql(12);
    expect(firstCollection.all()).to.eql(expected);
  });

  it('should wrap the given value in a collection if applicable', function () {
    const collection1 = collect().wrap('foo');
    expect(collection1.all()).to.eql(['foo']);

    const collection2 = collect().wrap(['foo']);
    expect(collection2.all()).to.eql(['foo']);

    const collection3 = collect().wrap({});
    expect(collection3.all()).to.eql([{}]);

    const collection4 = collect().wrap(collect([1, 2, 3, 4]));
    expect(collection4.all()).to.eql([1, 2, 3, 4]);
  });

  it('should get the underlying items from the given collection if applicable', function () {
    const collection1 = collect(['foo']);
    expect(collect().unwrap(collection1)).to.eql(['foo']);

    expect(collect().unwrap(['foo'])).to.eql(['foo']);

    expect(collect().unwrap('foo')).to.eql('foo');
  });

  it('should cross join with the given lists, returning all possible permutations', function () {
    const crossJoin1 = collect([1, 2]).crossJoin(['a', 'b']);
    expect(crossJoin1.all()).to.eql([[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]);

    const crossJoin2 = collect([1, 2]).crossJoin(collect(['a', 'b']));
    expect(crossJoin2.all()).to.eql([[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]);

    const crossJoin3 = collect([1, 2]).crossJoin(collect(['a', 'b']), ['I', 'II']);
    expect(crossJoin3.all()).to.eql([
      [1, 'a', 'I'], [1, 'a', 'II'],
      [1, 'b', 'I'], [1, 'b', 'II'],
      [2, 'a', 'I'], [2, 'a', 'II'],
      [2, 'b', 'I'], [2, 'b', 'II'],
    ]);

    const crossJoin4 = collect([1, 2]).crossJoin(['a', 'b'], ['I', 'II']);
    expect(crossJoin4.all()).to.eql([
      [1, 'a', 'I'], [1, 'a', 'II'],
      [1, 'b', 'I'], [1, 'b', 'II'],
      [2, 'a', 'I'], [2, 'a', 'II'],
      [2, 'b', 'I'], [2, 'b', 'II'],
    ]);
  });

  it('should get the items in the collection whose keys and values are not present in the given items', function () {
    const collection1 = collect({ id: 1, first_word: 'Hello', not_affected: 'value' });
    const collection2 = collect({ id: 123, foo_bar: 'Hello', not_affected: 'value' });

    expect({ id: 1, first_word: 'Hello' }).to.eql(collection1.diffAssoc(collection2).all());

    const collection3 = collect({
      color: 'orange',
      type: 'fruit',
      remain: 6,
    });

    const collection4 = collection3.diffAssoc({
      color: 'yellow',
      type: 'fruit',
      remain: 3,
      used: 6,
    });

    expect(collection4.all()).to.eql({ color: 'orange', remain: 6 });
  });

  it('should map a collection to groups', function () {
    const data = collect([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'B' },
    ]);

    const groups = data.mapToGroups(function (item, key) {
      return [item.name, item.id];
    });

    expect(groups.all()).to.eql({
      A: [1],
      B: [2, 4],
      C: [3],
    });
  });

  it('should map into a class', function () {
    const Person = function (name) {
      this.name = name;
    };

    const collection = collect(['Firmino', 'Mané']);

    const data = collection.mapInto(Person);

    expect(data.all()).to.be.array;
    expect(data.first()).to.eql(new Person('Firmino'));
    expect(data.last()).to.eql(new Person('Mané'));
  });

  it('should console log the collection', function () {
    const originalCosoleLog = console.log;

    const consoleLogCalls = [];

    console.log = function (values) {
      consoleLogCalls.push(values);
      return values;
    };

    const collection = collect([1, 2, 3]);
    collection.dump();

    const collection2 = collect({
      name: 'Sadio Mané',
      number: 19,
    });

    collection2.dump();

    console.log = originalCosoleLog;
    expect(consoleLogCalls[0]).to.eql(collection.all());

    expect(consoleLogCalls[1]).to.eql(collection2.all());
  });

  it('should be iterable', function () {
    let result = '';

    for (let item of collect([1, 2, 3, 4, 5])) {
      result += item;
    }

    expect(result).to.eql('12345');

    const result2 = [];
    const clubs = collect([{ name: 'Liverpool' }, { name: 'Arsenal' }, { name: 'Chelsea' }]);

    for (let club of clubs) {
      result2.push(club);
    }

    expect(result2).to.eql(clubs.all());
  });
});
