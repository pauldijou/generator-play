var path = require('path');

module.exports = {
  prompts: [{
    "type": "input",
    "name": "playVersion",
    "message": "Which version of Play! do you want to use?",
    "default": "2.1.4"
  },
  {
    "type": "list",
    "name": "language",
    "message": "Which language do you want to use to code your application?",
    "choices": ["scala", "java"],
    "default": "scala"
  },
  {
    "type": "input",
    "name": "appName",
    "message": "What is the name of your application?",
    "default": path.basename(process.cwd())
  },
  {
    "type": "input",
    "name": "langs",
    "message": "Supported langs?",
    "default": "en"
  }],
  postPrompts: function () {
    this.config.app.playVersion = this.instance.prompts.playVersion;
    this.config.app.language = this.instance.prompts.language;
    this.config.app.name = this.instance.prompts.appName;
    this.config.app.langs = this.instance.prompts.langs;

    if (this.instance.prompts.language === "scala") {
      this.config.global.emptyBrackets = "";
      this.config.app.dependencies = ["jdbc", "anorm"];
    } else {
      this.config.global.emptyBrackets = "()";
      this.config.app.dependencies = ["javaCore", "javaJdbc", "javaEbean"];
    }
  },
  files: {
    "index.js": {
      excluded: true
    },
    "app/controllers/Application.scala": {
      excluded: "this.instance.prompts.language === 'java'"
    },
    "app/controllers/Application.java": {
      excluded: "this.instance.prompts.language === 'scala'"
    },
    "test/ApplicationSpec.scala": {
      excluded: "this.instance.prompts.language === 'java'"
    },
    "test/ApplicationTest.java": {
      excluded: "this.instance.prompts.language === 'scala'"
    },
    "test/IntegrationSpec.scala": {
      excluded: "this.instance.prompts.language === 'java'"
    },
    "test/IntegrationTest.java": {
      excluded: "this.instance.prompts.language === 'scala'"
    }
  }
}
