import '@material/mwc-tab-bar';
import '@material/mwc-tab';

const customerPage = document.querySelector('#customer_page');
const cookPage = document.querySelector('#cook_page');
const roleTab = document.querySelector('#role_tab');

roleTab.addEventListener('MDCTabBar:activated', event => {
    switch (event.detail.index) {
        case 0:
            customerPage.hidden = false;
            cookPage.hidden = true;
            break;
        case 1:
            customerPage.hidden = true;
            cookPage.hidden = false;
            break;
        default:
            console.error('Error: Tab index out of range');
    }
});