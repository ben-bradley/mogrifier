'use strict';

var _ = require('../');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _makeSure = require('make-sure');

var _makeSure2 = _interopRequireDefault(_makeSure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isString = _makeSure2.default.isString;
var isNumber = _makeSure2.default.isNumber;
var isDate = _makeSure2.default.isDate;
var isBoolean = _makeSure2.default.isBoolean;
var isObject = _makeSure2.default.isObject;
var isArray = _makeSure2.default.isArray;


describe('Mogrifier', function () {

  describe('cast from a type to', function () {

    describe('String', function () {

      var assertions = [{ to: String, from: 'Number', before: 1, after: '1' }, { to: String, from: 'Number', before: 0, after: '0' }, { to: String, from: 'Boolean', before: true, after: 'true' }, { to: String, from: 'Boolean', before: false, after: 'false' }, { to: String, from: 'Date', before: new Date(0), after: String(new Date(0)) }];

      assertions.forEach(function (_ref) {
        var to = _ref.to;
        var from = _ref.from;
        var before = _ref.before;
        var after = _ref.after;
        return it('from ' + from + ' ' + before, function () {
          return _assert2.default.equal((0, _.mogrify)(to, before), after);
        });
      });
    }); // end cast String

    describe('Number', function () {

      var assertions = [{ to: Number, from: 'String', before: '0', after: 0 }, { to: Number, from: 'String', before: '1', after: 1 }, { to: Number, from: 'Boolean', before: true, after: 1 }, { to: Number, from: 'Boolean', before: false, after: 0 }, { to: Number, from: 'Date', before: new Date(0), after: 0 }];

      assertions.forEach(function (_ref2) {
        var to = _ref2.to;
        var from = _ref2.from;
        var before = _ref2.before;
        var after = _ref2.after;
        return it('from ' + from + ' ' + before, function () {
          return _assert2.default.equal((0, _.mogrify)(to, before), after);
        });
      });
    }); // end cast Number

    describe('Boolean', function () {

      var assertions = [{ to: Boolean, from: 'String', before: 'true', after: true }, { to: Boolean, from: 'String', before: 'false', after: false }, { to: Boolean, from: 'Number', before: 0, after: false }, { to: Boolean, from: 'Number', before: 1, after: true }];

      assertions.forEach(function (_ref3) {
        var to = _ref3.to;
        var from = _ref3.from;
        var before = _ref3.before;
        var after = _ref3.after;
        return it('from ' + from + ' ' + before, function () {
          return _assert2.default.equal((0, _.mogrify)(to, before), after);
        });
      });
    }); // end cast Boolean

    describe('Date', function () {

      var assertions = [{ to: Date, from: 'String', before: '1970-01-01T00:00:00.000Z', after: new Date(0) }, { to: Date, from: 'Number', before: 0, after: new Date(0) }];

      assertions.forEach(function (_ref4) {
        var to = _ref4.to;
        var from = _ref4.from;
        var before = _ref4.before;
        var after = _ref4.after;
        return it('from ' + from + ' ' + before, function () {
          return _assert2.default.equal((0, _.mogrify)(to, before).getTime(), after.getTime());
        });
      });
    }); // end cast Date
  }); // end cast tests

  describe('a flat Array of items that should cast to ', function () {

    var Items = function Items() {
      return ['string', '', '1', '0', 'true', 'false', 1, 0, true, false, new Date(0)];
    };

    var items = [];

    beforeEach(function () {
      items = new Items();
    });

    it('Strings', function () {
      var mogrifyd = (0, _.mogrify)([String], items);

      mogrifyd.forEach(function (value) {
        return (0, _makeSure2.default)(value).is.a.String;
      });

      var assertions = ['string', '', '1', '0', 'true', 'false', '1', '0', 'true', 'false', new Date(0).toString()];

      assertions.forEach(function (a, i) {
        return _assert2.default.equal(mogrifyd[i], a);
      });
    });

    it('Numbers', function () {
      var mogrifyd = (0, _.mogrify)([Number], items);

      mogrifyd.forEach(function (value) {
        return (0, _makeSure2.default)(value).is.a.Number;
      });

      var assertions = [NaN, 0, 1, 0, NaN, NaN, 1, 0, 1, 0, 0];

      assertions.forEach(function (a, i) {
        return isNaN(a) ? true : _assert2.default.equal(mogrifyd[i], a);
      });
    });

    it('Booleans', function () {
      var mogrifyd = (0, _.mogrify)([Boolean], items);

      mogrifyd.forEach(function (value) {
        return (0, _makeSure2.default)(value).is.a.Boolean;
      });

      var assertions = [true, false, true, true, true, false, true, false, true, false, true];

      assertions.forEach(function (a, i) {
        return isNaN(a) ? true : _assert2.default.equal(mogrifyd[i], a);
      });
    });

    it('Dates', function () {
      var mogrifyd = (0, _.mogrify)([Date], items);

      mogrifyd.forEach(function (value) {
        return isNaN(value.valueOf()) ? true : (0, _makeSure2.default)(value).is.a.Date;
      });

      var assertions = [null, null, new Date('1'), new Date('0'), null, null, new Date(0), new Date(0), new Date(0), new Date(0), new Date(0)];

      assertions.forEach(function (a, i) {
        return a === null ? true : _assert2.default.equal(mogrifyd[i].toString(), a.toString());
      });
    });
  }); // end flat array mogrification

  describe('a simple object should mogrify based on a model object', function () {

    var model = { str: String, num: Number, bln: Boolean, dte: Date };

    var inputs = [{ str: '1', num: '1', bln: '0', dte: '0' }, { str: 1, num: 1, bln: 0, dte: 0 }, { str: true, num: false, bln: true, dte: false }, { str: new Date(0), num: new Date(0), bln: new Date(0), dte: new Date(0) }];

    inputs.forEach(function (input, i) {
      it('should mogrify object input patter #' + i, function () {
        var mogrifyd = (0, _.mogrify)(model, input);

        (0, _makeSure2.default)(mogrifyd.str).is.a.String;
        (0, _makeSure2.default)(mogrifyd.num).is.a.Number;
        (0, _makeSure2.default)(mogrifyd.bln).is.a.Boolean;
        (0, _makeSure2.default)(mogrifyd.dte).is.a.Date;
      });
    });
  }); // end simple object mogrification

  it('a nested object should mogrify based on a model object', function () {

    var model = {
      str: String,
      obj: {
        num: Number,
        otherObj: {
          bln: Boolean
        }
      }
    };

    var input = {
      str: true,
      obj: {
        num: '1',
        otherObj: {
          bln: 0
        }
      }
    };

    var mogrifyd = (0, _.mogrify)(model, input);

    (0, _makeSure2.default)(mogrifyd.str).is.a.String;
    (0, _makeSure2.default)(mogrifyd.obj).is.an.Object;
    (0, _makeSure2.default)(mogrifyd.obj.num).is.a.Number;
    (0, _makeSure2.default)(mogrifyd.obj.otherObj).is.an.Object;
    (0, _makeSure2.default)(mogrifyd.obj.otherObj.bln).is.a.Boolean;

    _assert2.default.equal(mogrifyd.str, 'true');
    _assert2.default.equal(mogrifyd.obj.num, 1);
    _assert2.default.equal(mogrifyd.obj.otherObj.bln, false);
  }); // end nested object mogrification

  it('an Object within an Array should mogrify based on the model', function () {
    var model = [{
      str: String,
      num: Number,
      bln: Boolean,
      dte: Date
    }];

    var input = [{
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

    var mogrifyd = (0, _.mogrify)(model, input);

    mogrifyd.forEach(function (o, i) {
      (0, _makeSure2.default)(o.str).is.a.String;
      (0, _makeSure2.default)(o.num).is.a.Number;
      (0, _makeSure2.default)(o.bln).is.a.Boolean;
      (0, _makeSure2.default)(o.dte).is.a.Date;
    });
  }); // end objects in arrays

  it('should make it possible to use custom functions', function () {
    var model = {
      cus: function cus(input) {
        return input + '-bar';
      }
    };

    var input = {
      cus: 'foo'
    };

    var mogrifyd = (0, _.mogrify)(model, input);

    (0, _makeSure2.default)(mogrifyd.cus).is.a.String;

    _assert2.default.equal(mogrifyd.cus, 'foo-bar');
  });
});