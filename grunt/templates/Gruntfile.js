"use strict";

var path = require("path");

// Your can dynamically rename task by filling this hash
// Add a new key correspond to the grunt plugin name, the value
// must be another hash where keys are original task names and values
// are new names.
// Example: grunt-contrib-copy: { copy: "cp" }
// This will rename the "copy" task of the "grunt-contrib-copy" plugin to "cp"
var renamedTasks = {

};

module.exports = function (grunt) {
  // Lo-Dash for the win!
  var _ = grunt.util._;

  // Renaming tasks according to the previous configuration
  require("matchdep").filterDev("grunt-*").forEach(function (plugin) {
    grunt.loadNpmTasks(plugin);
    if (renamedTasks[plugin]) {
      _.forEach( renamedTasks[plugin], function (newName, originalName) {
        grunt.renameTask(originalName, newName);
      });
    }
  });

  // Basic configuration of our project
  // Retrieve the package.json file
  // and saving all basic folders of a Play project
  var configuration = {
    "pkg" : grunt.file.readJSON("package.json"),
    "play": grunt.file.readJSON("conf/constants.json"),
    "dir": {
      // Classic Play application structure, containing all Scala and template files
      "app": {
        "root": "app",
        "controllers": "controllers",
        "models": "models",
        "views": "views"
      },
      // Conf files of your application
      "conf": {
        "root": "conf"
      },
      // All assets (CSS, JS, images, ...) you want to expose to your users
      "public": {
        "root": "public",
        "styles": "<%= config.dir.public.root %>/stylesheets",
        "scripts": "<%= config.dir.public.root %>/javascripts",
        "images": "<%= config.dir.public.root %>/images",
        "fonts": "<%= config.dir.public.styles %>/fonts"
      },
      // Configuration of your project
      "project": {
        "root": "project"
      },
      // Because tests are importants !
      "test": {
        "root": "test"
      },
      // Using Bower? This is where all your dependencies will go
      "bower": {
        "root": "bower_components"
      },
      // All assets you don't want to expose to your users, like LESS or CoffeeScript files
      "resources": {
        "root": "resources",
        "less": "<%= config.dir.resources.root %>/less",
        "sass": "<%= config.dir.resources.root %>/sass",
        "stylus": "<%= config.dir.resources.root %>/stylus",
        "coffee": "<%= config.dir.resources.root %>/coffee"
      }
    }
  };

  // You should call this task each time you add a Bower depdency
  // Why not directly calling "bower install"? Because sometime,
  // you will need to perform more than just cloning Git repos
  grunt.registerTask("bower", [
    "shell:bowerInstall",
    "parallel:bowerBuild",
    "clean:bower"
  ]);

  // Here you will build your ressources for dev purposes,
  // No need for minification or optimizations
  grunt.registerTask("build", [
    "clean:public",
    "parallel:bowerCopy",
    "less:raw"
  ]);

  // The default task is for developpers, so they just have to run "grunt"
  // It should build the project and then watch if to live-reload when a 
  // file is saved
  grunt.registerTask("default", [
    "build",
    "watch"
  ]);

  grunt.registerTask("deploy", [
    "build",
    "less:dist"
  ]);

  grunt.registerTask("test", [
    "build",
    "karma:test"
  ]);

  grunt.initConfig({
    "config": configuration,

    "clean": {
      // Clean all public resources that are not yours
      // They should be imported/generated from a remote source
      "public": [
        "<%= config.dir.public.scripts %>/vendors/**/*",
        "<%= config.dir.public.styles %>/vendors/**/*"
      ]
    },

    {{ if(_.contains(grunt.cssPreprocessors, "LESS")) { }}
    "less": {
      "options": {
        "paths": ["<%= config.dir.bower %>", "<%= config.dir.resources.less %>"]
      },
      "raw": {
        "files": {
          "<%= config.dir.public.styles %>/<%= config.play.application.files.style %>.css": "<%= config.dir.resources.less %>/less/app.less"
        }
      },
      "dist": {
        "options": {
          "compress": true
        },
        "files": [{
          "<%= config.dir.public.styles %>/<%= config.play.application.files.style %>.<%= config.play.application.version %>.min.css": "<%= config.dir.resources.less %>/less/app.less"
        }]
      }
    },
    {{ } }}

    "uglify": {
      "options": {
        "banner": ""
      },
      "dist": {
        "options": {
          "compress": true,
          "report": "min"
        },
        "files": [{
          "dest": "<%= config.dir.public.scripts %>/<%= config.play.application.files.script %>.<%= config.play.application.version %>.min.js",
          "src": [
            "<%= config.dir.public.scripts %>/app.js",
            "<%= config.dir.public.scripts %>/*.js",
            "<%= config.dir.public.scripts %>/!(vendors)/**/*.js",
            "!<%= config.dir.public.scripts %>/<%= config.play.application.files.script %>.*.min.js"
          ]
        }]
      }
    },

    "watch": {
      "options": {
        "livereload": false,
        "forever": true
      },
      "less": {
        "files": ["<%= config.dir.resources.less %>/*.less"],
        "tasks": ["less:raw"]
      },
      "public": {
        "options": {
          "livereload": true
        },
        "files": [
          "<%= config.dir.app.root %>/**/*.scala",
          "<%= config.dir.app.root %>/**/*.html",
          "<%= config.dir.conf.root %>/*",
          "<%= config.dir.public.scripts %>/*.js",
          "<%= config.dir.public.scripts %>/**/*.js",
          "<%= config.dir.public.styles %>/*.css",
          "<%= config.dir.public.styles %>/**/*.css"
        ],
        "tasks": []
      }
    }
  });

};