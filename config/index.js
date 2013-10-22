'use strict';
var util = require('util');
var ConfigGenerator = require('../node_modules/generator-template/config/index.js');
var PlayBase = require('../utils/play-base');

// ----------------------------------------------------------------------------
// Generator configuration
// ----------------------------------------------------------------------------

var PlayConfigGenerator = module.exports = function PlayConfigGenerator(args, options, config) {
  PlayBase.apply(this, arguments);

  this.commands = this.configLoadCommands();
};

util.inherits(PlayConfigGenerator, PlayBase);

// ----------------------------------------------------------------------------
// Update the configuration
// ----------------------------------------------------------------------------

PlayConfigGenerator.prototype.doConfig = function () {
  ConfigGenerator.prototype.doConfig.call(this);
};