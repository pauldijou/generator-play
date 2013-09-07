'use strict';
var util = require('util');
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var PlayBase = require('../utils/play-base');

var RunGenerator = module.exports = function RunGenerator(args, options, config) {
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

util.inherits(RunGenerator, PlayBase);

RunGenerator.prototype.askFortemplate = function () {
  var templatePath = this.options.path ? this.options.path + this.command + ".json" : this.sourceRoot() + "/" + this.command + ".json";

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
        console.log(this.templateJson);

        cb();
      }.bind(this));
    }
  }
};

RunGenerator.prototype.writetemplate = function () {
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

      var gruntConfigObject, configuration = "CONFIGURATION";
      eval("gruntConfigObject = " + gruntfile.substring(startConfig, endConfig));
      gruntConfigObject = this._merge(gruntConfigObject, this.templateJson.grunt);

      gruntfile = gruntfile.substring(0, startConfig) + JSON.stringify(gruntConfigObject, null, "  ") + gruntfile.substring(endConfig);
      console.log(gruntfile);
      this.writeFileFromString(gruntfile, "Gruntfile.js");
    }
  }
};

RunGenerator.prototype._merge = function (source1, source2) {
  return _.merge(source1, source2, function (a, b) {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
};

RunGenerator.prototype._updateJson = function (path, property) {
  if (this.templateJson[property] && this.existsFile(path)) {
    var data = this.readFileAsJson(path);
    data = this._merge(data, this.templateJson[property]);
    this.writeFileFromJson(path, data);
  }
};
