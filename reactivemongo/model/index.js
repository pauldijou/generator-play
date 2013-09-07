'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var ReactivemongoModelGenerator = module.exports = function ReactivemongoModelGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the model subgenerator with the argument ' + this.name + '.');
};

util.inherits(ReactivemongoModelGenerator, yeoman.generators.NamedBase);

ReactivemongoModelGenerator.prototype.files = function files() {
  this.copy('somefile.js', 'somefile.js');
};
