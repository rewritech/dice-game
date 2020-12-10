"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dice_map_1 = require("./dice_map");
function timer(func, maxCount = 1) {
    const start = new Date().getTime();
    const results = [];
    for (let n = 0; n < maxCount; n += 1) {
        func();
        results.push(new Date().getTime() - start);
    }
    const avg = results.reduce((a, b) => a + b) / results.length;
    console.log(`평균(ms) : ${avg}`);
    console.log(`최소(ms) : ${Math.min(...results)}`);
    console.log(`최대(ms) : ${Math.max(...results)}`);
}
const dm = new dice_map_1.default();
const loopCount = 1000;
timer(dm.createNewMap.bind(dm), loopCount);
