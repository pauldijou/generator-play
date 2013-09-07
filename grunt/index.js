'use strict';
var util = require('util');
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var PlayBase = require('../utils/play-base');

var GruntGenerator = module.exports = function GruntGenerator(args, options, config) {
  PlayBase.apply(this, arguments);
};

util.inherits(GruntGenerator, PlayBase);

GruntGenerator.prototype.gruntfile = function () {
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'cssPreprocessors',
    message: 'Do you want to use one or more CSS preprocessors?',
    choices: ['LESS', 'SASS', 'Stylus']
  },
  {
    type: 'checkbox',
    name: 'jsPreprocessors',
    message: 'Do you want to use one or more JavaScript preprocessors?',
    choices: ['CoffeeScript', 'TypeScript']
  }];

  this.prompt(prompts, function (props, err) {
    if (err) {
      return this.emit('error', err);
    }

    this.config.grunt = props;

    var gruntfile = this.readFileAsString(this.sourceRoot() + "/Gruntfile.js");
    gruntfile = this.safeEngine(gruntfile, this.config);
    this.writeFileFromString(gruntfile, "Gruntfile.js");

    cb();
  }.bind(this));
}
