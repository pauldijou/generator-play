module.exports = {
  engine: "mustache",
  prompts: [{
    type: 'checkbox',
    name: 'cssPreprocessors',
    message: 'Do you want to use one or more CSS preprocessors?',
    choices: ['LESS', 'SASS', 'Stylus']
  },
  {
    type: 'checkbox',
    name: 'jsPreprocessors',
    message: 'Do you want to use one or more JavaScript preprocessors?',
    choices: ['CoffeeScript', 'TypeScript']
  }],
  postPrompts: function () {
    this.config.grunt = this.config.grunt || {};
    this.config.grunt.preprocessors = this.config.grunt.preprocessors || {};
    
    this.config.grunt.preprocessors.css = this.instance.prompts.cssPreprocessors;
    this.config.grunt.preprocessors.js = this.instance.prompts.jsPreprocessors;
  },
  files: {
    "index.js": {
      excluded: true
    }
  }
}