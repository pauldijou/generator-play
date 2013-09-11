'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var PlayBase = require('../utils/play-base');

// ----------------------------------------------------------------------------
// Generator configuration
// ----------------------------------------------------------------------------

var PlayGenerator = module.exports = function PlayGenerator(args, options, config) {
  PlayBase.apply(this, arguments);

  this.config.app.secret = this._generateSecretKey();

  this.argument("instanceName", {
    "required": true,
    "optional": false,
    "type": String
  });

  this.option("path", {
    "type": String
  });

  this.option("config", {
    "type": String,
    "default": "config.js"
  });
};

util.inherits(PlayGenerator, PlayBase);

// ----------------------------------------------------------------------------
// Load the instance configuration
// ----------------------------------------------------------------------------

PlayGenerator.prototype.loadInstance = function () {

  this.instance = {};
  this.instance.global = this.config;
  this.instance.path = path.join( this.options.path || this.sourceRoot(), this.instanceName );
  this.instance.config = require( path.join(this.instance.path, this.options.config || "config.js") );

  if (!this.instance.config) {
    return this.emit("error", "No config file found for name '" + this.instanceName + "' at path '" + instance.path + "'");
  }

};

// ----------------------------------------------------------------------------
// Say hello to the nice user
// ----------------------------------------------------------------------------

PlayGenerator.prototype.welcome = function () {
  if (this.instance.config && this.instance.config.welcome) {
    _.forEach(this.instance.config.welcome, function (w) {
      this._log(w.status, w.message);
    }.bind(this))
  }
};

// ----------------------------------------------------------------------------
// Handle prompts
// ----------------------------------------------------------------------------

PlayGenerator.prototype.prePrompts = function () {
  if (this.instance.config && this.instance.config.prePrompts) {
    this.instance.config.prePrompts.call(this);
  }
};

PlayGenerator.prototype.doPrompts = function () {
  if (this.instance.config && this.instance.config.prompts) {
    var cb = this.async();

    this.instance.prompts = {};

    this.prompt(this.instance.config.prompts, function (props, err) {
      if (err) {
        return this.emit('error', err);
      }

      this.instance.prompts = props;
      this.log.write();

      cb();
    }.bind(this));
  }
};

PlayGenerator.prototype.postPrompts = function () {
  if (this.instance.config && this.instance.config.postPrompts) {
    this.instance.config.postPrompts.call(this);
  }
};

// ----------------------------------------------------------------------------
// instance files
// ----------------------------------------------------------------------------

PlayGenerator.prototype.writeFiles = function () {
  if (this.instance.path) {
    this._writeDir(this.instance.path);
  }
};

// ----------------------------------------------------------------------------
// Update project configuration files
// ----------------------------------------------------------------------------

PlayGenerator.prototype.writeConfFiles = function () {
  if (this.instance.config) {
    var packagePath = this.paths.root + "/package.json";
    var bowerPath = this.paths.root + "/bower.json";
    var gruntPath = this.paths.root + "/Gruntfile.js";
    var constantsPath = this.paths.conf + "/constants.json";

    this._updateJson(packagePath, "package");
    this._updateJson(bowerPath, "bower");
    this._updateJson(constantsPath, "constants");

    if (this.instance.config.grunt && this.existsFile(gruntPath)) {
      var gruntfile = this.readFileAsString(gruntPath);

      var startToken = "initConfig(";
      var endToken = ");";
      var startConfig = gruntfile.indexOf(startToken) + startToken.length;
      var endConfig = gruntfile.indexOf(endToken, startConfig);

      var gruntConfig = gruntfile.substring(startConfig, endConfig);

      // Preserve all JavaScript variables inside the Gruntfile
      var variables = ["configuration"];
      var variablesMapping = {};
      _.forEach(variables, function (variable) {
        var stringVariable = "@{" + variable + "}";
        variablesMapping[variable] = stringVariable;
        gruntConfig = gruntConfig.replace(variable, "variablesMapping." + variable);
      });

      var gruntConfigObject;
      eval("gruntConfigObject = " + gruntConfig);
      gruntConfigObject = this._merge(gruntConfigObject, this.instance.config.grunt);

      gruntConfig = JSON.stringify(gruntConfigObject, null, "  ");

      _.forEach(variablesMapping, function (stringVariable, variable) {
        gruntConfig = gruntConfig.replace("\"" + stringVariable + "\"", variable);
      });

      gruntfile = gruntfile.substring(0, startConfig) + gruntConfig + gruntfile.substring(endConfig);

      this.writeFileFromString(gruntfile, "Gruntfile.js");
    }
  }
};

// ----------------------------------------------------------------------------
// Say goodbye and hope he will use you again...
// ----------------------------------------------------------------------------

PlayGenerator.prototype.bye = function () {
  if (this.instance.config && this.instance.config.bye) {
    _.forEach(this.instance.config.bye, function (w) {
      this._log(w.status, w.message);
    }.bind(this))
  }
};

// ----------------------------------------------------------------------------
// Private utils
// ----------------------------------------------------------------------------

PlayGenerator.prototype._generateSecretKey = function (length) {
  length = length || 64;
  var secretKey = "";

  for (var i = 0; i < length; ++i) {
    secretKey += String.fromCharCode(Math.floor(_.random(74)) + 48);
  }

  return secretKey.replace("\\", "/");
};

PlayGenerator.prototype._log = function (status, message) {
  if (message) {
    this.log[status](message);
  } else {
    this.log[status]();
  }
};

PlayGenerator.prototype._writeDir = function (currentPath) {
  var files = fs.readdirSync(currentPath);
  _(files)
    .map(function (file) {
      return path.join(currentPath, file);
    })
    .reject(function (filePath) {
      var relativeFilePath = filePath.substr(this.instance.path.length + 1);
      return this.instance.config.files
        && this.instance.config.files[relativeFilePath]
        && this.instance.config.files[relativeFilePath].excluded
        && eval(this.instance.config.files[relativeFilePath].excluded);
    }.bind(this))
    .forEach(function (filePath) {
      var stat = fs.statSync(filePath);
      stat.isDirectory() ? this._writeDir(filePath) : this._writeFile(filePath);
    }.bind(this)); 
};

PlayGenerator.prototype._writeFile = function (filePath) {
  var destinationPath = this.underscoreEngine(filePath, this.instance.prompts).replace(this.instance.path, this.paths.root);
  this.template(filePath, destinationPath, this.instance);
};

PlayGenerator.prototype._merge = function (source1, source2) {
  return _.merge(source1, source2, function (a, b) {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
};

PlayGenerator.prototype._updateJson = function (path, property) {
  if (this.instance.config[property] && this.existsFile(path)) {
    var data = this.readFileAsJson(path);
    data = this._merge(data, this.instance.config[property]);
    this.writeFileFromJson(path, data);
  }
};
