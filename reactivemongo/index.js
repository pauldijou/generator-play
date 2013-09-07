'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var PlayBase = require('../utils/play-base');

var ReactivemongoGenerator = module.exports = function ReactivemongoGenerator(args, options, config) {
  PlayBase.apply(this, arguments);

  
};

util.inherits(ReactivemongoGenerator, PlayBase);

ReactivemongoGenerator.prototype.files = function files() {
  
};
