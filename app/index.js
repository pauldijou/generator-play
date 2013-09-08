'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var PlayBase = require('../utils/play-base');

var PlayGenerator = module.exports = function PlayGenerator(args, options, config) {
  PlayBase.apply(this, arguments);

  this.config.app.secret = this._generateSecretKey();

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.isScala = function () {
    return this.config.app.language === 'scala';
  };

  this.isJava = function () {
    return this.config.app.language === 'java';
  };
};

util.inherits(PlayGenerator, PlayBase);

PlayGenerator.prototype.welcome = function () {
  // welcome message
  var welcome =
    '\n     _-----_' +
    '\n    |       |' +
    '\n    |' + chalk.red('--(o)--') + '|   .--------------------------.' +
    '\n   `---------´  |    ' + chalk.yellow.bold('Welcome to Yeoman') + ',    |' +
    '\n    ' + chalk.yellow('(') + ' _' + chalk.yellow('´U`') + '_ ' + chalk.yellow(')') + '   |   ' + chalk.yellow.bold('ladies and gentlemen!') + '  |' +
    '\n    /___A___\\   \'__________________________\'' +
    '\n     ' + chalk.yellow('|  ~  |') +
    '\n   __' + chalk.yellow('\'.___.\'') + '__' +
    '\n ´   ' + chalk.red('`  |') + '° ' + chalk.red('´ Y') + ' `\n';

  console.log(welcome);
};

PlayGenerator.prototype.askFor = function () {
  var cb = this.async();

  var prompts = [{
    type: 'input',
    name: 'playVersion',
    message: 'Which version of Play! do you want to use?',
    default: this.config.app.playVersion
  },
  {
    type: 'list',
    name: 'language',
    message: 'Which language do you want to use to code your application?',
    default: 'scala',
    choices: ['scala', 'java']
  },
  {
    type: 'input',
    name: 'appName',
    message: 'What is the name of your application?',
    default: path.basename(this.paths.root)
  }];

  this.prompt(prompts, function (props, err) {
    console.log(err);
    console.log(props);
    if (err) {
      return this.emit('error', err);
    }

    this.config.app.playVersion = props.playVersion;
    this.config.app.language = props.language;
    this.config.app.name = props.appName;

    if (this.isScala()) {
      this.config.global.emptyBrackets = '';
      this.config.app.dependencies.push('jdbc');
      this.config.app.dependencies.push('anorm');
    }
    else if (this.isJava()) {
      this.config.app.dependencies.push('javaCore');
      this.config.app.dependencies.push('javaJdbc');
      this.config.app.dependencies.push('javaEbean');
    }

    cb();
  }.bind(this));
};

PlayGenerator.prototype.askForLangs = function () {
  var prompt = {
    name: 'lang',
    message: 'Supported langs?'
  };

  var cb = this.async();

  this.promptLoop(prompt, function (results, err) {
    console.log("res", results);
    console.log("err", err);
    if (err) {
      return this.emit('error', err);
    }

    this.config.app.langs = results;
    cb();
  }.bind(this));
};

PlayGenerator.prototype.app = function () {
  this.directory('common', '.');
  this.directory(this.config.app.language, '.');

  this.template('package.json', 'package.json');
  this.template('bower.json', 'bower.json');
};

PlayGenerator.prototype.projectfiles = function () {
  this.template('editorconfig', '.editorconfig');
  this.template('jshintrc', '.jshintrc');
};

PlayGenerator.prototype._generateSecretKey = function (length) {
  length = length || 64;
  var secretKey = "";

  for (var i = 0; i < length; ++i) {
    secretKey += String.fromCharCode(Math.floor(_.random(74)) + 48);
  }

  return secretKey.replace("\\", "/");
};
