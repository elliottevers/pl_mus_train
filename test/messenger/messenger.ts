import "mocha";
const assert = require("chai").assert;
const sinon = require("sinon");
const sinonTest = require('sinon-test');
const test = sinonTest(sinon);

import {message as m} from "../../src/message/messenger"


describe('Messenger', ()=>{
    it('stores a key', test(()=>{
        let mes = new m.Messenger('node', 0, 'key');
        assert.equal(mes.get_key_route(), 'key');
    }));
});