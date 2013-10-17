'use strict';
var util = require('util');
var TemplateGenerator = require('generator-template');
var PlayBase = require('../utils/play-base');

// ----------------------------------------------------------------------------
// Generator configuration
// ----------------------------------------------------------------------------

var PlayGenerator = module.exports = function PlayGenerator(args, options, config) {
  PlayBase.apply(this, arguments);

  this.config.app.secret = this._generateSecretKey();

  this.argument("templateName", {
    "required": false,
    "optional": true,
    "type": String
  });

  this.option("path", {
    "type": String
  });
};

util.inherits(PlayGenerator, PlayBase);

// ----------------------------------------------------------------------------
// Load the instance configuration
// ----------------------------------------------------------------------------

PlayGenerator.prototype.loadInstance = function () {
  TemplateGenerator.prototype.loadInstance.call(this, {defaultTemplateName: "new"});
};

// ----------------------------------------------------------------------------
// Say hello to the nice user
// ----------------------------------------------------------------------------

PlayGenerator.prototype.welcome = function () {
  TemplateGenerator.prototype.welcome.call(this);
};

// ----------------------------------------------------------------------------
// Handle prompts
// ----------------------------------------------------------------------------

PlayGenerator.prototype.prePrompts = function () {
  TemplateGenerator.prototype.prePrompts.call(this);
};

PlayGenerator.prototype.doPrompts = function () {
  TemplateGenerator.prototype.doPrompts.call(this);
};

PlayGenerator.prototype.postPrompts = function () {
  TemplateGenerator.prototype.postPrompts.call(this);
};

// ----------------------------------------------------------------------------
// Write files
// ----------------------------------------------------------------------------

PlayGenerator.prototype.writeFiles = function () {
  TemplateGenerator.prototype.writeFiles.call(this);
};

PlayGenerator.prototype.postWriteFiles = function () {
  TemplateGenerator.prototype.postWriteFiles.call(this);
};

// ----------------------------------------------------------------------------
// Update project configuration files
// ----------------------------------------------------------------------------

PlayGenerator.prototype.writeConfFiles = function () {
  TemplateGenerator.prototype.writeConfFiles.call(this);

  var constantsPath = this.paths.conf + '/constants.json';
  this.updateJson(constantsPath, 'constants');
};

PlayGenerator.prototype.postWriteConfFiles = function () {
  TemplateGenerator.prototype.postWriteConfFiles.call(this);
};

// ----------------------------------------------------------------------------
// Say goodbye and hope he will use you again...
// ----------------------------------------------------------------------------

PlayGenerator.prototype.bye = function () {
  TemplateGenerator.prototype.bye.call(this);
};

// ----------------------------------------------------------------------------
// Private utils
// ----------------------------------------------------------------------------

PlayGenerator.prototype._generateSecretKey = function (length) {
  length = length || 64;
  var secretKey = "";

  for (var i = 0; i < length; ++i) {
    secretKey += String.fromCharCode(Math.floor(this._.random(74)) + 48);
  }

  return secretKey.replace("\\", "/");
};
