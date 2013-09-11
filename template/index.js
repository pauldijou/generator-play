'use strict';
var util = require('util');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var yeoman = require('yeoman-generator');
var PlayBase = require('../utils/play-base');

var TemplateGenerator = module.exports = function TemplateGenerator(args, options, config) {
  PlayBase.apply(this, arguments);
  
  this.argument("templateName", {
    "type": String,
    "required": false,
    "optional": true
  });

  this.option("path", {
    "type": String,
    "default": true
  });

  this.option("config", {
    "type": String,
    "default": "config.json"
  });
};

util.inherits(TemplateGenerator, PlayBase);

TemplateGenerator.prototype.findPath = function () {
  this.options.config = this.options.config || "config.json";

  if (this.options.path && !this.templateName) {
    this.config.template = this.config.template || {};
    this.config.template.paths = _.uniq((this.config.template.paths || []).push(this.options.path));
  } else if(this.options.path) {
    this.templatePath = path.join(this.options.path, this.templateName);
  } else {
    var paths = (this.config.template && this.config.template.paths) || [];
    paths.push( this.sourceRoot() );

    this.templatePaths = _.map(paths, function (templatePath) {
        return path.join(templatePath, this.templateName);
      }.bind(this)
    );

    _.forEach(this.templatePaths, function (templatePath) {
      if (!this.templatePath && this.existsFile(templatePath)) {
        this.templatePath = templatePath;
      }
    }.bind(this));
  }
};

TemplateGenerator.prototype.configJson = function () {
  if (this.templatePath) {
    this.config = this.readFileAsJson(path.join(this.templatePath, this.options.config), {});
  }
};

TemplateGenerator.prototype.welcome = function () {
  if (this.config && this.config.welcome) {
    _.forEach(this.config.welcome, function (w) {
      this._log(w.status, w.message);
    }.bind(this))
  }
};

TemplateGenerator.prototype.ask = function () {
  if (this.config && this.config.prompts) {
    var cb = this.async();

    this.properties = {};

    this.prompt(this.config.prompts, function (props, err) {
      if (err) {
        return this.emit('error', err);
      }

      this.properties = props;
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
  if (this.config && this.config.bye) {
    _.forEach(this.config.bye, function (w) {
      this._log(w.status, w.message);
    }.bind(this))
  }
};

TemplateGenerator.prototype._writeDir = function (currentPath) {
  var files = fs.readdirSync(currentPath);
  _(files)
    .map(function (file) {
      return path.join(currentPath, file);
    })
    .reject(function (filePath) {
      var relativeFilePath = filePath.substr(this.templatePath.length + 1);
      return this.config.files
        && this.config.files[relativeFilePath]
        && this.config.files[relativeFilePath].excluded
        && eval(this.config.files[relativeFilePath].excluded);
    }.bind(this))
    .forEach(function (filePath) {
      var stat = fs.statSync(filePath);
      stat.isDirectory() ? this._writeDir(filePath) : this._writeFile(filePath);
    }.bind(this)); 
};

TemplateGenerator.prototype._writeFile = function (filePath) {
  var destinationPath = this.underscoreEngine(filePath, this.properties).replace(this.templatePath, this.paths.root);
  this.template(filePath, destinationPath, this.properties);
};


