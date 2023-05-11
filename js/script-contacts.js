setURL('https://tommy-syllow.developerakademie.net/smallest_backend_ever');

let contacts = [];
let startingLetters = [];
let existingLetterIndex = 0;
let currentContactIndex = 0;
let currentUser;


/**
 * removes the loader gif.
 */
function loadingFinished() {
    document.getElementById('preloader').classList.add('d-none');
}


/**
 * sets up the contacts application.
 * @param contacts - contains accounts of the company.
 * @param startingLetters - temporary container for sorting contacts in the UI list.
 * @param existingLetterIndex - helper data for iterating over startingletters.
 */
async function loadContactSite() {
    await downloadFromServer();
    contacts = await JSON.parse(backend.getItem('contacts'));
    startingLetters = []
    existingLetterIndex = 0;
    sortContacts();
    loadNameStartingLetters();
    await includeHTML();
    buildContactList();
    document.getElementById('contacts_Link').classList.add('menuLinkActive')
}


/**
 * starts the setup of contacts application.
 */
async function init() {
    await loadContactSite();
    loadingFinished();
}


/**
 * displays a contact in the overview container
 */
function displayContact(index) {
    document.getElementById('overview_contact_name').innerHTML = contacts[index].prename + " " + contacts[index].name;
    document.getElementById('overview_contact_email').innerHTML = contacts[index].email;
    document.getElementById('overview_contact_phone').innerHTML = contacts[index].phone;
    document.getElementById('contacts_overview_container').classList.remove('d-none');
    document.getElementById('contacts_overview_contact_pictureContainer').style.backgroundColor = contacts[index].favouriteColor;
    document.getElementById('contacts_overview_contact_picture').innerText = getNamePrefix(index);
    activateContactEntry(index);
    if (isMobile()) {
        document.getElementById('contacts_overview').classList.add('d-show');
        document.getElementById('contacts_list').classList.add('d-none');
        document.getElementById('showMobileContactListArrow').classList.remove('d-none');
        document.getElementById('addContact_button').classList.add('d-none');
        document.getElementById('overview_body_editContact_container').classList.add('overview-body-editContact-container-mobile');
        document.getElementById('overview_body_editContact_container_img').src = "./assets/img/pencil_white.png";
    }
}


/**
 * checks wether the screen is mobile
 */
function isMobile() {
    let viewportWidth = 0;
    viewportWidth = window.innerWidth;
    if (viewportWidth <= 1028) {
        return true;
    }
    return false;
}


/**
 * makes adjustments for mobile view in the contacts application
 */
function showContactListMobile() {
    document.getElementById('contacts_overview').classList.remove('d-show');
    document.getElementById('contacts_list').classList.remove('d-none');
    document.getElementById('addContact_button').classList.remove('d-none');
}


/**
 * sets the css property of a clicked contact to make visible the contact is now displayed.
 */
function activateContactEntry(contactIndex) {
    currentContactIndex = contactIndex;
    let allContactlistEntries = document.querySelectorAll('.contacts-list-contact');
    allContactlistEntries.forEach(contactEntry => {
        contactEntry.classList.remove('contactActive');
    });
    document.getElementById('contacts_list_contact_' + contactIndex).classList.add('contactActive');
}


/**
 * helper function for the contacts list starting letters of each past name
 */
function findStartingLetters() {
    contacts.forEach(contact => {
        startingLetters.push(contact.name.charAt(0));
    });

    startingLetters = startingLetters.filter((element, index) => {
        return startingLetters.indexOf(element) === index;
    });
}


/**
 * sorts the contacts on their past name
 */
function sortContacts() {
    contacts.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
}


/**
 * iterates over the contacts array to display all contacts in the contacts list.
 */
function buildContactList() {
    document.getElementById('contacts_list').innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
        document.getElementById('contacts_list').innerHTML += generateContactListEntry(i);
        setFavouriteBackgroundColor(i);
    }
}


/**
 * initializes the startingletters array out of the contacts array based on the past name of each contact.
 */
function loadNameStartingLetters() {
    for (let i = 0; i < contacts.length; i++) {
        startingLetters.push(contacts[i].name.charAt(0));
        startingLetters = [...new Set(startingLetters)];
    }
}


/**
 * helper function for filling the startingletter array with unique characters of the contacts past name.
 */
function isNameStartingWithExistingLetter(contactIndex) {
    if (existingLetterIndex <= 0) {
        existingLetterIndex++;
        return false;
    }
    for (let i = 0; i < existingLetterIndex; i++) {
        if (contacts[contactIndex].name.charAt(0).includes(startingLetters[i])) {
            return true;
        }
    }
    existingLetterIndex++;
    return false;
}


/**
 * sets the favourite backgroundcolor of each contact as their background behind the starting letters of this contact in the UI
 */
function setFavouriteBackgroundColor(contactIndex) {
    document.getElementById('contacts_list_contact_pictureContainer_' + contactIndex).style.backgroundColor = contacts[contactIndex].favouriteColor;
}


/**
 * getter for contacts shortname. starting letter of first and past name together.
 */
function getNamePrefix(contactIndex) {
    return contacts[contactIndex].short_name;
}


/**
 * generates the html for filling the contacts list with contacts and writing the correct starting letter over contacts with same starting letter of the past name.
 */
function generateContactListEntry(index) {
    if (!isNameStartingWithExistingLetter(index)) {
        return `
            <div class="contact-list-letterSeperator-section">
                <span class="contacts-list-letter">${startingLetters[existingLetterIndex - 1]}</span>
                <hr class="contacts-list-headrow">
            </div>
            <div id="contacts_list_contact_${index}" class="contacts-list-contact" onclick="displayContact(${index})">
                <div id="contacts_list_contact_pictureContainer_${index}" class="contacts-list-contact-pictureContainer">
                    <span id="contacts_list_contact_picture_${index}" class="contacts-list-contact-picture">
                        ${contacts[index].short_name}
                    </span>
                </div>
                <div class="contacts-list-contact-keys">
                    <h3 id="contacts-list-contact-keys-name-${index}" class="contacts-list-contact-keys-name">${contacts[index].prename + " " + contacts[index].name}</h3>
                    <a id="contacts-list-contact-keys-email-${index}" class="contacts-list-contact-keys-email" href="#">${contacts[index].email}</a>
                </div>
            </div>
    `;
    }
    return `
    <div id="contacts_list_contact_${index}" class="contacts-list-contact" onclick="displayContact(${index})">
        <div id="contacts_list_contact_pictureContainer_${index}" class="contacts-list-contact-pictureContainer">
            <span id="contacts_list_contact_picture_${index}" class="contacts-list-contact-picture">
                ${contacts[index].short_name}
            </span>
        </div>
        <div class="contacts-list-contact-keys">
            <h3 id="contacts-list-contact-keys-name-${index}" class="contacts-list-contact-keys-name">${contacts[index].prename + " " + contacts[index].name}</h3>
            <a id="contacts-list-contact-keys-email-${index}" class="contacts-list-contact-keys-email" href="#">${contacts[index].email}</a>
        </div>
    </div>
    `;
}


/**
 * enables the view on the add-contacts card.
 */
function displayAddContact() {
    document.getElementById('contactAddPopUp-container').classList.remove('hideAddContact');
    document.getElementById('contactsWrapper').style.filter = "blur(3px)";
}


/**
 * disables the view on the add-contacts card.
 */
function hideAddContact() {
    document.getElementById('contactAddPopUp-container').classList.add('hideAddContact');
    document.getElementById('contactsWrapper').style.filter = "blur(0px)";
}


/**
 * enables the view on the edit-contacts card.
 */
function displayEditContact() {
    document.getElementById('contactEditPopUp-container').classList.remove('hideEditContact');
    document.getElementById('edit-prename-input').value = contacts[currentContactIndex].prename;
    document.getElementById('edit-name-input').value = contacts[currentContactIndex].name;
    document.getElementById('edit-email-input').value = contacts[currentContactIndex].email;
    document.getElementById('edit-phone-input').value = contacts[currentContactIndex].phone;
    document.getElementById('contactsWrapper').style.filter = "blur(3px)";

}


/**
 * disables the view on the edit-contacts card.
 */
function hideEditContact() {
    document.getElementById('contactEditPopUp-container').classList.add('hideEditContact');
    document.getElementById('contactsWrapper').style.filter = "blur(0px)";
}


/**
 * updates the shortname of a contact
 */
function updateShortname(name) {
    contacts[currentContactIndex].short_name = contacts[currentContactIndex].prename.charAt(0).toUpperCase() + name.charAt(0).toUpperCase();
}


/**
 * creates a shortname of a contact
 */
function createShortname(prename, name) {
    return prename.charAt(0).toUpperCase() + name.charAt(0).toUpperCase();
}


/**
 * creates a contact out of the add contact popup card, saves in backend and navigates the ui back to the start of the contacts application.
 * @param contactPreName - the contacts pre name.
 * @param contactName - the contacts past name
 * @param contactEmail - the contacts email.
 * @param contactPhone - the contacts phonenumber.
 * @param newContact - the contact as a json.
 */
async function addContact() {
    let contactPreName = document.getElementById('add_prename_input').value.trim();
    contactPreName = contactPreName.charAt(0).toUpperCase() + contactPreName.slice(1);
    let contactName = document.getElementById('add_name_input').value.trim();
    contactName = contactName.charAt(0).toUpperCase() + contactName.slice(1);
    let contactEmail = document.getElementById('add_email_input').value;
    let contactPhone = document.getElementById('add_phone_input').value;
    let newContact = {
        "prename": contactPreName,
        "name": contactName,
        "short_name": createShortname(contactPreName, contactName),
        "email": contactEmail,
        "password": 'test123',
        "phone": contactPhone,
        "favouriteColor": "rgba(255, 122, 0, 1)"
    };
    contacts.push(newContact);
    await backend.setItem("contacts", JSON.stringify(contacts));
    window.location.href = "./contacts.html";
}


/**
 * edits a contact out of the edit contact popup card, saves in backend and navigates the ui back to the start of the contacts application.
 * @param contactPreName - the contacts pre name.
 * @param contactName - the contacts past name
 * @param contactEmail - the contacts email.
 * @param contactPhone - the contacts phonenumber.
 * @param newContact - the contact as a json.
 */
async function editContact() {
    let contactPreName = document.getElementById('edit-prename-input').value.trim();
    contactPreName = contactPreName.charAt(0).toUpperCase() + contactPreName.slice(1);
    let contactName = document.getElementById('edit-name-input').value.trim();
    contactName = contactName.charAt(0).toUpperCase() + contactName.slice(1);
    let contactEmail = document.getElementById('edit-email-input').value;
    let contactPhone = document.getElementById('edit-phone-input').value;

    updateShortname(contactName);
    const newContact = {
        "prename": contactPreName,
        "name": contactName,
        "short_name": contacts[currentContactIndex].short_name,
        "email": contactEmail,
        "password": contacts[currentContactIndex].password,
        "phone": contactPhone,
        "favouriteColor": contacts[currentContactIndex].favouriteColor
    };
    contacts[currentContactIndex] = newContact;
    await backend.setItem("contacts", JSON.stringify(contacts));
    window.location.href = "./contacts.html";
}


/**
 * Deletes the current contact from the contacts array and updates the UI accordingly.
 *
 * @return {void}
 */
function deleteContact() {
    contacts.splice(currentContactIndex, 1);
    backend.setItem('contacts', JSON.stringify(contacts));
    startingLetters = []
    existingLetterIndex = 0;
    sortContacts();
    loadNameStartingLetters();
    includeHTML();
    buildContactList();
    closeContactsOverview();
}


/**
 * Hides the contacts overview UI and resets its state to the initial state on mobile devices.
 *
 * @return {void}
 */
function closeContactsOverview() {
    document.getElementById('contacts_overview_container').classList.add('d-none');
    if (isMobile()) {
        document.getElementById('contacts_overview').classList.remove('d-show');
        document.getElementById('contacts_list').classList.remove('d-none');
        document.getElementById('showMobileContactListArrow').classList.add('d-none');
        document.getElementById('addContact_button').classList.remove('d-none');
        document.getElementById('overview_body_editContact_container').classList.remove('overview-body-editContact-container-mobile');
        document.getElementById('overview_body_editContact_container_img').src = "./assets/img/pencil_white.png";
    }
}
