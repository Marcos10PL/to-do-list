//-------------------variables------------------------//
const submitButton = document.querySelector('.submit');
const inputName = document.querySelector('#name');
const inputInfo = document.querySelector('.info');
const startSections = document.getElementsByClassName('start');
const footerButtons = document.querySelector('.footer');
const taskForm = document.querySelector('.task-form');
const taskList = document.querySelector('.list');
const mainContent = document.querySelector('main');
const inputNameTask = document.querySelector('#add-task');
const categoriesSelect = document.querySelector('#categories');
const statusSelect = document.querySelector('#task-status');
const addTaskButton = document.querySelector('.submit-task');
const infoAddTask = document.querySelector('.error');
const deleteAllButton = document.querySelector('.deleteAll');
const resetButton = document.querySelector('.reset');
const helpButton = document.querySelector('.help');
const helpSection = document.querySelector('.help-section');
const HelpSectionCloseButton = document.querySelector('.close');
class Task {
    constructor(name, category, categoryIcon, status) {
        this.name = name;
        this.category = category;
        this.categoryIcon = categoryIcon;
        this.status = status;
    }
}
//---------------------arrays---------------------//
const taskStatus = ['zaplanowane', 'w trakcie', 'zakończone'];
let tasks = [];
const categories = [
    ['dom', 'fa-house'],
    ['praca', 'fa-briefcase'],
    ['hobby', 'fa-face-smile'],
    ['sport', 'fa-volleyball'],
    ['zakupy', 'fa-cart-shopping'],
    ['zdrowie', 'fa-notes-medical'],
    ['spotkanie', 'fa-people-group'],
    ['podróż', 'fa-location-dot'],
    ['rodzina', 'fa-people-roof'],
    ['relaks', 'fa-couch']
];
//----------------------START----------------------//
// loading check cookies
window.addEventListener('load', () => {
    if (Cookies.get('name') != null) {
        for (let i = 0; i < startSections.length; i++)
            startSections[i].classList.add('display-none');
        const jsonArrayTasks = Cookies.get('list');
        if (jsonArrayTasks)
            tasks = JSON.parse(jsonArrayTasks);
        else
            tasks = [];
        renderPage();
    }
    else {
        for (let i = 0; i < startSections.length; i++)
            startSections[i].classList.add('display-block');
        inputName.focus();
    }
});
// validate name
let allRight = false;
inputName.addEventListener('input', () => {
    allRight = false;
    if (inputName.value.length < 3 && inputName.value.length > 0)
        inputInfo.innerText = 'Imię musi mieć przynajmniej 3 litery';
    else if (inputName.value != '') {
        inputInfo.innerText = 'Kliknij enter, aby zatwierdzić';
        allRight = true;
    }
    else
        inputInfo.innerText = 'Pole nie może być puste';
});
submitButton.addEventListener('click', (e) => submit(e));
inputName.addEventListener('keypress', (e) => e.key == "enter" && submit(e));
// submit name
const submit = (e) => {
    e.preventDefault();
    if (allRight) {
        for (let i = 0; i < startSections.length; i++) {
            startSections[i].classList.remove('display-block');
            startSections[i].classList.add('display-none');
        }
        Cookies.set('name', inputName.value, { expires: 365, path: '' });
        renderPage();
    }
    ;
};
//------------------- RENDERING FUNCTIONS --------------------//
const renderPage = () => {
    footerButtons.classList.add('display-block');
    renderHeader(Cookies.get('name'));
    renderTaskForm();
    renderList();
};
// header
const renderHeader = (name) => {
    const header = document.createElement('h2');
    header.innerHTML = `Oto twoja <span class='primary-color'> lista to-do</span>, ${name}`;
    mainContent.prepend(header);
};
// task form
const renderTaskForm = () => {
    taskForm.classList.add('display-block');
    taskList.classList.add('display-block');
    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; i < categories.length; i++) {
            const optionElement = document.createElement('option');
            optionElement.value = categories[i][j];
            optionElement.innerText = categories[i][j];
            categoriesSelect.append(optionElement);
        }
    }
    taskStatus.forEach(status => {
        const optionElement = document.createElement('option');
        optionElement.value = status;
        optionElement.innerText = status;
        statusSelect.append(optionElement);
    });
};
// showing list to-do
const renderList = () => {
    if (tasks.length === 0)
        taskList.innerHTML = 'Tutaj będą pojawiać się twoje zadania';
    else {
        const ulElement = document.createElement('ul');
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const liElement = document.createElement('li');
            const inputElement = document.createElement('input');
            const labelElement = document.createElement('label');
            labelElement.innerText = task.name;
            inputElement.type = 'checkbox';
            let indexOfStatus = taskStatus.indexOf(task.status) - 1;
            if (indexOfStatus == -1)
                indexOfStatus = 2;
            changeStatus(task, taskStatus[indexOfStatus], labelElement, inputElement);
            inputElement.addEventListener('change', () => {
                const status = task.status;
                changeStatus(task, status, labelElement, inputElement);
            });
            const divForIcons = document.createElement('div');
            divForIcons.classList.add('icons');
            const categoryicon = `<i class="fa-solid ${task.categoryIcon}"></i>`;
            divForIcons.innerHTML = categoryicon;
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid');
            deleteIcon.classList.add('fa-xmark');
            deleteIcon.addEventListener('click', () => deleteTask(task));
            divForIcons.append(deleteIcon);
            liElement.prepend(divForIcons);
            labelElement.prepend(inputElement);
            liElement.prepend(labelElement);
            ulElement.append(liElement);
        });
        taskList.append(ulElement);
    }
};
//----------------- CHANGING AND ADDING A TASKS -----------------------//
// adding a task
addTaskButton.addEventListener('click', (e) => {
    e.preventDefault();
    let errorMessage = '';
    const taskName = inputNameTask.value;
    if (statusSelect.value == 'not-chosen')
        errorMessage = 'Wybierz status zadania!';
    else
        var taskStatus = statusSelect.value;
    if (categoriesSelect.value == 'not-chosen')
        errorMessage = 'Wybierz kategorię!';
    else
        var taskCategory = categoriesSelect.value;
    if (taskName == '')
        errorMessage = 'Podaj nazwę zadania!';
    infoAddTask.innerText = errorMessage;
    if (errorMessage == '') {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i][0] == taskCategory)
                var categoryIcon = categories[i][1];
        }
        const newTask = new Task(taskName, taskCategory, categoryIcon, taskStatus);
        tasks.push(newTask);
        updateCookie(tasks);
        inputNameTask.value = '';
        renderList();
    }
});
// changing status of task
const changeStatus = (currentTask, status, label, input) => {
    label.className = '';
    input.checked = true;
    if (status == 'zaplanowane') {
        status = 'w trakcie';
        label.classList.toggle('during');
    }
    else if (status == 'w trakcie') {
        status = 'zakończone';
        label.classList.toggle('finished');
    }
    else {
        status = 'zaplanowane';
        input.checked = false;
    }
    currentTask.status = status;
    updateCookie(tasks);
};
// deleting task
const deleteTask = (task) => {
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    updateCookie(tasks);
    renderList();
};
// ----------------------- FOOTER BUTTONS -----------------------//
// delete all tasks
deleteAllButton.addEventListener('click', () => {
    tasks = [];
    updateCookie(tasks);
    renderList();
});
// reset name
resetButton.addEventListener('click', () => {
    Cookies.remove('list', {path: ''});
    Cookies.remove('name', {path: ''});
    location.reload();
});
// help section => open
helpButton.addEventListener('click', () => {
    helpSection.classList.remove('display-none');
    helpSection.classList.add('display-block');
});
// help section => close
HelpSectionCloseButton.addEventListener('click', () => {
    helpSection.classList.remove('display-block');
    helpSection.classList.add('display-none');
});
//--------------------------COOKIES------------------------------//
const updateCookie = (tasks) => {
    const tasksArray = JSON.stringify(tasks);
    if (Cookies.get('list') != null)
        Cookies.remove('list');
    Cookies.set('list', tasksArray, { expires: 365, path: '' });
};
