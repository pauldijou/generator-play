var test = module.exports;

test.mockPromptLoop = function (generator, results) {
	var resultIndex = 0;
  var origPromptLoop = generator.promptLoop;
  generator.promptLoop = function (prompts, done) {
    done(results[resultIndex++], null);
  };
  generator.origPromptLoop = origPromptLoop;
};