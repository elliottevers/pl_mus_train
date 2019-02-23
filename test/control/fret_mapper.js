"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var map_1 = require("../../src/control/map");
var FretMapper = map_1.map.FretMapper;
var messenger_1 = require("../../src/message/messenger");
var Messenger = messenger_1.message.Messenger;
var assert = require("chai").assert;
var sinon = require("sinon");
var sinonTest = require('sinon-test');
var test = sinonTest(sinon);
describe('FretMapper', function () {
    it('maps to frets below root of config', test(function () {
        var env = 'node';
        var messenger = new Messenger(env, 0);
        var mapper = new FretMapper(messenger);
        assert.deepEqual(mapper.map(40), [6, 0]);
    }));
    it('maps to frets above highest note of config', test(function () {
        var env = 'node';
        var messenger = new Messenger(env, 0);
        var mapper = new FretMapper(messenger);
        assert.deepEqual(mapper.map(74), [1, 10]);
    }));
    it('maps to intervals directly in cofig', test(function () {
        var env = 'node';
        var messenger = new Messenger(env, 0);
        var mapper = new FretMapper(messenger);
        assert.deepEqual(mapper.map(57), [4, 7]);
    }));
    it('maps to intervals *not* in config', test(function () {
        var env = 'node';
        var messenger = new Messenger(env, 0);
        var mapper = new FretMapper(messenger);
        assert.deepEqual(mapper.map(58), [3, 3]);
    }));
});
//# sourceMappingURL=fret_mapper.js.map