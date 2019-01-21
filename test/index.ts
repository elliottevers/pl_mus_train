import "mocha";
// import "assert";
import * as assert from "assert";
import {SmokeTest} from "../dist";

// console.log("hello world");

describe("index", ()=>{
    it("should say hello", ()=>{
        SmokeTest.HelloWorld();
        assert.ok(true);
    });
});