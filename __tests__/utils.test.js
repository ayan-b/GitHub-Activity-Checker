const utils = require("../js/utils.js");

test("hello truncated to length 2 should be he...", () => {
    expect(utils.truncate("hello", 3)).toBe("he...");
});

test("hello truncated to length 20 should be hello", () => {
    expect(utils.truncate("hello", 20)).toBe("hello");
});

test("numberEnding singular", () => {
    expect(utils.numberEnding(1)).toBe(" ago");
});

test("numberEnding plural", () => {
    expect(utils.numberEnding(2)).toBe("s ago");
});

test("getDifference: just now", () => {
    expect(utils.getDifference(0)).toBe("just now");
});

test("getDifference: just now", () => {
    expect(utils.getDifference(10)).toBe("just now");
});

test("getDifference: 1 second", () => {
    expect(utils.getDifference(1000)).toBe("1 second ago");
});

test("getDifference: 2 seconds", () => {
    expect(utils.getDifference(2000)).toBe("2 seconds ago");
});

test("getDifference: 1 minute", () => {
    expect(utils.getDifference(60000)).toBe("1 minute ago");
    expect(utils.getDifference(61000)).toBe("1 minute ago");
});

test("getDifference: 2 minutes", () => {
    expect(utils.getDifference(120000)).toBe("2 minutes ago");
});

test("getDifference: 1 hour", () => {
    expect(utils.getDifference(3600000)).toBe("about 1 hour ago");
    expect(utils.getDifference(4000000)).toBe("about 1 hour ago");
});

test("getDifference: 2 hours", () => {
    expect(utils.getDifference(7200000)).toBe("about 2 hours ago");
});

test("getDifference: 1 day", () => {
    expect(utils.getDifference(86400000)).toBe("1 day ago");
    expect(utils.getDifference(90400000)).toBe("1 day ago");
});

test("getDifference: 2 days", () => {
    expect(utils.getDifference(172800000)).toBe("2 days ago");
});

test("getDifference: 1 month", () => {
    expect(utils.getDifference(2592000000)).toBe("1 month ago");
    expect(utils.getDifference(3092000000)).toBe("1 month ago");
});

test("getDifference: 2 months", () => {
    expect(utils.getDifference(5184000000)).toBe("2 months ago");
});

test("getDifference: 1 year", () => {
    expect(utils.getDifference(31104000000)).toBe("12 months ago");
    expect(utils.getDifference(40104000000)).toBe("1 year ago");
    expect(utils.getDifference(62208000000)).toBe("1 year ago");
});

test("getDifference: 2 years", () => {
    expect(utils.getDifference(63072000000)).toBe("2 years ago");
});
