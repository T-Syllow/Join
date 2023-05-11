setURL('https://tommy-syllow.developerakademie.net/smallest_backend_ever');


let tasks = [];
let allTasks = [];
let priority = '"Low"';
let isPrioritySelected = false;
let selectedTitle;
let selectedDescription;
let selectedDate;
let activePriority;
let selectedSubtasks = [];
let allSubtasks = [];
let idCounter = 0;
let state = 'todo';
let subtasksChecked = [];



/**
 * Initiates the main page
 */
async function initTask() {
  await loadAddTask();
  loadingFinished();
  updateMin();
}


/**
 * Loads all data from the server
 * @returns {Array} allTasks
 */
async function loadAddTask() {
  await downloadFromServer();
  await loadContacts();
  allTasks = JSON.parse(backend.getItem('allTasks')) || [];
  categories = JSON.parse(backend.getItem('categories') || []);
  renderAllContacts();
  await includeHTML();
  loadAllTasks();
  console.log(allTasks)
  renderCategoryOptions();
  document.getElementById('addTask_Link').classList.add('menuLinkActive');
}


/**
 * Removes the preloader
 */
function loadingFinished() {
  document.getElementById('preloader').classList.add('d-none');
}


/**
 * Loads the requested data from server
 */
async function addTask() {
  if (isPrioritySelected) {
    document.getElementById('priorityAlertTemplate').classList.add('d-none');
    addDate();
    let task = {
      'title': selectedTitle,
      'description': selectedDescription,
      'category': selectedCategory,
      'color': selectedColor,
      'date': selectedDate,
      'contactNames': selectedContactNames,
      'priority': getActivePriority(),
      'subtasks': selectedSubtasks,
      'id': idCounter,
      'state': state,
      'subtasksChecked': subtasksChecked,
    };
    showInfo();
    await saveAllTasks(task);
    await backend.setItem('categories', JSON.stringify(categories));
    if (task.priority === 'urgent') {
      prioCount++;
    }
    clearValues();
    idCounter++;
    loadAllTasks();
    init();
    isPrioritySelected = false;
  } else {
    document.getElementById('priorityAlertTemplate').classList.remove('d-none');
  }
}


/**
 * Adds the selected title to the selected content.
 *
 * @return {void}
 */
function addTitle() {
  let title = document.getElementById('title');
  selectedTitle = '';
  selectedTitle = title.value;
}


/**
 * Adds the selected description to the selected content.
 *
 * @return {void}
 */
function addDescription() {
  let description = document.getElementById('description');
  selectedDescription = '';
  selectedDescription = description.value;
}


/**
 * Adds the selected date to the selected content.
 *
 * @return {void}
 */
function addDate() {
  selectedDate = document.getElementById('date').value;
}


/**
 * this function save the new created Task in the backend
 * 
 * @param {JSON} - task contains all informations for a task
 */

async function saveAllTasks(task) {
  allTasks.push(task);
  await backend.setItem('allTasks', JSON.stringify(allTasks));
  loadAllTasks();
}


/**
 * function to show a PopUp Information 
 */

function showInfo() {
  document.getElementById('createTaskBtn').classList.remove('d-none');
  setTimeout(function () {
    document.getElementById('createTaskBtn').classList.add('d-none');
  }, 3800);
}


/**
 * function to clear all values in AddTask template
 */

function clearValues() {
  resetVariables();
  resetContent();
}


/**
 * function to load all tasks from the backend
 */
function resetVariables() {
  selectedLetters = [];
  selectedContactNames = [];
  selectedSubtasks = [];
  allSubtasks = [];
}


/**
 * Resets the content of the form by clearing all the input fields and resetting any added subtasks or contacts.
 */
function resetContent() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('date').value = '';
  document.getElementById('newSubtasks').innerHTML = '';
  document.getElementById('newSubtaskInput').value = '';
  document.getElementById('addedContacts').innerHTML = '';
  document.getElementById('contact').value = '';
  for (let i = 0; i < allContacts.length; i++) {
    document.getElementById('contactButton' + i).innerHTML = '<img src="assets/img/button_rectangle.png">';
  }
  cancelNewCategory();
  closeCategories();
  resetPriority();
  closeContacts();
}


/**
 * function to close the opened contacts and categories field
 */
function closeContacts() {
  if ($(window).width() > 720) {
    document.getElementById('selectFieldContact').style.height = '50px';
  } else {
    document.getElementById('selectFieldContact').style.height = '43px';

  }
  document.getElementById('openedContacts').classList.add('d-none');
}


/**
 * Closes the category dropdown and sets the height of the select field depending on the window width.
 *
 * @return {void}
 */
function closeCategories() {
  if ($(window).width() > 720) {
    document.getElementById('selectField').style.height = '50px';
  } else {
    document.getElementById('selectField').style.height = '43px';
  }
  document.getElementById('openedCategories').classList.add('d-none');
}


/**
 * Load all tasks from local storage and display them in the list
 *
*/
async function loadAllTasks() {
  let allTasksAsString = await backend.getItem("allTasks");
  allTasks = JSON.parse(allTasksAsString) || [];
  idCounter = allTasks.reduce((maxId, task) => Math.max(maxId, task.id), -1) + 1;
  if (allTasks.length > 0) {
    idCounter = Math.max(...allTasks.map(task => task.id)) + 1;
  }
}


/**
 * Returns the number of tasks with a state of 'urgent' in the allTasks array.
 *
 * @return {number} The number of urgent tasks.
 */
function getUrgentCount() {
  let urgentCounter = 0;
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].state === 'urgent') {
      urgentCounter++;
    }
  }
  return urgentCounter;
}


/**
 * function for clicked or unclicked priority button to change the img
 * 
 * @param {string} prio
 * @returns 
 */
function renderPrioBtnClicked(prio) {
  return `
        <span>${prio.charAt(0).toUpperCase() + prio.slice(1)}</span>
        <img src="assets/img/prio_${prio}_white1.png" width="18px"/>
    `;
}


/**
 * Renders the HTML for an unclicked priority button with the specified priority level.
 *
 * @param {string} prio - The priority level to render.
 * @return {string} The HTML string for the unclicked priority button.
 */
function renderPrioBtnUnclicked(prio) {
  return `
        <span>${prio.charAt(0).toUpperCase() + prio.slice(1)}</span>
        <img src="assets/img/prio_${prio}1.png" width="18px"/>
    `;
}


/**
 * Function that returns the color of a priority button
 * 
 * @param {string} priority - The priority for which the color should be returned
 * @returns {string} - The color of the priority button
 */
function getButtonColor(priority) {
  switch (priority) {
    case "Urgent":
      return "#FF3D00";
    case "Medium":
      return "#FFA800";
    case "Low":
      return "#7AE229";
    default:
      return "#FFF"; // Standardfarbe, falls die Priorität nicht erkannt wird
  }
}


/**
* Function to change the background color and text color of a button
* 
* @param {HTMLElement} button - The button whose style is being changed
* @param {string} bgColor - The new background color of the button
* @param {string} textColor - The new text color of the button
*/
function changeButtonStyle(button, bgColor, textColor) {
  button.style.backgroundColor = bgColor;
  button.style.color = textColor;
}


/**
 * Function to change the text and style of a button when it is selected
 * 
 * @param {HTMLElement} button - The button that is selected
 * @param {string} priority - The priority of the selected button
 */
function selectButton(button, priority) {
  button.innerHTML = renderPrioBtnClicked(priority);
  changeButtonStyle(button, getButtonColor(priority), "#FFF");
}


/**
 * Function to change the text and style of a button when it is not selected
 * 
 * @param {HTMLElement} button - The button that is not selected
 * @param {string} priority - The priority of the unselected button
 */
function deselectButton(button, priority) {
  button.innerHTML = renderPrioBtnUnclicked(priority);
  changeButtonStyle(button, "#FFF", "#000");
}


/**
 * Function to select a priority button
 * 
 * @param {string} priority - The priority of the selected button
 */
function selectPriorityButton(priority) {
  let urgent = document.getElementById("urgentBtn");
  let medium = document.getElementById("mediumBtn");
  let low = document.getElementById("lowBtn");
  isPrioritySelected = true;

  switch (priority) {
    case "Urgent":
      selectButton(urgent, "Urgent");
      deselectButton(medium, "Medium");
      deselectButton(low, "Low");
      break;
    case "Medium":
      selectButton(medium, "Medium");
      deselectButton(urgent, "Urgent");
      deselectButton(low, "Low");
      break;
    case "Low":
      selectButton(low, "Low");
      deselectButton(urgent, "Urgent");
      deselectButton(medium, "Medium");
      break;
  }
}


/**
 * Function to choose the priority with a button
 * 
 * @param {string} priority - The priority selected with the button
 */
function choosePriority(priority) {
  selectPriorityButton(priority);
}


/**
 * function to get the active priority for backend
 * 
 * @returns 
 */
function getActivePriority() {
  let activePriority = "";
  let urgent = document.getElementById("urgentBtn");
  let medium = document.getElementById("mediumBtn");
  let low = document.getElementById("lowBtn");

  if (urgent.style.backgroundColor === "rgb(255, 61, 0)") {
    activePriority = "Urgent";
  } else if (medium.style.backgroundColor === "rgb(255, 168, 0)") {
    activePriority = "Medium";
  } else if (low.style.backgroundColor === "rgb(122, 226, 41)") {
    activePriority = "Low";
  }

  return activePriority;
}


/**
 * function to reset the priority buttons
 */
function resetPriority() {
  document.getElementById('urgentBtn').style.backgroundColor = '#FFF';
  document.getElementById('mediumBtn').style.backgroundColor = '#FFF';
  document.getElementById('lowBtn').style.backgroundColor = '#FFF';
  document.getElementById('urgentBtn').style.color = '#000';
  document.getElementById('mediumBtn').style.color = '#000';
  document.getElementById('lowBtn').style.color = '#000';
  document.getElementById('urgentBtn').innerHTML = renderPrioBtnUnclicked('Urgent');
  document.getElementById('mediumBtn').innerHTML = renderPrioBtnUnclicked('Medium');
  document.getElementById('lowBtn').innerHTML = renderPrioBtnUnclicked('Low');
}


/**
 * function to add a new Subtask to the subtasks list
 */
function addNewSubtask() {
  let newSubtaskInput = document.getElementById('newSubtaskInput');
  document.getElementById('newSubtasks').innerHTML = '';
  if (!newSubtaskInput.value == '') {
    let newSubtask = newSubtaskInput.value;
    allSubtasks.push(newSubtask);
    selectedSubtasks.push({ "name": newSubtask, "state": "todo" }); // add new subtask to selectedSubtasks
    for (let i = 0; i < allSubtasks.length; i++) {
      let subtaskImageSrc = changeImage(allSubtasks[i], selectedSubtasks); // pass selectedSubtasks to changeImage()
      document.getElementById('newSubtasks').innerHTML += showSubtask(i, allSubtasks[i], subtaskImageSrc);
    }
  }
  newSubtaskInput.value = '';
}


/**
 * function to change the image for selected subtasks
 * 
 * @param {string} newSubtask - the subtask(s) who was created in addNewSubtask()
 * @param {JSON} selectedSubtasks - All subtasks who are selected with the checkmark
 * @returns 
 */

function changeImage(newSubtask, selectedSubtasks) {
  let subtaskImageSrc = "assets/img/subtask_rectangle.png";
  if (selectedSubtasks && selectedSubtasks.some(task => task.name === newSubtask)) {
    subtaskImageSrc = "assets/img/subtask_check.png";
  }
  return subtaskImageSrc;
}


/**
 * function to show the new subtask and the correct image left to it. checkmark or rectangle
 * 
 * @param {number} i - number to check the correct subtask
 * @param {string} newSubtask - subtask which was written in the input field
 * @returns 
 */
function showSubtask(i, newSubtask) {
  const subtaskImageSrc = changeImage(newSubtask, selectedSubtasks);
  return `
    <div class="newSubtasks">
      <img src=${subtaskImageSrc} class="paddingRight" id="checkbox${i}" onclick="checkmark(${i})"><span class="newSubtask">${newSubtask}</span>
    </div>
  `;
}


/**
 * function to add or remove the checkmark next to the subtask
 * 
 * @param {number} i - number to checkmark the correct subtask 
 */

function checkmark(i) {
  const newSubtask = { "name": allSubtasks[i], "state": "todo" };
  const index = selectedSubtasks.findIndex(task => task.name === newSubtask.name);
  if (index === -1) {
    selectedSubtasks.push(newSubtask);
  } else {
    selectedSubtasks.splice(index, 1);
  }
  const subtaskImageSrc = changeImage(newSubtask.name, selectedSubtasks);
  document.getElementById('checkbox' + i).src = subtaskImageSrc;
}


/**
 * function to display AddTask template and create the state
 *
 * @param {string} type - type ist the state for the task
 */
async function displayAddTask(type) {
  await initTask();
  renderCategoryOptions();
  renderAllContacts();
  document.getElementById('addTaskPopUp-container').classList.remove('hideAddTask');
  if(document.getElementById('contentBoard') == null) {
    document.getElementById('contactsWrapper').style.filter = 'blur(3px)';
  } else {
    document.getElementById('contentBoard').style.filter = 'blur(3px)';
  }
  switch (type) {
    case "todo":
      state = "todo";
      break;
    case "progress":
      state = "progress";
      break;
    case "feedback":
      state = "feedback";
      break;
    case "done":
      state = "done";
      break;
    default:
      state = "todo";
      break;
  }
}


/**
 * Hides the add task popup and clears the values of the input fields.
 *
 * @return {void}
 */
function hideAddTask() {
  if (isPrioritySelected == true) {
    document.getElementById('addTaskPopUp-container').classList.add('hideAddTask');
    document.getElementById('contentBoard').style = '';
    clearValues();
  }
}

function hidePopupAddTask() {
  document.getElementById('addTaskPopUp-container').classList.add('hideAddTask');
  if(document.getElementById('contentBoard') == null) {
    document.getElementById('contactsWrapper').style = '';
  } else {
    document.getElementById('contentBoard').style = '';
  }
  
  
  clearValues();
}


/**
 * Hides the edit task popup and resets the popupAddTaskBoard container to its initial state.
 *
 * @return {void}
 */
function hideEditTask() {
  document.getElementById('editTaskPopUp-container').classList.add('hideAddTask');
  document.getElementById('popupAddTaskBoard').classList.add('d-none')
}


/**
 * function to choose the new priority in editTask
 * 
 * @param {string} priority - This is the priority you choose with the button
 */
function choosePriorityEdit(priority) {
  let urgent = document.getElementById("urgentBtnEdit");
  let medium = document.getElementById("mediumBtnEdit");
  let low = document.getElementById("lowBtnEdit");

  switch (priority) {
    case "Urgent":
      selectButton(urgent, "Urgent");
      deselectButton(medium, "Medium");
      deselectButton(low, "Low");
      break;
    case "Medium":
      selectButton(medium, "Medium");
      deselectButton(urgent, "Urgent");
      deselectButton(low, "Low");
      break;
    case "Low":
      selectButton(low, "Low");
      deselectButton(urgent, "Urgent");
      deselectButton(medium, "Medium");
      break;
  }

  newPrio = priority;
}


/**
 * function to render the information for selected task
 * 
 * @param {number} id - number to show the right information for the selceted task
 */

function renderFullscreenEdit(id) {
  if (id != undefined) {
    let task = allTasks[id];
    document.getElementById('Edittitle').value = task['title'];
    document.getElementById('Editdescription').value = task['description'];
    document.getElementById('Editdate').value = task['date'];
    let prio = task['priority'];
  }
}


/**
 * function to display editTaks template
 * 
 * @param {number} id -number to show the right information for the selected task
 */

async function displayEditTask(id) {
  let task = allTasks[id];
  let title = task['title'];
  let description = task['description'];
  let date = task['date'];
  let prio = task['priority'];
  let state = task['state'];

  document.getElementById('TaskOverview').classList.add('d-none');
  document.getElementById('editTaskPopUp-container').classList.remove('hideAddTask');
  document.getElementById('popupAddTaskBoard').classList.remove('d-none')
  choosePriorityEdit(prio);
  renderFullscreenEdit(id)

  document.getElementById('statusSelector').value = state;
  document.getElementById('Edittitle').value = title;
  document.getElementById('Editdescription').value = description;
  document.getElementById('Editdate').value = date;
};


/**
 * function for save the changes in the open task
 * 
 */

async function editTask() {
  let id = idCounter;
  let tempTask = allTasks[id];
  let newTitle = document.getElementById('Edittitle').value;
  let newDescription = document.getElementById('Editdescription').value;
  let newDate = document.getElementById('Editdate').value;
  let state = document.getElementById('statusSelector').value;
  tempTask['title'] = newTitle;
  tempTask['description'] = newDescription;
  tempTask['date'] = newDate;
  tempTask['priority'] = newPrio;
  tempTask['state'] = state;
  allTasks[id] = tempTask;

  await backend.setItem('allTasks', JSON.stringify(allTasks));
  hideEditTask()
  renderFullscreenView(id);
  init();
}


function routeToPage(destination) {
  window.location.href = destination;
}


/**
 * function for Datepicker to get the Date from today
 * 
 * @returns {string} - Today's date in yyyy-mm-dd format
 */
function getTodayDate() {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}


/**
 * Add the minimum date to an HTML date input field based on today's date
 *
 * @returns {void}
 */
function updateMin() {
  const datepicker = document.getElementById('date');
  datepicker.setAttribute('min', getTodayDate());
}


/**
 * Loads the requested data from server
 */
async function addTaskToBoard() {
  if (isPrioritySelected) {
    document.getElementById('priorityAlertPage').classList.add('d-none');
    addDate();
    setTimeout(() => {
      console.log(selectedCategory)
    }, 3000)
    
    let task = {
      'title': selectedTitle,
      'description': selectedDescription,
      'category': selectedCategory,
      'color': selectedColor,
      'date': selectedDate,
      'contactNames': selectedContactNames,
      'priority': getActivePriority(),
      'subtasks': selectedSubtasks,
      'id': idCounter,
      'state': state,
      'subtasksChecked': subtasksChecked,
    };
    showInfo();
    await saveAllTasks(task);
    await backend.setItem('categories', JSON.stringify(categories));
    if (task.priority === 'urgent') {
      prioCount++;
    }
    clearValues();
    idCounter++;
    loadAllTasks();
    isPrioritySelected = false;
  } else {
    document.getElementById('priorityAlertPage').classList.remove('d-none');
  }
}


