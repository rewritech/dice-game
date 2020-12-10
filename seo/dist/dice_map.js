"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiceMap {
    constructor() {
        this.DICE_MIN = 1;
        this.DICE_MAX = 6;
        this.MAP_ROW = 10;
        this.MAP_COL = 10;
        this.MIN_COUNT = 10;
        this.diceMap = Array.from(Array(10), () => new Array(10));
        this.counter = this.initializeCounter();
    }
    createNewMap() {
        this.counter = this.initializeCounter();
        this.newMap();
        // create new map while filtered element length is zero
        while (Object.values(this.counter).filter((n) => n < this.MIN_COUNT)
            .length > 0) {
            this.initializeCounter();
            this.newMap();
        }
    }
    getCounter() {
        return this.counter;
    }
    getDiceMap() {
        return this.diceMap;
    }
    initializeCounter() {
        this.counter = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        return this.counter;
    }
    // create random number between 1 and 6
    createRandomNumber() {
        return Math.floor(Math.random() * (this.DICE_MAX + 1 - this.DICE_MIN) + this.DICE_MIN);
    }
    newMap() {
        for (let i = 0; i < this.MAP_ROW; i += 1) {
            for (let j = 0; j < this.MAP_COL; j += 1) {
                this.diceMap[i][j] = this.createRandomNumber();
                this.counting(this.diceMap[i][j]);
            }
        }
    }
    counting(num) {
        switch (num) {
            case 1:
                this.counter[1] += 1;
                break;
            case 2:
                this.counter[2] += 1;
                break;
            case 3:
                this.counter[3] += 1;
                break;
            case 4:
                this.counter[4] += 1;
                break;
            case 5:
                this.counter[5] += 1;
                break;
            case 6:
                this.counter[6] += 1;
                break;
            default:
                break;
        }
    }
}
exports.default = DiceMap;
