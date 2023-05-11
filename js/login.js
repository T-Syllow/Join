
/**
 * Loading data from server
 */
async function initLogin() {
    await loadDataFromServer();
}


/**
 * Setting currentUser to Guest when Logging in as Guest
 */
async function guestLogin() {
    currentUser = {
        "prename": "Guest",
        "name": "",
        "short_name": "G",
        "email": "",
        "password": "",
        "phone": "",
        "favouriteColor": "HSL(150, 100%, 50%)",
    };
    await saveOnServer('currentUser', currentUser);
    window.location.href = './summary.html?login=1'
}


/**
 * Validating entered user data before login
 * @param {Object} e 
 * @returns {boolean}
 */
async function login(e) {
    e.preventDefault();
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    currentUser = contacts.find(c => c.email == email.value && c.password == password.value);
    if (currentUser) {
        await saveOnServer('currentUser', currentUser);
        window.location.href = './summary.html?login=2';
    } else {
        showPopupMessage('Email or password is incorrect or does not exist.');
        setTimeout(() => {
            hidePopupMessage();
        }, 3000);
    }
    return false
}


/**
 * Shows a popup message with animation
 */
function hidePopupMessage() {
    let popup = document.getElementById('popup-container');
    popup.innerHTML = '';
}


/**
 * Shows a popup message with animation
 * @param {string} id
 */
function upMessage(id) {
    let popup = document.getElementById(id);

    popup.classList.add('login_animation');
    setTimeout(function () {
        removeAnimation(popup);
    }, 3000);
}


/**
 * Removes the animation class from popup
 * @param {string} popup 
 */
function removeAnimation(popup) {
    popup.classList.remove('login_animation');
}


/**
 * Render password forgotten html
 */
function passwordForgotten() {
    hidePopupMessage();
    document.getElementById('login-master').innerHTML = `
    <div class="login_main signup_main forgotten_main">
        <a class="goback" href="./index.html"><img class="goback_img" src="./assets/img/arrow-left-signup.png"></a>
        <form class="login_form forgotten_form" onsubmit="onSubmit(event)">
            <h2>I forgot my password</h2>
            <img class="margin_underline" src="./assets/img/border-bottom.png">
            <span>Don't worry! We will send you an email with the instructions to reset your password.</span>
            <input class="input_email" id="email-field" type="email" name="email" placeholder="Email" required>
            <div class="login_form_buttons login_bottom_margin">
            <button type="submit" class="login_button">Send me the email</button></div>
        </form>             
    </div>
    `;
}


/**
 * 
 * @param {} message 
 */
function showPopupMessage(message) {
    // create a new element for the popup
    let popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = message;
    document.getElementById('popup-container').appendChild(popup);
}


/**
 * Sending email to reset password
 * @param {Object} event
 */
async function onSubmit(event) {
    event.preventDefault();
    if (checkIfEmailExists()) {
        let formData = new FormData(event.target); // create a FormData based on our Form Element in HTML
        let response = await action(formData);
        if (response.ok) {
            showPopupMessage('email-reset');
            setTimeout(function () {
                window.location.href = './index.html';
            }, 3000);
        }
    }
}


/**
 * Fetching php script to send mail
 * @param {Object} formData 
 * @returns 
 */
function action(formData) {
    const input = 'https://gruppenarbeit-join-474.developerakademie.net/smallest_backend_ever';
    const requestInit = {
        method: 'post',
        body: formData
    };

    return fetch(
        input,
        requestInit
    );
}


/**
 * Checking if user with entered Email exists
 */
function checkIfEmailExists() {
    let email = document.getElementById('email-field');
    let user = contacts.find(c => c.email == email.value);
    if (user) {
        return true;
    } else {
        showPopupMessage('Email does not exist!');
    }
}


/**
 * Check if passwords match and reset the password
 */
async function resetPassword(event) {
    event.preventDefault();
    let password1 = document.getElementById('password-field-1').value;
    let password2 = document.getElementById('password-field-2').value;
    if (password1 == password2) {
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get('email');
        let index = contacts.findIndex(c => c.email == userEmail);
        contacts[index]['password'] = password1;
        await saveOnServer('contacts', contacts);
        showSuccessMessage();
    } else {
        showPopupMessage('password-failed');
    }
}


/**
 * Show success message and return to Log in page
 */
function showSuccessMessage() {
    showPopupMessage('password-success');
    setTimeout(function () {
        window.location.href = './index.html';
    }, 3000);
}
