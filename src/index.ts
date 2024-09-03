import { v4 as uuidv4 } from 'uuid';

//-------------------variables------------------------//

const submitButton = document.querySelector<HTMLButtonElement>('.submit');
const inputForName = document.querySelector<HTMLInputElement>('[name="name"]');
const inputInfo = document.querySelector<HTMLDivElement>('.info');
const startSections = document.getElementsByClassName('start');
const footerButtons = document.querySelector<HTMLDivElement>('.footer-buttons');

const taskForm = document.querySelector<HTMLFormElement>('.task-form');
const taskList = document.querySelector<HTMLDivElement>('.task-list');
const mainContent = document.querySelector<HTMLElement>('main');

const inputForTaskName = document.querySelector<HTMLInputElement>('[name="task-name"]');
const categorySelect = document.querySelector<HTMLSelectElement>('[name="task-category"]');
const statusSelect = document.querySelector<HTMLSelectElement>('[name="task-status"]');
const addingTaskButton = document.querySelector<HTMLButtonElement>('.task-submit');
const taskInfo = document.querySelector<HTMLButtonElement>('.task-info');

const deleteButton = document.querySelector<HTMLButtonElement>('.delete');
const resetButton = document.querySelector<HTMLButtonElement>('.reset');

if
(   !submitButton 
    || !inputForName
    || !inputInfo 
    || !footerButtons 
    || !taskForm 
    || !taskList 
    || !mainContent    
    || !inputForTaskName 
    || !categorySelect 
    || !statusSelect 
    || !addingTaskButton 
    || !taskInfo 
    || !deleteButton 
    || !resetButton
) 
assertUnreachable();

//---------------------types------------------------//

type IconsFA =
    | 'fa-house' 
    | 'fa-briefcase' 
    | 'fa-face-smile' 
    | 'fa-volleyball' 
    | 'fa-cart-shopping' 
    | 'fa-notes-medical' 
    | 'fa-people-group' 
    | 'fa-location-dot' 
    | 'fa-people-roof' 
    | 'fa-couch';

type Categories = 
    | 'dom' 
    | 'praca' 
    | 'hobby' 
    | 'sport' 
    | 'zakupy' 
    | 'zdrowie' 
    | 'spotkanie' 
    | 'podróż' 
    | 'rodzina' 
    | 'relaks'; 

type TaskStatus = 
    | 'zaplanowane' 
    | 'w trakcie' 
    | 'zakończone';

type Select = 'not-chosen';

type CategoriesToIcons = Record<Categories, IconsFA>;

interface Task
{
    id: string,
    name: string,
    category: Categories,
    icon: IconsFA,
    status: TaskStatus
}

declare namespace Cookies 
{
    function get(name: string): string | undefined;
    function set(name: 'name' | 'list', value: string, options: {expires: number, path: string}): void;
    function remove(name: string, options?: {path: string}): void;
}

//---------------------arrays---------------------//

let tasks: Task[] = [];

const taskStatus: TaskStatus[] = ['zaplanowane', 'w trakcie', 'zakończone'];

const categories: CategoriesToIcons = 
{
    dom: 'fa-house',
    praca: 'fa-briefcase',
    hobby: 'fa-face-smile',
    sport: 'fa-volleyball',
    zakupy: 'fa-cart-shopping',
    zdrowie: 'fa-notes-medical',
    spotkanie: 'fa-people-group',
    podróż: 'fa-location-dot',
    rodzina: 'fa-people-roof',
    relaks: 'fa-couch'
}

//----------------------START----------------------//

// load and check cookies
window.addEventListener('load', () =>
{
    if(Cookies.get('name') != null)
    {
        for (let i = 0; i < startSections.length; i++) 
            startSections[i].classList.toggle('display-none');

        const jsonArrayTasks = Cookies.get('list');

        if(jsonArrayTasks) 
            tasks = JSON.parse(jsonArrayTasks);
        else tasks = [];

        renderListPage();
    }
    else
    {
        for (let i = 0; i < startSections.length; i++) 
            startSections[i].classList.toggle('display-block');

        inputForName.focus();
    }
});

// name validation
let error = false;

inputForName.addEventListener('input', () => 
{
    error = false;

    if (inputForName.value.length < 3)
        inputInfo.innerText = 'Imię musi mieć przynajmniej 3 litery';
    else if(inputForName.value != '') 
    {
        inputInfo.innerText = 'Kliknij enter, aby zatwierdzić';
        error = true;
    }
    else 
        inputInfo.innerText = 'Pole nie może być puste';
});

submitButton.addEventListener('click', (e) => submit(e));
inputForName.addEventListener('keydown', (e) => e.key == "Enter" && submit(e));

// name submitting
const submit = (e: Event) =>
{    
    e.preventDefault();

    if(error)
    {
        for (let i = 0; i < startSections.length; i++) 
        {
            startSections[i].classList.remove('display-block');
            startSections[i].classList.add('display-none');
        }

        Cookies.set('name', inputForName.value, {expires: 365, path: ''});
        renderListPage();
    };
}

//------------------- RENDERING FUNCTIONS --------------------//
const renderListPage = () =>
{
    footerButtons.classList.add('display-block');

    const name = Cookies.get('name')
    name ? renderHeader(name) : assertUnreachable();

    renderList();
    renderTaskForm();
}

// header
const renderHeader = (name: string) =>
{
    const header = document.createElement('h2');
    header.innerHTML = `Oto twoja <span class='primary-color'> lista to-do</span>, ${name}`;
    mainContent.prepend(header);
}

// form for adding a task
const renderTaskForm = () =>
{
    taskForm.classList.add('display-block');
    taskList.classList.add('display-block');

    for (const category in categories) 
    {
        const optionElement = document.createElement('option');
        optionElement.value = category;
        optionElement.innerText = category;
        categorySelect.appendChild(optionElement);
    }

    taskStatus.forEach(status => 
    {
        const optionElement = document.createElement('option');
        optionElement.value = status;
        optionElement.innerText = status;
        statusSelect.append(optionElement);
    });
}

// to-do list
const renderList = () =>
{
    if(tasks.length)
    {
        const ulElement = document.createElement('ul');
        taskList.innerHTML = '';
    
        tasks.forEach(task => 
        {
            const liElement = document.createElement('li');
            const inputElement = document.createElement('input');
            const labelElement = document.createElement('label');
    
            labelElement.innerText = task.name;
            inputElement.type = 'checkbox';
    
            let indexOfStatus = taskStatus.indexOf(task.status) - 1;
            (indexOfStatus == -1) && (indexOfStatus = 2)
            changeStatus(task, taskStatus[indexOfStatus], labelElement, inputElement);
    
            inputElement.addEventListener('change', () => 
            {
                const status: TaskStatus = task.status;
                changeStatus(task, status, labelElement, inputElement);
            })
    
            const containerForIcons = document.createElement('div');
            containerForIcons.classList.add('icons');
    
            const categoryIcon = document.createElement('i');
            categoryIcon.classList.add('fa-solid');
            categoryIcon.classList.add(task.icon);
            containerForIcons.append(categoryIcon)
    
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-solid');
            deleteIcon.classList.add('fa-xmark');
            containerForIcons.append(deleteIcon);
            deleteIcon.addEventListener('click', () => deleteTask(task));

            liElement.prepend(containerForIcons);
            labelElement.prepend(inputElement);
            liElement.prepend(labelElement);
            ulElement.append(liElement);
        });
        taskList.append(ulElement);
    }
    else
    {
        taskList.innerText = `Tutaj będą pojawiać się twoje zadania 
        (Klikając na nazwę zadania, możesz zmienić jego status)`;
    }
}

//----------------- CHANGING AND ADDING TASKS -----------------------//

// adding a task
addingTaskButton.addEventListener('click', (e) => 
{
    e.preventDefault();

    let error = false;
    let errorMessage = 'Podaj nazwę oraz wybierz kategorię i status';

    let status: TaskStatus | undefined;
    let category: Categories | undefined;
    let icon: IconsFA | undefined;

    const notChosen: Select = 'not-chosen';
    const name = inputForTaskName.value;
    
    if (statusSelect.value === notChosen) 
    {
        errorMessage = 'Wybierz status zadania!';
        error = true;
    } 
    else 
        status = statusSelect.value as TaskStatus;
    
    if (categorySelect.value === notChosen) 
    {
        errorMessage = 'Wybierz kategorię!';
        error = true;
    } 
    else
        category = categorySelect.value as Categories;
    
    if (name === '') 
    {
        errorMessage = 'Podaj nazwę zadania!';
        error = true;
    }

    if(!error && status && category)
    {
        icon = category ? categories[category] : assertUnreachable();

        const newTask: Task = 
        {
            id: uuidv4(),
            name: name, 
            category: category, 
            icon: icon, 
            status: status
        }

        tasks.push(newTask);
        updateCookie(tasks);

        inputForTaskName.value = '';
        statusSelect.value = notChosen;
        categorySelect.value = notChosen;
        taskInfo.innerText = '';

        renderList();
    }
    else
        taskInfo.innerText = errorMessage;
        
});

// changing a task status
const changeStatus = (
    currentTask: Task, 
    status: TaskStatus, 
    label: HTMLLabelElement, 
    input: HTMLInputElement
) => 
{
    label.className = '';
    input.checked = true;

    if(status == 'zaplanowane')
    {
        status = 'w trakcie';
        label.classList.toggle('during');
    }
    else if(status == 'w trakcie')
    {
        status = 'zakończone';
        label.classList.toggle('finished');
    }
    else
    {
        status = 'zaplanowane';
        input.checked = false;
    }

    currentTask.status = status;
    updateCookie(tasks);
}

// deleting a task
const deleteTask = (taskToDelete: Task) =>
{
    tasks = tasks.filter(task => task.id !== taskToDelete.id);
    updateCookie(tasks);
    renderList();
}

// ----------------------- FOOTER BUTTONS -----------------------//

// deleting all tasks
deleteButton.addEventListener('click', () => 
{
    tasks = [];
    updateCookie(tasks);
    renderList();
});

// reset name
resetButton.addEventListener('click', () => deleteCookies());

//--------------------------COOKIES------------------------------//

const updateCookie = (tasks: Task[]) =>
{
    const tasksArray = JSON.stringify(tasks);
    Cookies.set('list', tasksArray, { expires: 365, path: '' });
}

const deleteCookies = () =>
{
    Cookies.remove('list', {path: ''});
    Cookies.remove('name', {path: ''});
    location.reload();
}

//--------------ERROR FUNCTION-------------//
function assertUnreachable(): never 
{
    throw new Error('Wystąpił błąd') 
}