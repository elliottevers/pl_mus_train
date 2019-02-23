import "mocha";
import {map} from "../../src/control/map";
import FretMapper = map.FretMapper;
import {message} from "../../src/message/messenger";
import Messenger = message.Messenger;
const assert = require("chai").assert;
const sinon = require("sinon");
const sinonTest = require('sinon-test');
const test = sinonTest(sinon);

describe('FretMapper', ()=>{
    it('maps to frets below root of config', test(()=>{
        let env = 'node';
        let messenger: Messenger = new Messenger(env, 0);
        let mapper = new FretMapper(messenger);
        assert.deepEqual(mapper.map(40), [6, 0]);
    }));

    it('maps to frets above highest note of config', test(()=>{
        let env = 'node';
        let messenger: Messenger = new Messenger(env, 0);
        let mapper = new FretMapper(messenger);
        assert.deepEqual(mapper.map(74), [1, 10]);
    }));

    it('maps to intervals directly in cofig', test(()=>{
        let env = 'node';
        let messenger: Messenger = new Messenger(env, 0);
        let mapper = new FretMapper(messenger);
        assert.deepEqual(mapper.map(57), [4, 7]);
    }));

    it('maps to intervals *not* in config', test(()=>{
        let env = 'node';
        let messenger: Messenger = new Messenger(env, 0);
        let mapper = new FretMapper(messenger);
        assert.deepEqual(mapper.map(58), [3, 3]);
    }));
});