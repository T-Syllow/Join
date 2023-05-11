setURL('https://tommy-syllow.developerakademie.net/smallest_backend_ever');

let currentUser = [];
let prioCount = 0;
let contacts = [];
let counts = [];
let currentDraggedElement;
let subtaskChecked = [];


/**
 * Initiates the main page
 */
async function init() {
    loadBoard();
    loadingFinished();

}


/**
 * Loads all data from the server for the board
 */
async function loadBoard() {
    await downloadFromServer();
    await loadContacts();
    allTasks = JSON.parse(backend.getItem('allTasks'));
    contacts = JSON.parse(backend.getItem('contacts'));
    currentUser = JSON.parse(backend.getItem(currentUser));
    categories = JSON.parse(backend.getItem('categories')) || [];
    await includeHTML();
    loadTask();
    countTasks();
    document.getElementById('board_Link').classList.add('menuLinkActive');
}





/**
 * Removes the preloader when the page is loaded
 */
function loadingFinished() {
    document.getElementById('preloader').classList.add('d-none');
}

/**
 * routes the page to a page on server related to the path
 * @param {path} destination 
 */
function routeToPage(destination) {
    window.location.href = destination;
}


/**
 * Initiates the tasks
 */
function loadTask() {
    cleanAreas();
    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        let id = task['id'];
        if (allTasks[i].state == "todo") {
            renderTodo(task, i, id)
        } else if (allTasks[i].state == "progress") {
            renderProgress(task, i, id)
        } else if (allTasks[i].state == "feedback") {
            renderFeedback(task, i, id)
        } else if (allTasks[i].state == "done") {
            renderdoneArea(task, i, id);
        }
    }
}

/**
 * cleans the Areas
 */

function cleanAreas() {
    let toDoTasks = document.getElementById("todoArea");
    let progressTasks = document.getElementById("progressArea");
    let feedbackTasks = document.getElementById("feedbackArea");
    let doneTasks = document.getElementById("doneArea");
    toDoTasks.innerHTML = "";
    progressTasks.innerHTML = "";
    feedbackTasks.innerHTML = "";
    doneTasks.innerHTML = "";

}

/**
 * Initiates the render Todo
 * 
 * @param {number} id - number to get the correct task
 * @param {JSON} task - contains informations for a task
*/

function renderTodo(task, i, id) {
    document.getElementById("todoArea").innerHTML += renderTask(task, i);
    renderProgressBar(task, id,);
    renderAssigned(id);
}

/**
 * Initiates the render Progress
 * 
 * @param {number} id - number to get the correct task
 * @param {JSON} task - contains informations for a task
*/
function renderProgress(task, i, id,) {
    document.getElementById("progressArea").innerHTML += renderTask(task, i);
    renderProgressBar(task, id,);
    renderAssigned(id);
}

/**
 * Initiates the render Feedback
 * 
 * @param {number} id - number to get the correct task
 * @param {JSON} task - contains informations for a task
*/
function renderFeedback(task, i, id) {
    document.getElementById("feedbackArea").innerHTML += renderTask(task, i);
    renderProgressBar(task, id,);
    renderAssigned(id);
}

/**
 * Initiates the render done
 * 
 * @param {number} id - number to get the correct task
 * @param {JSON} task - contains informations for a task
*/
function renderdoneArea(task, i, id) {
    document.getElementById("doneArea").innerHTML += renderTask(task, i);
    renderProgressBar(task, id,);
    renderAssigned(id);
}

/**
 * Initiates the function to render the progressbar
 * 
 * @param {number} id - number to get the correct task
 * @param {JSON} task - contains informations for a task
*/
function renderTask(task, id, i) {
    return /* html */ `    <div draggable="true" id="${task['id']}" class="taskContainer" ondragstart="startDragging(${task['id']})"  onclick="openTask(id)">
    <div style="background-color: ${task['category'][1]};" class="categoryContainer">
        ${task['category'][0]}</div>
    <div class="titleContainer"> ${task['title']}</div>
    <div class="descriptionContainer">${task['description']}</div>
    <div id="subTaskContainer${id}" class="subTaskContainer"></div>
    <div class="contactsPrioContainer">
    <div id="boardInitials${id}" class="contactsPictureContainer"></div>
    <div class="prioImage"><img class="#" src="./assets/img/prio_${task['priority']}1.png"></div>
    </div>
</div>
</div>`
}


/**
 * Initiates the function to render the progressbar
 * 
 * @param {number} id - number to get the correct task
 * @param {JSON} task - contains informations for a task
*/
function renderProgressBar(task, id,) {
    if (task.subtasks.length == 0) {
    } else {
        let percent = task['subtasksChecked'].length / task['subtasks'].length
        percentProgress = percent * 100
        document.getElementById(`subTaskContainer${id}`).innerHTML += renderSubtaskContainer(id, allTasks);
        document.getElementById(`progressBar${id}`).style = `width: ${percentProgress}%`;

    }
}


/**
 * Renders progressbar
 * 
 * @param {number} id - number to get the correct task
 * @param {JSON} task - contains informations for a task
*/
function renderSubtaskContainer(id, allTasks) {
    return /* html */ `
    <div class="progressBarContainer">
    <div id="progressBar${id}" class="progressBar"></div>
    </div>
        <div id="subtaskCheckedCount" class="subtaskCheckedCount">${allTasks[id]['subtasksChecked'].length}</div>
        <div class="subTasksCount">/${allTasks[id]['subtasks'].length} Done</div>
    </div>`;
}


/**
 * Initiates the function to render assigned
 * 
 * @param {number} id - number to get the correct task
*/
function renderAssigned(id) {
    let task = allTasks[id];
    let assignedName = task['contactNames'];
    document.getElementById(`boardInitials${id}`).innerHTML = '';
    for (let k = 0; k < assignedName.length; k++) {
        const fullname = assignedName[k];
        let splitNames = fullname.split(' ');
        let bothLetters = splitNames[0].charAt(0) + splitNames[1].charAt(0);
        let favouriteColor = contacts[k].favouriteColor;
        document.getElementById(`boardInitials${id}`).innerHTML += renderInitials(favouriteColor, bothLetters);
    }
}


/**
 * Renders assigned
 * 
 * @param {number} id - number to get the correct task
*/

function renderInitials(favouriteColor, bothLetters) {
    return /* html */`
    <div class="boardInitialsInitials">
    <div class="boardInitialsShortName" style="background-color: ${favouriteColor};">${bothLetters}</div>     
    </div>
    `;
}


/**
 * Drag and drop function
 * @param {*} id  id of the task
 */
function startDragging(id) {
    currentDraggedElement = id;
    prioCount = 0;
}


/**
 * allows dropping dragged element
 * @param {event} ev the event occuring. Usually a touch or click
 */
function allowDrop(ev) {
    ev.preventDefault();
}
/**
 * moves the dragged task to the state container
 * @param {state} state the state of the task usually todo, progress, done, in preview
 */
async function moveTo(state) {
    allTasks[currentDraggedElement]['state'] = state;
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    init();
}

/**
 * highlights the dragged task
 * @param {id} id the id of the dragged task
 */
function dragHighlight(id) {
    document.getElementById(id).classList.add('dragAreaHighlight');
}

/**
 * unhighlights the dragged task
 * @param {id} id the id of the dragged task
 */
function removedragHighlight(id) {
    document.getElementById(id).classList.remove('dragAreaHighlight');
}



/**
 * function to create variable for function countNumbs
*/
function countTasks() {
    let numbTodo = document.getElementById("todoArea").childElementCount;
    let numbProgress = document.getElementById("progressArea").childElementCount;
    let numbFeedback = document.getElementById("feedbackArea").childElementCount;
    let numbArea = document.getElementById("doneArea").childElementCount;
    let numbTask = numbTodo + numbProgress + numbFeedback + numbArea;
    countNumbs(numbTodo, numbProgress, numbFeedback, numbArea, numbTask);
}


/**
 * function to count tasks and save in backend
 * 
*@param {string} numbTodo - variable to get number of todo 
@param {string} numbProgress - variable to get number of progress
@param {string} numbFeedback - variable to get number of feedback
@param {string} numbArea - variable to get number of area 
@param {string} numbTask - variable to get number of task
*/
async function countNumbs(numbTodo, numbProgress, numbFeedback, numbArea, numbTask) {
    let countsBoard = {
        'todoCount': numbTodo,
        'progressCount': numbProgress,
        'feedbackCount': numbFeedback,
        'doneCount': numbArea,
        'boardCount': numbTask,
    };
    counts.push(countsBoard)
    await backend.setItem("counts", JSON.stringify(counts));
}



/**
 * function to open the task
 * 
 * @param {number} id - number to get the correct task
 */

function openTask(id) {
    document.getElementById('TaskOverview').classList.remove('d-none');
    document.getElementById('TaskCard').innerHTML = '';
    renderFullscreenView(id);
    idCounter = id;
}


/**
 * function to get all informations for the open task
 * 
 * @param {number} id - number to get the correct task
 */

async function renderFullscreenView(id) {
    let task = allTasks[id];
    let title = task['title'];
    let contactNames = task['contactNames'];
    let description = task['description'];
    let category = task['category'];
    let date = task['date'];
    let prio = task['priority'];
    let subtask = task['subtasks']['name'];
    let color = task['color'];

    document.getElementById('TaskCard').innerHTML = generateFullscreenView(id, title, description, category, color, date, prio);
    generateAssignedToOverlay(id, contactNames);
    generateSubtaskOverlay(id, subtask);
}


/**
 * function to show the open Task with all informations
 * 
 * @param {number} id - number to geht the correct task
 * @param {string} title - title for task
 * @param {string} description - description for task
 * @param {string} category - categrory fot task
 * @param {number} color - color fot the category
 * @param {Date} date - date for the dateline to finish the task
 * @param {string} prio - priority for the task
 * @returns 
 */

function generateFullscreenView(id, title, description, category, color, date, prio) {
    return /*html*/`
    <div class="innerContentBoxOverlay">
        <img class="overlayTaskClose" src="assets/img/cross.png" onclick="closeOverview()">
        <img class="overlayTaskEdit" src="assets/img/editTask_button.png" onclick="displayEditTask(${id})">
        <img class="deleteButton" src="assets/img/deleteButton.svg" onclick="deleteTask(${id})">
        <div class="overlayCategory" style="background-color: ${category[1]}";>${category[0]}</div>
        <div class="overlayTitle"><h5>${title}</h5></div>
        <div class="overlayDiscription">${description}</div>
        <div class="overlayDate"> <div><b>Due date:</b></div> <div>${date}</div> </div>
        <div class="overlayPrio"><div><b>Priority:</b></div><div class="overlayCardPrio ${prio}"> <div> ${prio}</div><img src='assets/img/prio_${prio}_white1.png'></div></div>
        <div id="overlaySubtasks" class="overlaySubtasks"><b>Subtasks:</b></div>
        <div><b>Assigned To:</b></div>
        <div id="overlayInitials" class="overlayInitialArea">
        </div>
    </div>
    `;
}

/**
 * Deletes a task from the `allTasks` array.
 *
 * @param {number} id - The ID of the task to delete.
 */
async function deleteTask(id) {
    const task = allTasks[id];
    allTasks.splice(id, 1);

    for (let i = id; i < allTasks.length; i++) {
        allTasks[i].id--;
    }

    await backend.setItem('allTasks', JSON.stringify(allTasks));
    closeOverview();
    init();
}

/**
 * function to show the contact names for the task
 * 
 * @param {number} id - number to get the correct task
 * @param {string} contactNames - name assigned to the task
 */

function generateAssignedToOverlay(id, contactNames) {
    document.getElementById(`overlayInitials`).innerHTML = '';
    for (let t = 0; t < contactNames.length; t++) {
        const fullname = contactNames[t];
        let splitNames = fullname.split(' ');
        let bothLetters = splitNames[0].charAt(0) + splitNames[1].charAt(0);
        let favouriteColor = contacts.find(contact => contact.name === splitNames[1]).favouriteColor;
        document.getElementById(`overlayInitials`).innerHTML +=/*html*/`
          <div class="overlayInitials">
            <div class="overlayTaskShortName" style="background-color: ${favouriteColor};">${bothLetters}</div>
            <div class="overlayCardName">${fullname}</div>        
          </div>
        `;
    }
}


/**
 * Adds all subtasks of the selected main task to the "overlaySubtasks" div.
 * 
 * @param {number} id - The ID of the selected main task.
 * @param {string} subtask - The information about the subtask.
 */

function generateSubtaskOverlay(id, subtask) {
    // document.getElementById('overlaySubtasks').innerHTML ='';

    for (let i = 0; i < allTasks[id]['subtasks'].length; i++) {
        const subtask = allTasks[id]['subtasks'][i];
        const isChecked = subtask.state === 'isChecked';

        document.getElementById('overlaySubtasks').innerHTML +=/*html*/`
            <div class="singleSubTask">
                <input type="checkbox" id="${id}-${i}" ${isChecked ? 'checked' : ''} onclick="subtaskIsChecked(${id},${i})">
                <h5>${subtask.name}</h5>
            </div> 
        `;
    }
}


/**
 * this function is checking if a subtask is checked and saves it
 * 
 */

async function subtaskIsChecked(id, index) {
    const task = allTasks[id];
    const subtask = task.subtasks[index];
    if (document.getElementById(`${id}-${index}`).checked) {
        subtask.state = 'isChecked';
        allTasks[id]['subtasksChecked'].push(allTasks[id]['subtasks'][index]['name'])
    } else {
        subtask.state = 'todo';
        allTasks[id]['subtasksChecked'].pop(allTasks[id]['subtasks'][index]['name'])
    }
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    init()
}

/**
 * closes the overview of the selected task
 * @param {id} id id of the taskoverview popup
 */
function closeOverview(id) {
    document.getElementById('TaskOverview').classList.add('d-none');
}

/**
 * todo
 * @param {index} i an index
 */
function mouseOverBoard(i) {
    document.getElementById('pathA' + i).classList.add('pathA');
    document.getElementById('pathB' + i).classList.add('pathA');
    document.getElementById('rect' + i).classList.add('rect');
}

/**
 * todo
 * @param {index} i an index
 */
function mouseOutBoard(i) {
    document.getElementById('pathA' + i).classList.remove('pathA');
    document.getElementById('pathB' + i).classList.remove('pathA');
    document.getElementById('rect' + i).classList.remove('rect');
}

/**
 * function to search Task in board
 */
function searchTasks() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    showSearchedTask(search);
}

/**
 * function to show searched task
 * 
 * @param {string} search - search is the value from the search input field
 */
function showSearchedTask(search) {
    for (let i = 0; i < allTasks.length; i++) {
        let currentTask = allTasks[i]['title'];
        let currentDescription = allTasks[i]['description'];
        document.getElementById(i).classList.add('d-none');
        if (currentTask.toLowerCase().includes(search) || currentDescription.toLowerCase().includes(search)) {
            document.getElementById(i).classList.remove('d-none');

        }
    }
}


