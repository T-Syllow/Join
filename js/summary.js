setURL('https://tommy-syllow.developerakademie.net/smallest_backend_ever');

let counts = [];
let prioCount = 0;

/**
 * 
 *Initiates the summary page
 */
async function init() {
    await loadSummary();
    loadingFinished();
}


/**
 * 
 * Loads the contents
 */
async function loadSummary() {
    await downloadFromServer();
    const date = new Date();
    const dateFormatted = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'Europe/Berlin' }).format(date)
    document.getElementById('currentDate').innerHTML = dateFormatted;
    currentUser = JSON.parse(backend.getItem("currentUser"));
    allTasks = JSON.parse(backend.getItem('allTasks'));
    counts = JSON.parse(backend.getItem('counts'));
    await includeHTML();
    loadAtStart();
    greetUser();
    currentTasks();
    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        countPrio(task);
    }
    currentUrgent();
    document.getElementById('summary_Link').classList.add('menuLinkActive');
}


/**
 * 
 *Removes the preloader
 */
function loadingFinished() {
    document.getElementById('preloader').classList.add('d-none');
}


/**
 * 
 *Loads the User
 */
function loadAtStart() {
    document.getElementById('nameUser').innerHTML += `${currentUser.prename + ' ' + currentUser.name}`
}


/**
 * function to count tasks with priority: urgent and save in backend
 * 
*@param {JSON} task - contains informations for a task
*/
async function countPrio(task) {
    if (task['priority'] == 'Urgent') {
        prioCount++
    }
    await backend.setItem("prioCount", JSON.stringify(prioCount));
}


/**
 * 
 *Loads the numbers of each ammount of tasks
 */
function currentTasks() {
    for (let i = 0; i < counts.length; i++) {
        countsNumber = counts[i]
        document.getElementById('boardCount').innerHTML = countsNumber['boardCount'];
        document.getElementById('progressCount').innerHTML = countsNumber['progressCount'];
        document.getElementById('feedbackCount').innerHTML = countsNumber['feedbackCount'];
        document.getElementById('todoCount').innerHTML = countsNumber['todoCount'];
        document.getElementById('doneCount').innerHTML = countsNumber['doneCount'];
    }
}


/**
 * 
 *Shows the Ammount of urgent Tasks
 */
function currentUrgent() {
    if (prioCount != 0) {
        let urgentNumber = prioCount
        document.getElementById('urgentCount').innerHTML = urgentNumber;
    }
}


/**
 * 
 *Loads the welcome
 */
function greetUser() {
    let currentTime = new Date().getHours();
    // let name = ShowCurrentUserNameForSummery["userName"];
    if (currentTime < 12) {
        document.getElementById("greetTime").innerHTML = "Good morning, ";
    } else if (currentTime < 17) {
        document.getElementById("greetTime").innerHTML = "Good afternoon, ";
    } else {
        document.getElementById("greetTime").innerHTML = "Good evening, ";
    }
}


/**
 * Redirects the user to the specified destination page.
 *
 * @param {string} destination - The URL of the destination page.
 * @return {void}
 */
function routeToPage(destination) {
    window.location.href = destination;
}


/**
 * 
 *Activates hover Todo
 */
function mouseOverTodo(i) {
    document.getElementById('todo' + i).classList.add('linkBackground');
    document.getElementById('todo' + i).classList.add('textHover');
    document.getElementById('circle' + i).classList.add('circle');
    document.getElementById('pathBig' + i).classList.add('path');
    document.getElementById('pathSmall' + i).classList.add('path');
}


/**
 * 
 *Deactivates hover Todo
 */
function mouseOutTodo(i) {
    document.getElementById('todo' + i).classList.remove('linkBackground');
    document.getElementById('todo' + i).classList.remove('textHover');
    document.getElementById('circle' + i).classList.remove('circle');
    document.getElementById('pathBig' + i).classList.remove('path');
    document.getElementById('pathSmall' + i).classList.remove('path');
}


/**
 * 
 *Activates hover Done
 */
function mouseOverDone(i) {
    document.getElementById('todo' + i).classList.add('linkBackground');
    document.getElementById('todo' + i).classList.add('textHover');
    document.getElementById('circle' + i).classList.add('circle');
    document.getElementById('pathBig' + i).classList.add('stroke');
}


/**
 * 
 *Deactivates hover Done
 */
function mouseOutDone(i) {
    document.getElementById('todo' + i).classList.remove('linkBackground');
    document.getElementById('todo' + i).classList.remove('textHover');
    document.getElementById('circle' + i).classList.remove('circle');
    document.getElementById('pathBig' + i).classList.remove('stroke');
}


/**
 * 
 *Activates hover Small
 */
function mouseOverSmall(i) {
    document.getElementById('todo' + i).classList.add('linkBackground');
    document.getElementById('todo' + i).classList.add('textHover');
}


/**
 * 
 *Deactivates hover Small
 */
function mouseOutSmall(i) {
    document.getElementById('todo' + i).classList.remove('linkBackground');
    document.getElementById('todo' + i).classList.remove('textHover');
}


