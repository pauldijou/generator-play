'use strict';
var util = require('util');
var path = require('path');
var TemplateGenerator = require('generator-template');

var PlayBase = module.exports =  function PlayBase(args, options) {
  TemplateGenerator.Base.apply(this, arguments);

  // Override default config
  this.constants.DEFAULT_CONFIG = this._.extend(this.constants.DEFAULT_CONFIG, {
    global: {
      emptyBrackets: '()'
    },
    app: {
      name: '',
      version: '0.0.1-SNAPSHOT',
      playVersion: '2.2.0',
      language: '',
      secret: '',
      langs: [],
      dependencies: []
    }
  });

  // Set paths
  this.paths = this._.extend(this.paths, {
    "app": path.join(this.constants.PATH_ROOT, '/app'),
    "conf": path.join(this.constants.PATH_ROOT, '/conf'),
    "public": path.join(this.constants.PATH_ROOT, '/public'),
    "resources": path.join(this.constants.PATH_ROOT, '/resources'),
    "project": path.join(this.constants.PATH_ROOT, '/project'),
    "test": path.join(this.constants.PATH_ROOT, '/test')
  });

  // ASCII typo: Big
  var playStyle = this.chalk.green;
  var yoStyle = this.chalk.cyan;
  this.log.writeln(yoStyle("             ") + playStyle("       _             _ "));
  this.log.writeln(yoStyle("             ") + playStyle("      | |           | |"));
  this.log.writeln(yoStyle("  _   _  ___ ") + playStyle(" _ __ | | __ _ _   _| |"));
  this.log.writeln(yoStyle(" | | | |/ _ \\") + playStyle("| '_ \\| |/ _` | | | | |"));
  this.log.writeln(yoStyle(" | |_| | (_) ") + playStyle("| |_) | | (_| | |_| |_|"));
  this.log.writeln(yoStyle("  \\__, |\\___/") + playStyle("| .__/|_|\\__,_|\\__, (_)"));
  this.log.writeln(yoStyle("   __/ |     ") + playStyle("| |             __/ |  "));
  this.log.writeln(yoStyle("  |___/      ") + playStyle("|_|            |___/   "));
  this.log.writeln();

  this.on("end", function () {
    this.writeConfig();
    this.log.write();
    this.log.writeln(" " + yoStyle("yo") + playStyle("play!") + "... it is so good!");
    this.log.write();
  });

};

// Time to extend!
util.inherits(PlayBase, TemplateGenerator.Base);

// Handling Build.scala and plugins.sbt files
PlayBase.prototype.readBuildAsString = function () {
  return this.readFileAsString(path.join(this.paths.project, "Build.scala"));
};

PlayBase.prototype.writeBuildFromString = function (stringBuild) {
  this.writeFileFromString(stringConf, path.join(this.paths.project, "Build.scala"));
};

PlayBase.prototype.readPluginsAsString = function () {
  return this.readFileAsString(path.join(this.paths.project, "plugins.sbt"));
};

PlayBase.prototype.writePluginsFromString = function (stringBuild) {
  this.writeFileFromString(stringConf, path.join(this.paths.project, "plugins.Sbt"));
};

PlayBase.prototype.getDependencyRegex = function (packageName, name, version) {
  name = name || "[a-zA-Z0-9_-]+";
  version = version || "[0-9]+(\.[0-9]+(\.[0-9]+(-SNAPSHOT)?)?)?";
  return new RegExp('"' + packageName + '" %% "' + name + '" % "' + version + '"');
};

PlayBase.prototype.hasDependency = function (packageName, name, version) {
  return this.getDependencyRegex(packageName, name, version).test( this.readBuildAsString() );
};

PlayBase.prototype.hasResolver = function (url) {
  return this._.contains( this.readPluginsAsString(), url );
};

PlayBase.prototype.addResolver = function (url, description) {
  var newLine = 'resolvers += "' + (description ? description + '" at "' : '') + url + '"';
  this.writePluginsFromString( this.appendLine( this.readPluginsAsString(), newLine) );
};

PlayBase.prototype.removeResolver = function (url) {

};
