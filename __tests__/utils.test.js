const utils = require("../js/utils.js");

test('hello truncated to length 2 should be he...', () => {
    expect(utils.truncate('hello', 3)).toBe('he...');
});

test('numberEnding singular', () => {
    expect(utils.numberEnding(1)).toBe(' ago');
});

test('numberEnding plural', () => {
    expect(utils.numberEnding(2)).toBe('s ago');
});
