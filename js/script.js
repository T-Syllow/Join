setURL('https://tommy-syllow.developerakademie.net/smallest_backend_ever');

/**
 * Initiates the main page
 */
async function init() {
    await loadDataFromServer();
    await loadCurrentUserFromServer();
}


/**
 * Loads all data from the server
 */
async function loadDataFromServer() {
    await downloadFromServer();
    contacts = await JSON.parse(backend.getItem('contacts'));
}


/**
 * Loads the current user from server
 */
async function loadCurrentUserFromServer() {
    currentUser = JSON.parse(backend.getItem('currentUser'))
}


/**
 * Loads the requested data from server
 * @param {string} key 
 * @returns Data from server as Array
 * ~~~~~~ deprecated ~~~~~~
 */
async function loadFromServer(key) {
    let item = [];
    item = JSON.parse(backend.getItem(key)) || [];
    return Array.from(item);
}


/**
 * Saves the data to the server
 * @param {String} key 
 * @param {Array} item 
 */
async function saveOnServer(key, item) {
    itemAsString = JSON.stringify(item);
    await backend.setItem(key, itemAsString);
}


/**
 * Reads the page name and converts it to a container ID
 * @returns String
 */
function getPageName() {
    let path = window.location.pathname;
    path = path.split('/').pop();
    path = path.split('.').shift();
    path = 'menu-' + path;

    return path;
}


/**
 * Highlightes the menu item for the current page
 */
function controlMenuHighlighting() {
    const path = getPageName();

    if (path != 'menu-help') {
        let menuToActivate = document.getElementById(path);
        menuToActivate.classList.add('nav-item-active');
    }
}


/**
 * Toggles the visibility of the context menu
 * @param {Object} ctxMenuId The ID of the context menu
 */
function toggleContextMenu(ctxMenuId) {
    const ctxMenu = document.getElementById(ctxMenuId);

    if (ctxMenu.classList.contains('d-none')) {
        showCtxMenu(ctxMenu);
    }
    else {
        hideCtxMenu(ctxMenu);
    }
}


/**
 * Logout and reset currentUser
 */
async function logout() {
    currentUser = [];
    await saveOnServer('currentUser', currentUser);
    window.location.href = './index.html';
}


/**
 * Validating that full name is given
 * @param {Object} username The input field for the user name
 * @param {String} msgElemId The ID of the HTML message element
 * @param {String} className The CSS class name to be used
 * @returns Boolean
 */
function nameValidation(username, msgElemId, className) {
    if (!username.value.trim().includes(' ')) {
        document.getElementById(msgElemId).classList.remove(className);
        return false;
    }
    else {
        document.getElementById(msgElemId).classList.add(className);
        return true;
    }
}


/**
 * Create initials from first letters of ssername
 * @param {String} name The full name of the user
 * @returns String
 */
function getInitials(name) {
    const fullName = name.split(' ');
    const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
    return initials.toUpperCase();
}


/**
 * Generate random color for User initials background
 * @returns HSL color as String
 */
function generateColors() {
    let h = Math.floor(Math.random() * 359);
    return color = `hsl(${h}, 100%, 50%)`;
}


/**
 * Shows the popup "Task added to board" with animation
 */
function showPopup(id) {
    let popup = document.getElementById(id);

    popup.classList.add('animation');
    setTimeout(function () {
        removeAnimate(popup);
    }, 3000);
}


/**
 * Removes the animation class from the little popup
 * @param {string} popup Little Popup 
 */
function removeAnimate(popup) {
    popup.classList.remove('animation');
}


/**
 * Opens the logout container
 */
function openLogout() {
    let logoutContainer = document.getElementById("logoutContainer");
    logoutContainer.style.display = "block";
}


/**
 * Closes the logout container and redirects to index.html
 */
async function logout() {
    currentUser = [];
    await saveOnServer('currentUser', currentUser);
    window.location.href = './index.html';
}

/**
 * 
 * @param {} destination  The destination page
 */
function routeToPage(destination) {
    window.location.href = destination;

}

