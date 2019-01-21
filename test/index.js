"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
// import "assert";
var assert = require("assert");
var dist_1 = require("../dist");
describe("index", function () {
    it("should say hello", function () {
        dist_1.SmokeTest.HelloWorld();
        assert.ok(true);
    });
});
//# sourceMappingURL=index.js.map