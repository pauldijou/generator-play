var helpers = require("../../utils/inquire-helpers.js");

module.exports = {
  "prompts": [{
    "type": "input",
    "name": "version",
    "message": "What is your new version?",
    "validate": helpers.required()
  }],
  "constants": {
    "application": {
      "version": "<%= version %>"
    }
  },
  "package": {
    "version": "<%= version %>"
  }
}
