"use strict";
// Globals defined in Max environment
Object.defineProperty(exports, "__esModule", { value: true });
// NB: comment for Max compilation, uncomment for running compiled JS with node
var inlets, outlets, autowatch;
var Global = {};
var main = Global.main;
var logger_1 = require("./log/logger");
inlets = 1;
outlets = 1;
autowatch = 1;
// let inlets = 1;
// let outlets = 1;
// let autowatch = 1;
// var Global = {};
// Only works if ExampleModule.ts is declared before ExampleJS.ts in tsconfig.json!
// let a = Animal;
// import { Animal } from "animal";
// import Animal = Animal
// let logger = new Log.Logger('node');
// let dog = new Animal.Canine('doggo');
// console.log(cat.speak());
// console.log('hello world');
// console.log('hello world!');
// post('init');
console.log('init');
Global.main = function main() {
    // let theObject = new em.TheClass(42);
    // post("theObject.getIndex(): " + theObject.getIndex() + "\n");
    // post("The square of pi is " + em.square(Math.PI) + "\n");
    //
    // // Cast to <any> to assign properties to objects of type Global.
    // var g = new Global("");
    // (<any>g).newProperty = "I am new.";
    //
    // post("(<any>g).newProperty: " + (<any>g).newProperty + "\n");
    // TODO: make new type for the logger initialization string
    var logger = new logger_1.Log.Logger('node');
    // post(cat.speak());
    // logger.log("I am Logger")
    // post("I am Logger");
    console.log("I am Logger");
    // post('hello world');
    // console.log(cat.speak())
};
//# sourceMappingURL=main.js.map