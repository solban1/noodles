'use strict';

import noodlesDB from "./noodlesDB";

export default class {
    constructor(noodleType) {
        this.status = 'idle';
        this.checkpoint = Date.now();
        this.timeout;
        this.boilingTime = noodlesDB[noodleType].water / 5 + 60;
        this.cookingTime = noodlesDB[noodleType].time;
        this.boilWater();
    }

    boilWater() {
        this.status = 'boiling';
        this.checkpoint = Date.now();
        this.timeout = setTimeout(this.cookNoodles.bind(this), this.boilingTime * 100);
    }

    cookNoodles() {
        this.status = 'cooking';
        this.checkpoint = Date.now();
        this.timeout = setTimeout(this.serve.bind(this), this.cookingTime * 100);
    }

    serve() {
        this.status = 'served';
    }

    getProgress() {
        const remainingTime = this.status == 'boiling' ?
            this.checkpoint / 1000 + this.boilingTime / 10 - Date.now() / 1000 :
            this.checkpoint / 1000 + this.cookingTime / 10 - Date.now() / 1000;
        return {
            status: this.status,
            remainingTime: Math.floor(remainingTime).toString(),
        };
    }
}