'use strict';

import '@material/mwc-button';
import '@material/mwc-icon';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-fab';
import '@material/mwc-list';
import '@material/mwc-dialog';
import '@material/mwc-circular-progress';
import '@material/mwc-snackbar';
import '@material/mwc-top-app-bar';

import Customer from './Customer.js';
import noodlesDB from './noodlesDB.js';
import markCustomerAsServed from './markCustomerAsServed.js';

const customerPage = document.querySelector('#customer_page');
const cookPage = document.querySelector('#cook_page');
const roleTab = document.querySelector('#role_tab');
const fab = document.querySelector('mwc-fab');
const customerList = document.querySelector('#customer_list');
const potList = document.querySelector('#pot_list');
const requestDialog = document.querySelector('#request_dialog');
const potStatusMessage = document.querySelector('#pot_status_message');

let customerCount = 0;

// 탭 전환 시 화면 변경, fab 아이콘 변경
roleTab.addEventListener('MDCTabBar:activated', event => {
    switch (event.detail.index) {
        case 0:
            customerPage.hidden = false;
            cookPage.hidden = true;
            fab.icon = 'person_add_alt_1';
            break;
        case 1:
            customerPage.hidden = true;
            cookPage.hidden = false;
            fab.icon = 'refresh';
            break;
        default:
            console.error('Error: Tab index out of range');
    }
});

fab.addEventListener('click', () => {
    switch (roleTab.activeIndex) {
        case 0:
            addCustomer();
            break;
        case 1:
            updatePotList();
            break;
        default:
            console.error('Error: Tab index out of range');
    }
});

const addCustomer = () => {
    ++customerCount;
    if (customerList.hasChildNodes()) {
        const divider = document.createElement('li');
        divider.setAttribute('divider', '');
        divider.setAttribute('padded', '');
        divider.setAttribute('role', 'seperator');
        customerList.appendChild(divider);
    }

    const item = document.createElement('mwc-list-item');
    item.setAttribute('index', customerCount.toString());
    item.setAttribute('graphic', 'avatar');
    item.innerHTML = `
        <span>손님 ${customerCount}</span>
        <mwc-icon slot="graphic">person</mwc-icon>
    `;

    const newCustomer = new Customer(customerCount, item);
    item.targetCustomer = newCustomer;
    customerList.appendChild(item);
};

// const markCustomerAsServed = item => {
//     item.targetCustomer.status = 'served';
//     item.twoline = false;
//     item.querySelector('mwc-circular-progress').remove();
//     const icon = document.createElement('mwc-icon');
//     icon.setAttribute('slot', 'graphic');
//     icon.innerText = 'done';
//     item.appendChild(icon);
// }

// 손님 클릭 event
customerList.addEventListener('action', event => {
    const selectedCustomer = customerList.selected.targetCustomer;
    const selectedItem = customerList.selected;

    if (selectedCustomer.status == 'idle') {
        requestDialog.open = true;
        return;
    }

    const customerName = '손님 ' + selectedCustomer.id;
    const noodleName = noodlesDB[selectedCustomer.noodleType].name;

    switch (selectedCustomer.status) {
        case 'requested': // 조리상태 표시
            const progress = selectedCustomer.getProgress();
            let statusMessage = '';
            switch (progress.status) {
                case 'boiling':
                    statusMessage = '물 끓이는 중입니다.';
                    break;
                case 'cooking':
                    statusMessage = '면 조리 중입니다.';
                    break;
                case 'served': // 손님도 완료 상태로 변경
                    statusMessage = '조리가 완료되었습니다.';
                    markCustomerAsServed(selectedItem);
                    break;
            }
            const remainingTimeMessage = progress.status != 'served' ?
                '(' + progress.remainingTime + '초 남음)' :
                '';
            potStatusMessage.labelText =`
                ${customerName}의 ${noodleName}: ${statusMessage} ${remainingTimeMessage}
            `;
            potStatusMessage.show();
            break;
        case 'served':
            potStatusMessage.labelText = `
                ${customerName}의 ${noodleName}: 조리가 완료되었습니다.
            `
            potStatusMessage.show();
            break;
    }

});

requestDialog.addEventListener('closing', event => {
    const action = event.detail.action;
    const selectedCustomer = customerList.selected.targetCustomer;
    const selectedItem = customerList.selected;

    if (action != 'cancel' && action != 'close') { // 라면 주문 실행
        const targetPot = selectedCustomer.requestNoodles(action);

        const progressIcon = document.createElement('mwc-circular-progress');
        progressIcon.setAttribute('indeterminate', '');
        progressIcon.setAttribute('slot', 'graphic');
        selectedItem.querySelector('mwc-icon').remove();
        selectedItem.appendChild(progressIcon);

        const statusLabel = document.createElement('span');
        statusLabel.setAttribute('slot', 'secondary');
        statusLabel.innerText = noodlesDB[action].name + ' 조리중';
        selectedItem.appendChild(statusLabel);
        selectedItem.twoline = true;

        selectedCustomer.status = 'requested';
    }
});

const updatePotList = () => {
    potList.innerHTML = '';
    const list = customerList.querySelectorAll('mwc-list-item');
    let potCount = 0;
    for (let item of list) {
        if (item.targetCustomer.status == 'requested') {
            ++potCount;
            const potItem = document.createElement('mwc-list-item');
            const noodleName = noodlesDB[item.targetCustomer.noodleType].name;
            const progress = item.targetCustomer.getProgress();
            
            if (progress.remainingTime >= 0) {
                potItem.setAttribute('index', potCount.toString());
                potItem.setAttribute('graphic', 'avatar');
                potItem.innerHTML = `
                    <span>손님 ${item.targetCustomer.id}의 ${noodleName}</span>
                    <mwc-icon slot="graphic">outdoor_grill</mwc-icon>
                `;
                potItem.twoline = true;

                let statusMessage = '';
                switch (progress.status) {
                    case 'boiling':
                        statusMessage = '물 끓이는 중 - ';
                        break;
                    case 'cooking':
                        statusMessage = '면 조리 중 - ';
                        break;
                }
                const remainingTimeMessage = progress.remainingTime + '초 남음';

                const statusLabel = document.createElement('span');
                statusLabel.setAttribute('slot', 'secondary');
                statusLabel.innerText = statusMessage + remainingTimeMessage;
                potItem.appendChild(statusLabel);
                potList.appendChild(potItem);
            }
        }
    }
}
window.onload = () => {
    setInterval(updatePotList, 6000);
}