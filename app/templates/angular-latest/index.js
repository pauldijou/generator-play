module.exports = {
  "engine": "mustache",
  "prompts": [{
    "type": "input",
    "name": "version",
    "message": "Which version do you want to install?",
    "default": "1.2.0-rc.2"
  }],
  "bower": {
    "dependencies": {
      "angular-latest": "{{= prompts.version}}"
    }
  },
  "grunt": {
    "copy": {
      "bowerAngularLatest": {
        "files": [{
          "expand": true,
          "cwd": "<%= config.dir.bower.root %>/angular-latest/build/",
          "src": ["*.js"],
          "dest": "<%= config.dir.public.scripts %>/vendors/angular-latest/"
        }]
      }
    },
    "parallel": {
      "options": {
        "grunt": true
      },
      "bowerBuild": {
        "tasks": [
          ["shell:angularLatestNpm", "shell:angularLatestPackage"],
        ]
      },
      "bowerCopy": {
        "tasks": [
          "copy:bowerAngularLatest"
        ]
      }
    },
    "shell": {
      "angularLatestNpm": {
        "command": "(cd ./<%= config.dir.bower.root %>/angular-latest && exec npm install)",
        "options": {
          "stdout": true
        }
      },
      "angularLatestPackage": {
        "command": "(cd ./<%= config.dir.bower.root %>/angular-latest && exec grunt clean buildall)",
        "options": {
          "stdout": true
        }
      }
    }
  },
  "files": {
    "index.js": {
      excluded: true
    }
  }
}
