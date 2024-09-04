import {v4 as uuidv4} from "./uuid.js";
const submitButton = document.querySelector(".submit");
const inputForName = document.querySelector('[name="name"]');
const inputInfo = document.querySelector(".info");
const startSections = document.getElementsByClassName("start");
const footerButtons = document.querySelector(".footer-buttons");
const taskForm = document.querySelector(".task-form");
const taskList = document.querySelector(".task-list");
const mainContent = document.querySelector("main");
const inputForTaskName = document.querySelector('[name="task-name"]');
const categorySelect = document.querySelector('[name="task-category"]');
const statusSelect = document.querySelector('[name="task-status"]');
const addingTaskButton = document.querySelector(".task-submit");
const taskInfo = document.querySelector(".task-info");
const deleteButton = document.querySelector(".delete");
const resetButton = document.querySelector(".reset");
if (!submitButton || !inputForName || !inputInfo || !footerButtons || !taskForm || !taskList || !mainContent || !inputForTaskName || !categorySelect || !statusSelect || !addingTaskButton || !taskInfo || !deleteButton || !resetButton)
  assertUnreachable();
let tasks = [];
const taskStatus = ["zaplanowane", "w trakcie", "zakończone"];
const categories = {
  dom: "fa-house",
  praca: "fa-briefcase",
  hobby: "fa-face-smile",
  sport: "fa-volleyball",
  zakupy: "fa-cart-shopping",
  zdrowie: "fa-notes-medical",
  spotkanie: "fa-people-group",
  podróż: "fa-location-dot",
  rodzina: "fa-people-roof",
  relaks: "fa-couch"
};
window.addEventListener("load", () => {
  if (Cookies.get("name") != null) {
    for (let i = 0; i < startSections.length; i++)
      startSections[i].classList.toggle("display-none");
    const jsonArrayTasks = Cookies.get("list");
    if (jsonArrayTasks)
      tasks = JSON.parse(jsonArrayTasks);
    else
      tasks = [];
    renderListPage();
  } else {
    for (let i = 0; i < startSections.length; i++)
      startSections[i].classList.toggle("display-block");
    inputForName.focus();
  }
});
let error = false;
inputForName.addEventListener("input", () => {
  error = false;
  if (inputForName.value.length < 3)
    inputInfo.innerText = "Imię musi mieć przynajmniej 3 litery";
  else if (inputForName.value != "") {
    inputInfo.innerText = "Kliknij enter, aby zatwierdzić";
    error = true;
  } else
    inputInfo.innerText = "Pole nie może być puste";
});
submitButton.addEventListener("click", (e) => submit(e));
inputForName.addEventListener("keydown", (e) => e.key == "Enter" && submit(e));
const submit = (e) => {
  e.preventDefault();
  if (error) {
    for (let i = 0; i < startSections.length; i++) {
      startSections[i].classList.remove("display-block");
      startSections[i].classList.add("display-none");
    }
    Cookies.set("name", inputForName.value, {expires: 365, path: ""});
    renderListPage();
  }
  ;
};
const renderListPage = () => {
  footerButtons.classList.add("display-block");
  const name = Cookies.get("name");
  name ? renderHeader(name) : assertUnreachable();
  renderList();
  renderTaskForm();
};
const renderHeader = (name) => {
  const header = document.createElement("h2");
  header.innerHTML = `Oto twoja <span class='primary-color'> lista to-do</span>, ${name}`;
  mainContent.prepend(header);
};
const renderTaskForm = () => {
  taskForm.classList.add("display-block");
  taskList.classList.add("display-block");
  for (const category in categories) {
    const optionElement = document.createElement("option");
    optionElement.value = category;
    optionElement.innerText = category;
    categorySelect.appendChild(optionElement);
  }
  taskStatus.forEach((status) => {
    const optionElement = document.createElement("option");
    optionElement.value = status;
    optionElement.innerText = status;
    statusSelect.append(optionElement);
  });
};
const renderList = () => {
  if (tasks.length) {
    const ulElement = document.createElement("ul");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const liElement = document.createElement("li");
      const inputElement = document.createElement("input");
      const labelElement = document.createElement("label");
      labelElement.innerText = task.name;
      inputElement.type = "checkbox";
      let indexOfStatus = taskStatus.indexOf(task.status) - 1;
      indexOfStatus == -1 && (indexOfStatus = 2);
      changeStatus(task, taskStatus[indexOfStatus], labelElement, inputElement);
      inputElement.addEventListener("change", () => {
        const status = task.status;
        changeStatus(task, status, labelElement, inputElement);
      });
      const containerForIcons = document.createElement("div");
      containerForIcons.classList.add("icons");
      const categoryIcon = document.createElement("i");
      categoryIcon.classList.add("fa-solid");
      categoryIcon.classList.add(task.icon);
      containerForIcons.append(categoryIcon);
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid");
      deleteIcon.classList.add("fa-xmark");
      containerForIcons.append(deleteIcon);
      deleteIcon.addEventListener("click", () => deleteTask(task));
      liElement.prepend(containerForIcons);
      labelElement.prepend(inputElement);
      liElement.prepend(labelElement);
      ulElement.append(liElement);
    });
    taskList.append(ulElement);
  } else {
    taskList.innerText = `Tutaj będą pojawiać się twoje zadania 
        (Klikając na nazwę zadania, możesz zmienić jego status)`;
  }
};
addingTaskButton.addEventListener("click", (e) => {
  e.preventDefault();
  let error2 = false;
  let errorMessage = "Podaj nazwę oraz wybierz kategorię i status";
  let status;
  let category;
  let icon;
  const notChosen = "not-chosen";
  const name = inputForTaskName.value;
  if (statusSelect.value === notChosen) {
    errorMessage = "Wybierz status zadania!";
    error2 = true;
  } else
    status = statusSelect.value;
  if (categorySelect.value === notChosen) {
    errorMessage = "Wybierz kategorię!";
    error2 = true;
  } else
    category = categorySelect.value;
  if (name === "") {
    errorMessage = "Podaj nazwę zadania!";
    error2 = true;
  }
  if (!error2 && status && category) {
    icon = category ? categories[category] : assertUnreachable();
    const newTask = {
      id: uuidv4(),
      name,
      category,
      icon,
      status
    };
    tasks.push(newTask);
    updateCookie(tasks);
    inputForTaskName.value = "";
    statusSelect.value = notChosen;
    categorySelect.value = notChosen;
    taskInfo.innerText = "";
    renderList();
  } else
    taskInfo.innerText = errorMessage;
});
const changeStatus = (currentTask, status, label, input) => {
  label.className = "";
  input.checked = true;
  if (status == "zaplanowane") {
    status = "w trakcie";
    label.classList.toggle("during");
  } else if (status == "w trakcie") {
    status = "zakończone";
    label.classList.toggle("finished");
  } else {
    status = "zaplanowane";
    input.checked = false;
  }
  currentTask.status = status;
  updateCookie(tasks);
};
const deleteTask = (taskToDelete) => {
  tasks = tasks.filter((task) => task.id !== taskToDelete.id);
  updateCookie(tasks);
  renderList();
};
deleteButton.addEventListener("click", () => {
  tasks = [];
  updateCookie(tasks);
  renderList();
});
resetButton.addEventListener("click", () => deleteCookies());
const updateCookie = (tasks2) => {
  const tasksArray = JSON.stringify(tasks2);
  Cookies.set("list", tasksArray, {expires: 365, path: ""});
};
const deleteCookies = () => {
  Cookies.remove("list", {path: ""});
  Cookies.remove("name", {path: ""});
  location.reload();
};
function assertUnreachable() {
  throw new Error("Wystąpił błąd");
}
