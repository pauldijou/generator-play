var path = require('path');

module.exports = {
  prompts: [{
    'type': 'input',
    'name': 'playVersion',
    'message': 'Which version of Play! do you want to use?',
    'default': '2.2.0'
  },
  {
    'type': 'list',
    'name': 'language',
    'message': 'Which language do you want to use to code your application?',
    'choices': ['scala', 'java'],
    'default': 'scala'
  },{
    'type': 'input',
    'name': 'sbtVersion',
    'message': 'Which version of sbt do you want to use?',
    'default': '0.13.0'
  },
  {
    'type': 'input',
    'name': 'appName',
    'message': 'What is the name of your application?',
    'default': path.basename(process.cwd())
  },
  {
    'type': 'input',
    'name': 'langs',
    'message': 'Supported langs?',
    'default': 'en'
  }],
  postPrompts: function () {
    this.config.app.playVersion = this.instance.prompts.playVersion;
    this.config.app.sbtVersion = this.instance.prompts.sbtVersion;
    this.config.app.language = this.instance.prompts.language;
    this.config.app.name = this.instance.prompts.appName;
    this.config.app.langs = this.instance.prompts.langs;

    if (this.instance.prompts.language === 'scala') {
      this.config.global.emptyBrackets = '';
      this.config.app.dependencies = ['jdbc', 'anorm'];
    } else {
      this.config.global.emptyBrackets = '()';
      this.config.app.dependencies = ['javaCore', 'javaJdbc', 'javaEbean'];
    }
  },
  files: {
    'index.js': {
      excluded: true
    },
    '**/*.scala': {
      excluded: 'this.instance.prompts.language === "java"'
    },
    '**/*.java': {
      excluded: 'this.instance.prompts.language === "scala"'
    }
  }
}
