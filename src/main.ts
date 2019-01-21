// Globals defined in Max environment
let inlets, outlets, autowatch;
let ExportMax: any = {};

import {Log} from "./log/logger";

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


console.log('hello world!');

ExportMax.main = function main() {
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
    let logger = new Log.Logger('node');
    // post(cat.speak());
    logger.log("I am Logge")

    // post('hello world');
    // console.log(cat.speak())
};

