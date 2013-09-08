var _ = require("lodash");

exports.toInt = function () {
  return function (input) {
    return _.parseInt(input);
  }
}

exports.toBoolean = function () {
  return function (input) {
    return !!input;
  }
}

exports.toUndefined = function () {
  return function (input) {
    if (input === "") {
      return undefined;
    } else {
      return input;
    }
  }
}

exports.required = function (msg) {
  return function (input) {
    if (exports.toUndefined()(input) === undefined) {
      return msg || "You must enter a value."
    } else {
      return true;
    }
  }
}

exports.regex = function (regex) {
  return function (input) {
    if (regex.test(input)) {
      return true;
    } else {
      return msg || "You must enter a value."
    }
  }
}
