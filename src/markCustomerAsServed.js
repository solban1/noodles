'use strict';

export default function(item) {
    item.targetCustomer.status = 'served';
    item.twoline = false;
    item.querySelector('mwc-circular-progress').remove();
    const icon = document.createElement('mwc-icon');
    icon.setAttribute('slot', 'graphic');
    icon.innerText = 'done';
    item.appendChild(icon);
};