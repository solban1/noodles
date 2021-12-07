'use strict';

import Pot from "./Pot";

export default class {
    constructor(id) {
        this.noodleType = '';
        this.pot;
        this.status = 'idle';
        this.id = id;
    }

    requestNoodles(noodleType) {
        console.log('requestNoodles ' + noodleType);
        this.noodleType = noodleType;
        this.pot = new Pot(this.noodleType);
    }

    getProgress() {
        return this.pot.getProgress();
    }
};