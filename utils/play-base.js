'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var yeoman = require('yeoman-generator');

var CONFIG_FILE = "generator-play.json";

var DEFAULT_CONFIG = {
	global: {
    emptyBrackets: '()'
  },
  app: {
    name: '',
    version: '0.0.1-SNAPSHOT',
    playVersion: '2.1.2',
    language: '',
    secret: '',
    langs: [],
    dependencies: []
  }
};

var PATH_ROOT = process.cwd();

var PlayBase = module.exports =  function PlayBase(args, options) {
  this.logLevel = options["log-level"] || (options.verbose && "debug") || "info";

  yeoman.generators.Base.apply(this, arguments);
  
  // Set paths
  this.paths = {
    root: PATH_ROOT,
    app: path.join(PATH_ROOT, '/app'),
    conf: path.join(PATH_ROOT, '/conf'),
    public: path.join(PATH_ROOT, '/public'),
    resources: path.join(PATH_ROOT, '/resources'),
    project: path.join(PATH_ROOT, '/project'),
    test: path.join(PATH_ROOT, '/test')
  };

  // Extend the Yeoman Generator Base
  this.pkg = this.readFileAsJson(path.join(this.paths.root, '/package.json'), {});
  this.config = this.readConfig();

  _.mixin({
    capitalize: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
  });

  this.on('end', function () {
    this.writeConfig();
  });

};

// Generic methods
yeoman.generators.Base.prototype.exists = function (val) {
	return !_.isNull(val) && !_.isUndefined(val);
};

yeoman.generators.Base.prototype.existsFile = function (path) {
	return fs.existsSync(path);
};

yeoman.generators.Base.prototype.readFileAsJson = function(path, defaultValue) {
	return this.existsFile(path) && JSON.parse(this.readFileAsString(path)) || defaultValue;
};

yeoman.generators.Base.prototype.writeFileFromJson = function(path, value, space) {
  space = space || "  ";
  return this.writeFileFromString(JSON.stringify(value, null, space), path);
};

yeoman.generators.Base.prototype.promptLoop = function (prompts, done) {
  var self = this;
  var results = [];
  var isEnded = false;
  var isMultiple = _.isArray(prompts);
  prompts = isMultiple ? prompts : [prompts];

  var cb = self.async();

  // Return true if the value should stop the loop
  // Possible values are null, undefined or empty string
  // Otherwise, return false
  function isQuitAnswer (promptValue) {
    return _.isUndefined(promptValue) || _.isNull(promptValue) || promptValue === "";
  };

  // Handle a prompt by updating the answer with its value
  // or end the loop
  function handlePrompt (prompt, props, answer) {
    var promptName = prompt.name;
    var promptValue = props[promptName];
    self.print(promptName, promptValue);

    if (isQuitAnswer(promptValue)) {
      self.debug(">> End prompt loop because of empty answer");
      isEnded = true;
    } else {
      answer[promptName] = promptValue;
    }
  };

  // Perform one iteration of the loop.
  // Depending on the answer(s), will call itself
  // to iterate one more step or stop the loop.
  function ask () {
    self.prompt(prompts, function (props, err) {
      if (err) {
        self.debug(">> End prompt loop because of error: ", err);
        isEnded = true;
        done(results, err);
      }

      var answer = {};

      _.map(prompts, function (prompt) {
        handlePrompt(prompt, props, answer);
      });

      if (!isEnded) {
        results.push(isMultiple ? answer : answer[prompts[0].name]);
        self.debug("Ask one more time. Current status: ", results);
        ask();
      } else {
        self.debug("End of prompt loop. Final status: ", results);
        done(results, null);
      }
    }.bind(self));
  };
  
  // Ask at least one time the prompts
  ask();
};

yeoman.generators.Base.prototype.appendLine = function (contentString, newLine) {
  return contentString + "\n" + newLine;
};


yeoman.generators.Base.prototype.mustacheEngine = function (text, data) {
  return _.template(text, data, {
    escape: /{{-([\s\S]+?)}}/g,
    evaluate: /{{([\s\S]+?)}}/g,
    interpolate: /{{=([\s\S]+?)}}/g
  });
};

yeoman.generators.Base.prototype.underscoreEngine = function (text, data) {
  return _.template(text, data, {
    escape: /_-([\s\S]+?)_/g,
    evaluate: /_([\s\S]+?)_/g,
    interpolate: /_=([\s\S]+?)_/g
  });
};

// Time to extend!
util.inherits(PlayBase, yeoman.generators.Base);

PlayBase.prototype.print = function (msg, context) {
  if (_.isString(msg)) {
    yeoman.generators.Base.prototype.log.write(msg, context);
  } else {
    console.log(arguments);
  }
};

PlayBase.prototype.debug = function (msg, context) {
  if (this.logLevel === "debug") {
    this.print(msg, context);
  }
};


PlayBase.prototype.getConfigPath = function () {
  return path.join(this.paths.root, CONFIG_FILE);
};

PlayBase.prototype.readConfig = function () {
  return this.readFileAsJson(this.getConfigPath(), DEFAULT_CONFIG);
};

PlayBase.prototype.writeConfig = function () {
  this.writeFileFromJson(this.getConfigPath(), this.config);
};

// Handling conf files
function getConfRegex (key) {
  return new RegExp("^" + key + "=(.*)$", "m");
};

PlayBase.prototype.readConfAsString = function (env) {
  env = env || "application";
  return this.readFileAsString(path.join(this.paths.conf, env + ".conf"));
};

PlayBase.prototype.writeConfFromString = function (stringConf, env) {
  env = env || "application";
  return this.writeFileFromString(stringConf, path.join(this.paths.conf, env + ".conf"));
};

PlayBase.prototype.hasConf = function (key, env) {
  return getConfRegex(key).test(this.readConfAsString(env));
};

PlayBase.prototype.getAllConfs = function (subkey, env) {
  // TODO: wrong, do not work, correct it when time
  return getConfRegex("[^=]*" + subkey + "[^=]*").exec(this.readConfAsString(env));
};

PlayBase.prototype.getConf = function (key, env) {
  return getConfRegex(key).exec(this.readConfAsString(env))[1];
};

PlayBase.prototype.setConf = function (key, value, env) {
  if (this.hasConf(key, value)) {
    this.writeConfFromString(this.readConfAsString(env).replace( getConfRegex(key), key + "=" + value ), env);
  } else {
    this.writeConfFromString(this.readConfAsString(env) + "\n" + key + "=" + value, env);
  }
};

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
  return _.contains( this.readPluginsAsString(), url );
};

PlayBase.prototype.addResolver = function (url, description) {
  var newLine = 'resolvers += "' + (description ? description + '" at "' : '') + url + '"';
  this.writePluginsFromString( this.appendLine( this.readPluginsAsString(), newLine) );
};

PlayBase.prototype.removeResolver = function (url) {

};
