'use strict';

import { mogrify } from '../';
import assert from 'assert';
import makeSure from 'make-sure';

const { isString, isNumber, isDate, isBoolean, isObject, isArray } = makeSure;

describe('Mogrifier', () => {

  describe('cast from a type to', () => {

    describe('String', () => {

      let assertions = [
        { to: String, from: 'Number', before: 1, after: '1' },
        { to: String, from: 'Number', before: 0, after: '0' },
        { to: String, from: 'Boolean', before: true, after: 'true' },
        { to: String, from: 'Boolean', before: false, after: 'false' },
        { to: String, from: 'Date', before: new Date(0), after: String(new Date(0)) }
      ];

      assertions.forEach(({ to, from, before, after }) =>
        it('from ' + from + ' ' + before, () =>
          assert.equal(mogrify(to, before), after)));

    }); // end cast String

    describe('Number', () => {

      let assertions = [
        { to: Number, from: 'String', before: '0', after: 0 },
        { to: Number, from: 'String', before: '1', after: 1 },
        { to: Number, from: 'Boolean', before: true, after: 1 },
        { to: Number, from: 'Boolean', before: false, after: 0 },
        { to: Number, from: 'Date', before: new Date(0), after: 0 }
      ];

      assertions.forEach(({ to, from, before, after }) =>
        it('from ' + from + ' ' + before, () =>
          assert.equal(mogrify(to, before), after)));

    }); // end cast Number

    describe('Boolean', () => {

      let assertions = [
        { to: Boolean, from: 'String', before: 'true', after: true },
        { to: Boolean, from: 'String', before: 'false', after: false },
        { to: Boolean, from: 'Number', before: 0, after: false },
        { to: Boolean, from: 'Number', before: 1, after: true }
      ];

      assertions.forEach(({ to, from, before, after }) =>
        it('from ' + from + ' ' + before, () =>
          assert.equal(mogrify(to, before), after)));

    }); // end cast Boolean

    describe('Date', () => {

      let assertions = [
        { to: Date, from: 'String', before: '1970-01-01T00:00:00.000Z', after: new Date(0) },
        { to: Date, from: 'Number', before: 0, after: new Date(0) }
      ];

      assertions.forEach(({ to, from, before, after }) =>
        it('from ' + from + ' ' + before, () =>
          assert.equal(mogrify(to, before).getTime(), after.getTime())));

    }); // end cast Date

  }); // end cast tests

  describe('a flat Array of items that should cast to ', () => {

    const Items = () => ([
      'string', '', '1', '0', 'true', 'false',
      1, 0,
      true, false,
      new Date(0)
    ]);

    let items = [];

    beforeEach(() => {
      items = new Items();
    });

    it('Strings', () => {
      let mogrifyd = mogrify([String], items);

      mogrifyd.forEach((value) => makeSure(value).is.a.String);

      let assertions = [
        'string', '', '1', '0', 'true', 'false',
        '1', '0',
        'true', 'false',
        new Date(0).toString()
      ];

      assertions.forEach((a, i) => assert.equal(mogrifyd[i], a));
    });

    it('Numbers', () => {
      let mogrifyd = mogrify([Number], items);

      mogrifyd.forEach((value) => makeSure(value).is.a.Number);

      let assertions = [
        NaN, 0, 1, 0, NaN, NaN,
        1, 0,
        1, 0,
        0
      ];

      assertions.forEach((a, i) => ((isNaN(a)) ? true : assert.equal(mogrifyd[i], a)));
    });

    it('Booleans', () => {
      let mogrifyd = mogrify([Boolean], items);

      mogrifyd.forEach((value) => makeSure(value).is.a.Boolean);

      let assertions = [
        true, false, true, true, true, false,
        true, false,
        true, false,
        true
      ];

      assertions.forEach((a, i) => ((isNaN(a)) ? true : assert.equal(mogrifyd[i], a)));
    });

    it('Dates', () => {
      let mogrifyd = mogrify([Date], items);

      mogrifyd.forEach((value) => ((isNaN(value.valueOf())) ? true : makeSure(value).is.a.Date));

      let assertions = [
        null, null, new Date('1'), new Date('0'), null, null,
        new Date(0), new Date(0),
        new Date(0), new Date(0),
        new Date(0)
      ];

      assertions.forEach((a, i) => ((a === null) ? true : assert.equal(mogrifyd[i].toString(), a.toString())));
    });

  }); // end flat array mogrification

  describe('a simple object should mogrify based on a model object', () => {

    let model =
      { str: String,      num: Number,      bln: Boolean,     dte: Date         };

    let inputs = [
      { str: '1',         num: '1',         bln: '0',         dte: '0'          },
      { str: 1,           num: 1,           bln: 0,           dte: 0            },
      { str: true,        num: false,       bln: true,        dte: false        },
      { str: new Date(0), num: new Date(0), bln: new Date(0), dte: new Date(0)  },
    ];

    inputs.forEach((input, i) => {
      it('should mogrify object input patter #' + i, () => {
        let mogrifyd = (mogrify(model, input));

        makeSure(mogrifyd.str).is.a.String;
        makeSure(mogrifyd.num).is.a.Number;
        makeSure(mogrifyd.bln).is.a.Boolean;
        makeSure(mogrifyd.dte).is.a.Date;
      });
    });

  }); // end simple object mogrification

  it('a nested object should mogrify based on a model object', () => {

    let model = {
      str: String,
      obj: {
        num: Number,
        otherObj: {
          bln: Boolean
        }
      }
    };

    let input = {
      str: true,
      obj: {
        num: '1',
        otherObj: {
          bln: 0
        }
      }
    };

    let mogrifyd = mogrify(model, input);

    makeSure(mogrifyd.str).is.a.String;
    makeSure(mogrifyd.obj).is.an.Object;
    makeSure(mogrifyd.obj.num).is.a.Number;
    makeSure(mogrifyd.obj.otherObj).is.an.Object;
    makeSure(mogrifyd.obj.otherObj.bln).is.a.Boolean;

    assert.equal(mogrifyd.str, 'true');
    assert.equal(mogrifyd.obj.num, 1);
    assert.equal(mogrifyd.obj.otherObj.bln, false);

  }); // end nested object mogrification

  it('an Object within an Array should mogrify based on the model', () => {
    let model = [{
      str: String,
      num: Number,
      bln: Boolean,
      dte: Date
    }];

    let input = [{
      str: true,
      num: '1',
      bln: 0,
      dte: 0
    }, {
      str: 0,
      num: true,
      bln: 'true',
      dte: new Date().toJSON()
    }];

    let mogrifyd = mogrify(model, input);

    mogrifyd.forEach((o, i) => {
      makeSure(o.str).is.a.String;
      makeSure(o.num).is.a.Number;
      makeSure(o.bln).is.a.Boolean;
      makeSure(o.dte).is.a.Date;
    });

  }); // end objects in arrays

  it('should make it possible to use custom functions', () => {
    let model = {
      cus: function(input) { return input + '-bar'; }
    };

    let input = {
      cus: 'foo'
    };

    let mogrifyd = mogrify(model, input);

    makeSure(mogrifyd.cus).is.a.String;

    assert.equal(mogrifyd.cus, 'foo-bar');
  });


});
