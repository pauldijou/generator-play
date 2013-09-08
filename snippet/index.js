'use strict';
var util = require('util');
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var PlayBase = require('../utils/play-base');

var SnippetGenerator = module.exports = function SnippetGenerator(args, options, config) {
  PlayBase.apply(this, arguments);

  this.argument("command", {
    required: true,
    optional: false,
    type: "String"
  });

  this.option("path", {
    type: "String"
  });
};

util.inherits(SnippetGenerator, PlayBase);

SnippetGenerator.prototype.askForTemplate = function () {
  var templatePath = this.options.path ? this.options.path + "/" + this.command + ".json" : this.sourceRoot() + "/" + this.command + ".json";

  if (!this.existsFile(templatePath)) {
    console.log("No template at ", templatePath);
  } else {
    this.templateJson = this.readFileAsJson(templatePath);
    console.log(this.templateJson );

    if (this.templateJson.prompts) {
      var cb = this.async();

      this.prompt(this.templateJson.prompts, function (props, err) {
        if (err) {
          return this.emit('error', err);
        }

        this.templateJson = JSON.parse(this.safeEngine(this.readFileAsString(templatePath), props));

        cb();
      }.bind(this));
    }
  }
};

SnippetGenerator.prototype.writeTemplate = function () {
  if (this.templateJson) {
    var packagePath = this.paths.root + "/package.json";
    var bowerPath = this.paths.root + "/bower.json";
    var gruntPath = this.paths.root + "/Gruntfile.js";
    var constantsPath = this.paths.conf + "/constants.json";

    this._updateJson(packagePath, "package");
    this._updateJson(bowerPath, "bower");
    this._updateJson(constantsPath, "constants");

    if (this.templateJson.grunt && this.existsFile(gruntPath)) {
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
        console.log("replace", variable, "variablesMapping[\"" + variable + "\"]");
        gruntConfig = gruntConfig.replace(variable, "variablesMapping." + variable);
      });

      var gruntConfigObject;
      eval("gruntConfigObject = " + gruntConfig);
      gruntConfigObject = this._merge(gruntConfigObject, this.templateJson.grunt);

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
  if (this.templateJson[property] && this.existsFile(path)) {
    var data = this.readFileAsJson(path);
    data = this._merge(data, this.templateJson[property]);
    this.writeFileFromJson(path, data);
  }
};
