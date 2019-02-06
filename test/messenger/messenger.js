"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var assert = require("chai").assert;
var sinon = require("sinon");
var sinonTest = require('sinon-test');
var test = sinonTest(sinon);
var messenger_1 = require("../../src/message/messenger");
describe('Messenger', function () {
    it('stores a key', test(function () {
        var mes = new messenger_1.message.Messenger('node', 0, 'key');
        assert.equal(mes.get_key_route(), 'key');
    }));
});
//# sourceMappingURL=messenger.js.map