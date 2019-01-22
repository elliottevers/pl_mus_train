// Globals defined in Max environment

// NB: comment for Max compilation, uncomment for running compiled JS with node
// let inlets, outlets, autowatch;
// let Global: any = {};

import {Log} from "./log/logger";
import {note as n} from "./note/note"
import TreeModel = require("tree-model");

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
// console.log('initial');

(Global as any).main = function main() {
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
    // logger.log("I am Logger")
    // post("I am Logger");
    // console.log("I am Logger");

    // let note = new n.Note(70, 0, 4, 100, 0);

    // post(note.pitch);
    // post('hello world');
    // console.log(cat.speak())
    let tree = new TreeModel();

    let root = tree.parse({
        id: 1,
        children: [
            {
                id: 11,
                children: [{id: 111, attribute_test: 'hello world'}]
            },
            {
                id: 12,
                children: [{id: 121, attribute_test: 'hello world'}, {id: 122, attribute_test: 'hello world'}]
            },
            {
                id: 13
            }
        ]
    });

    let path_length = root.first(function (node) {     return node.model.id === 12; }).getPath().length;

    post("length of path: ");
    post(path_length);

};

