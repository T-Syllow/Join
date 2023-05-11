let colors = ['pink', 'turquoise', 'darkblue', 'orange', 'green', 'red', 'blue'];
let selectedCategory = [];
let selectedColor = [];
let categories = [];


/**
 * function to disable and enable the category-inputfield
 */
function disableInput() {
  if (document.getElementById('category').disabled = true) {
    document.getElementById('category').disabled = false;
  } else {
    document.getElementById('category').disabled = true;
  }
}


/**
 * function to add a existing category and its color to the array "selectedCategory"
 *
 * @param {number} i - number to get the correct ID
 */
function addCategory(i) {
  let categoryName = document.getElementById('category');
  categoryName.style.color = 'black';
  selectedCategory = categories[i];
  document.getElementById('category').value = document.getElementById('category' + i).innerHTML;
  document.getElementById('categoryColor').innerHTML = document.getElementById('imageCat' + i).innerHTML;
  document.getElementById('categoryImage').innerHTML = `<img src="assets/img/dropdown_arrow.png">`;
  openCloseCategories();
}

/**
 * updates the categories array, if the category does not already exist.
 */
function updateCategories() {
  if (!existsCategoryAlready()) {
    categories.push(selectedCategory);
    categories.sort((a, b) => {
      if (a < b) {
        return -1;
      }
    });
  }
}

/**
 * 
 * @returns true, if selectedCategory is already contained in categories array. If not contained, return false.
 */
function existsCategoryAlready() {
  for (i = 0; i < categories.length; i++) {
    if (categories[i] === selectedCategory) {
      return true;
    }
  }
  return false;
}

/**
 * renders the categoryOptions for the addTask Popup 
 */
function renderCategoryOptions() {
  let categoriesContainer = document.getElementById('openedCategories');
  categoriesContainer.innerHTML = '';
  categoriesContainer.innerHTML += '<div class="oneCategory" onclick="addNewCategory()">New category</div>';
  for (let i = 0; i < categories.length; i++) {
    categoriesContainer.innerHTML += renderCategoryOption(i);
  }
}

/**
 * 
 * @param {Integer} i 
 * @returns html of a category option
 */
function renderCategoryOption(i) {
  return `
    <div class="oneCategory" onclick="addCategory(${i})">
        <div class="center">
            <div id="imageCat${i}" class="imageCat"><img src="assets/img/circle_${categories[i][1]}.png">
            </div>
            <div id="category${i}">${categories[i][0]}</div>
        </div>
    </div>
  `;
}

/**
 * function to make the container editable that you can write in your own category and select a color
 */
function addNewCategory() {
  let categoryName = document.getElementById('category');
  openCloseCategories();
  categoryName.value = '';
  categoryName.style.color = 'black';
  selectedCategory = '';
  selectedColor = '';
  document.getElementById('categoryImage').innerHTML = `
    <div onclick="notOpenCloseCategories(event)" class="crossAndCheck">
      <img src="assets/img/cancel_icon.png" onclick="cancelNewCategory()">
      <img src="assets/img/check_icon.png" onclick="acceptNewCategory()">
    </div>`;
  document.getElementById('categoryColors').classList.remove('d-none');
  document.getElementById('selectField').removeAttribute('onclick');
  document.getElementById('categoryColor').innerHTML = '';
  categoryName.focus();
}


/**
 * function to add the selected color to the new category
 * 
 * @param {number} i - number to get the correct color
 */
function changeColor(i) {
  document.getElementById('categoryColor').innerHTML = document.getElementById('changeColor' + i).innerHTML;
  document.getElementById('category').focus();
  selectedColor = '';
  selectedColor = colors[i];
}


/**
 * function to delete the new category and reset the category-field
 */
function cancelNewCategory() {
  let categoryName = document.getElementById('category');
  categoryName.value = '';
  categoryName.placholder = 'Select task category';
  categoryName.style.color = '#dcdcdc';
  document.getElementById('categoryImage').innerHTML = `<img src="assets/img/dropdown_arrow.png">`;
  document.getElementById('categoryColors').classList.add('d-none');
  document.getElementById('selectField').setAttribute('onclick', 'openCloseCategories()');
  document.getElementById('categoryColor').innerHTML = '';
}


/**
 * function to add the new category and its color to the array "selectedCategory"
 */
function acceptNewCategory() {
  if (selectedColor && !(document.getElementById('category').value == '')) {
    let categoryName = document.getElementById('category');
    document.getElementById('categoryImage').innerHTML = `<img src="assets/img/dropdown_arrow.png">`;
    document.getElementById('selectField').setAttribute('onclick', 'openCloseCategories()');
    document.getElementById('categoryColors').classList.add('d-none');
    selectedCategory = '';
    selectedCategory = [categoryName.value, selectedColor];
    updateCategories();
  }
}


/**
 * function to open or close the category-field by clicking on it
 */
function openCloseCategories() {
  if (document.getElementById('selectField').style.height == '192px') {
    if ($(window).width() > 720) {
      document.getElementById('selectField').style.height = '50px';
    } else {
      document.getElementById('selectField').style.height = '43px';
    }
    document.getElementById('openedCategories').classList.add('d-none');
  } else {
    document.getElementById('selectField').setAttribute('style', 'height: 192px !important;');
    setTimeout(function () {
      document.getElementById('openedCategories').classList.remove('d-none');
    }, 150)
  }
  disableInput();
}


/**
 * function to prevent to open or close the category-field
 */
function notOpenCloseCategories(event) {
  event.stopPropagation();
}
