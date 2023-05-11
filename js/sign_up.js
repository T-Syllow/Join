/**
 * Registers a new user by submitting the Sign up form
 * @param {Object} e - The event object for the form submission
 * @returns {boolean} Returns false to prevent the form from actually submitting
 */
async function registerUser(e) {
    e.preventDefault();
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    if (!validateName(username)) return false;
    const [prename, name] = username.value.split(' ');
    const contact = { prename, name, short_name: getInitials(username.value), email: email.value, password: password.value, phone: "", favouriteColor: generateColors() };
    const userExists = contacts.some(contact => contact.email === email.value);
    userExists ? showSignupPopup('popup-failed-signup') : (contacts.push(contact), await backend.setItem('contacts', JSON.stringify(contacts)), showSignupPopup('popup-success-signup'), setTimeout(() => window.location.href = './index.html?msg=success', 3000));
    return false;
}


/**
 * Validates the username field using the nameValidation function
 * @param {HTMLElement} username - The HTML element for the username input field
 * @returns {boolean} Returns the result of the nameValidation function
 */
function validateName(username) {
    return nameValidation(username, 'name-validation', 'hidden');
}


/**
 * Extracts and returns the first name from a full name string
 * @param {string} fullName - The full name string
 * @returns {string} The first name in the full name string
 */
function getUserPrename(fullName) {
    const prenameName = fullName.split(' ');
    return prenameName[0];
}


/**
 * Extracts and returns the last name from a full name string
 * @param {string} fullName - The full name string
 * @returns {string} The last name in the full name string
 */
function getUserName(fullName) {
    const prenameName = fullName.split(' ');
    return prenameName[1];
}


/**
 * Checks if a contact with the given email already exists in the contacts array
 * @param {string} email - The email address of the contact to check
 * @returns {Object|undefined} Returns the contact object if it exists, otherwise undefined
 */
function checkUserExistence(email) {
    const user = contacts.find(c => c.email == email);
    return user;
}


/**
 * Creates a new contact object with the given details
 * @param {string} prename - The first name of the contact
 * @param {string} name - The last name of the contact
 * @param {string} shortName - The short name of the contact
 * @param {string} email - The email address of the contact
 * @param {string} password - The password of the contact
 * @param {string} favouriteColor - The favourite color of the contact
 * @returns {Object} The new contact object
 */
function createNewContact(prename, name, shortName, email, password, favouriteColor) {
    const newContact = {
        prename: prename,
        name: name,
        short_name: shortName,
        email: email,
        password: password,
        phone: "",
        favouriteColor: favouriteColor
    };
    return newContact;
}


/**
 * Adds a contact object to the contacts array
 * @param {Object} contact - The contact object to add
 */
function addContactToContacts(contact) {
    contacts.push(contact);
}


/**
 * Saves the current contacts array to the backend using the backend.setItem method
 * @returns {Promise<void>} A Promise that resolves when the contacts are successfully saved to the backend
 */
async function saveContactsToBackend() {
    await backend.setItem('contacts', JSON.stringify(contacts));
}


/**
 * Redirects the user to the homepage after a successful signup
 */
function redirectToHomepage() {
    setTimeout(function () { window.location.href = './index.html?msg=success'; }, 3000);
}


/**
 * Shows a popup with animation
 * @param {string} id
 */
function showSignupPopup(id) {
    let popup = document.getElementById(id);
    popup.classList.add('login_animation');
    setTimeout(function () {
        removeAnimationSignup(popup);
    }, 3000);
}


/**
 * Removes the animation class from popup
 * @param {string} popup 
 */
function removeAnimationSignup(popup) {
    popup.classList.remove('login_animation');
}