'use strict';
var util = require('util');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var yeoman = require('yeoman-generator');
var PlayBase = require('../utils/play-base');

var PRIVATE_PREFIX = "__";

var TemplateGenerator = module.exports = function TemplateGenerator(args, options, config) {
  PlayBase.apply(this, arguments);

  this.argument("templateName", {});

  this.option("path", {});
};

util.inherits(TemplateGenerator, PlayBase);

TemplateGenerator.prototype.findPath = function () {
  var self = this;

  if (this.options.path && !this.templateName) {
    this.config.template = this.config.template || {};
    this.config.template.paths = _.uniq((this.config.template.paths || []).push(this.options.path));
  } else if(this.options.path) {
    this.templatePath = path.join(this.options.path, this.templateName);
  } else {
    var paths = (this.config.template && this.config.template.paths) || [];
    paths.push( this.sourceRoot() );

    this.templatePaths = _.map(paths, function (templatePath) {
        return path.join(templatePath, self.templateName);
      }
    );

    _.forEach(this.templatePaths, function (templatePath) {
      if (!self.templatePath && self.existsFile(templatePath)) {
        self.templatePath = templatePath;
      }
    });
  }
};

TemplateGenerator.prototype.configJson = function () {
  if (this.templatePath) {
    this.templateJson = this.readFileAsJson(path.join(this.templatePath, PRIVATE_PREFIX + "config.json"), {});
  }
};

TemplateGenerator.prototype.welcome = function () {
  if (this.templateJson && this.templateJson.welcome) {
    _.forEach(this.templateJson.welcome, function (w) {
      this._log(w.status, w.message);
    }.bind(this))
  }
};

TemplateGenerator.prototype.ask = function () {
  if (this.templateJson && this.templateJson.prompts) {
    var cb = this.async();

    this.templateProps = {};

    this.prompt(this.templateJson.prompts, function (props, err) {
      if (err) {
        return this.emit('error', err);
      }

      this.templateProps = props;
      this.log.write();

      cb();
    }.bind(this));
  }
};

TemplateGenerator.prototype.writeFiles = function () {
  if (this.templatePath) {
    this._writeDir(this.templatePath);
  }
};

TemplateGenerator.prototype.bye = function () {
  if (this.templateJson && this.templateJson.bye) {
    _.forEach(this.templateJson.bye, function (w) {
      this._log(w.status, w.message);
    }.bind(this))
  }
};

TemplateGenerator.prototype._writeDir = function (currentPath) {
  var self = this;
  var files = fs.readdirSync(currentPath);
  _(files)
    .reject(function (file) {
      return file.indexOf(PRIVATE_PREFIX) === 0;
    })
    .forEach(function (file) {
      var filePath = path.join(currentPath, file);
      var stat = fs.statSync(filePath);
      stat.isDirectory() ? self._writeDir(filePath) : self._writeFile(filePath);
    }); 
};

TemplateGenerator.prototype._writeFile = function (filePath) {
  var destinationPath = this.underscoreEngine(filePath, this.templateProps).replace(this.templatePath, this.paths.root);
  this.template(filePath, destinationPath, this.templateProps);
};

TemplateGenerator.prototype._log = function (status, message) {
  if (message) {
    this.log[status](message);
  } else {
    this.log[status]();
  }
};
