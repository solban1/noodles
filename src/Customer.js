'use strict';

import Pot from "./Pot";

export default class {
    constructor(id, listItem) {
        this.noodleType = '';
        this.pot;
        this.status = 'idle';
        this.id = id;
        this.listItem = listItem;
    }

    requestNoodles(noodleType) {
        console.log('requestNoodles ' + noodleType);
        this.noodleType = noodleType;
        this.pot = new Pot(this.noodleType, this.listItem);
    }

    getProgress() {
        return this.pot.getProgress();
    }
};