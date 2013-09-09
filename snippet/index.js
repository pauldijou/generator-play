'use strict';
var util = require('util');
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var PlayBase = require('../utils/play-base');

var SnippetGenerator = module.exports = function SnippetGenerator(args, options, config) {
  PlayBase.apply(this, arguments);

  this.argument("snippetName", {
    required: true,
    optional: false,
    type: "String"
  });

  this.option("path", {
    type: "String"
  });
};

util.inherits(SnippetGenerator, PlayBase);

SnippetGenerator.prototype.askForSnippet = function () {
  var snippetPath = this.options.path ? this.options.path + "/" + this.snippetName : this.sourceRoot() + "/" + this.snippetName;
  this.snippet = require(snippetPath);

  if (!this.snippet) {
    console.log("No snippet at ", snippetPath);
  } else {
    if (this.snippet.prompts) {
      var cb = this.async();

      this.prompt(this.snippet.prompts, function (props, err) {
        if (err) {
          return this.emit('error', err);
        }

        this.snippet = this.recursiveEngines()[this.snippet.engine || "default"].call(this, this.snippet, props);

        cb();
      }.bind(this));
    }
  }
};

SnippetGenerator.prototype.writesnippet = function () {
  if (this.snippet) {
    var packagePath = this.paths.root + "/package.json";
    var bowerPath = this.paths.root + "/bower.json";
    var gruntPath = this.paths.root + "/Gruntfile.js";
    var constantsPath = this.paths.conf + "/constants.json";

    this._updateJson(packagePath, "package");
    this._updateJson(bowerPath, "bower");
    this._updateJson(constantsPath, "constants");

    if (this.snippet.grunt && this.existsFile(gruntPath)) {
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
      gruntConfigObject = this._merge(gruntConfigObject, this.snippet.grunt);

      gruntConfig = JSON.stringify(gruntConfigObject, null, "  ");

      _.forEach(variablesMapping, function (stringVariable, variable) {
        gruntConfig = gruntConfig.replace("\"" + stringVariable + "\"", variable);
      });

      gruntfile = gruntfile.substring(0, startConfig) + gruntConfig + gruntfile.substring(endConfig);

      this.writeFileFromString(gruntfile, "Gruntfile.js");
    }
  }
};

SnippetGenerator.prototype._merge = function (source1, source2) {
  return _.merge(source1, source2, function (a, b) {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
};

SnippetGenerator.prototype._updateJson = function (path, property) {
  if (this.snippet[property] && this.existsFile(path)) {
    var data = this.readFileAsJson(path);
    data = this._merge(data, this.snippet[property]);
    this.writeFileFromJson(path, data);
  }
};
