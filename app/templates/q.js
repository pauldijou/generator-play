module.exports = {
  "engine": "mustache",
  "prompts": [{
    "type": "input",
    "name": "version",
    "message": "Which version do you want to install?",
    "default": "~0.9.0"
  }],
  "bower": {
    "dependencies": {
      "q": "{{= prompts.version}}"
    }
  },
  "grunt": {
    "copy": {
      "bowerQ": {
        "files": [{
          "expand": true,
          "cwd": "<%= config.dir.components.root %>/q/",
          "src": ["q.js", "q.min.js"],
          "dest": "<%= config.dir.public.scripts %>/vendors/q/"
        }]
      }
    },
    "parallel": {
      "options": {
        "grunt": true
      },
      "bowerCopy": {
        "tasks": [
          "copy:bowerQ"
        ]
      }
    }
  }
}
