'use strict';
var util = require('util');
var yeoman = require('play-base');

function PlayNamedBase(args, options) {
  PlayBase.apply(this, arguments);
  this.argument('name', { type: String, required: true });
}

util.inherits(PlayNamedBase, PlayBase);
module.exports = PlayNamedBase;