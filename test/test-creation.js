/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;
var test = require('../utils/test.js');


describe('play generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('play:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    console.log("creates expected files'");
    var expected = [
      // add files you expect to exist here.
      'conf/application.conf',
      'conf/routes',
      '.jshintrc',
      '.editorconfig'
    ];

    helpers.mockPrompt(this.app, {
      'playVersion': '2.1.3',
      'language': 'java',
      'appName': 'Test'
    });

    // Mock all promptLoops
    test.mockPromptLoop(this.app, [
      ["en", "fr"]
    ]);

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
