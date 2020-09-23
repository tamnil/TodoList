// initial states declaration
let id = 0;
let data = localStorage.getItem("toDoList");

//basic functions

const querySelector = (x) => document.querySelector(x);
const isTodoItem = (taskItem) => taskItem.className === "todoitem";
const not = (x) => !x;
const taskItem = (button) => button.closest("li");
const taskObject = (taskList) => (button) => taskList[button.id];
const button = (el) => el.closest("button");
const element = (ev) => ev.target;

const toDoListContainer = querySelector(".todo-list");
const userTextInput = querySelector("#user-input");
const addButton = querySelector("#add-button");

// load all task items on screen
const loadTaskList = (array) =>
  array.forEach((item) =>
    createNewTaskItem(
      toDoListContainer,
      item.id,
      item.text,
      item.completed,
      item.deleted
    )
  );

const tpl = {
  item: (taskCompleted, text, id) =>
    `<li class='${taskCompleted}'>
        <div class="item-img"><img src="./images/to-do-icon.png"></div>
        <div class="item-text">${text}</div>
        <div class="item-buttons">
            <button id="${id}" class="complete-button"><i class="fa fa-check" aria-hidden="true"></i></button>
            <button id="${id}" class="delete-button"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
        </div>
    </li>
  `,
};

const taskCompleted = (isCompleted) =>
  isCompleted ? "todo-item-completed" : "todo-item";

const renderItem = (completed, text, id) =>
  tpl.item(taskCompleted(completed), text, id);

// create a new task item and check it's state
const createNewTaskItem = (container, id, text, completed, deleted) =>
  deleted ||
  container.insertAdjacentHTML("beforeend", renderItem(completed, text, id));

// Check if task is completed or not, change it's state and style
const updateItem = (taskItem, taskObject) => {
  taskItem.className = "todo-item-completed";
  taskObject.completed = true;
};

const updateItemInv = (taskItem, taskObject) => {
  taskItem.className = "todo-item";
  taskObject.completed = false;
};

const completeTask = (button) =>
  isTodoItem && taskObject(taskList)(button)
    ? updateItem(taskItem(button), taskObject(taskList)(button))
    : updateItemInv(taskItem, taskObject(taskList)(button));

const deleteTaskObject = (object) => (list) => (button) => {
  object(list)(button).deleted = true;
};

// Check if task was deleted or not, change it's state and style
const deleteTask = (taskList) => (btn) => {
  taskItem(btn).remove();
  deleteTaskObject(taskObject)(taskList)(btn);
};

const saveTaskLocalStorage = (taskList) =>
  localStorage.setItem("toDoList", JSON.stringify(taskList));
const updateTask = (event) =>
  button(element(event)).className === "complete-button"
    ? completeTask(button(element(event)))
    : deleteTask(taskList)(button(element(event)));

const addTask = (taskText, toDoListContainer, id) => {
  const taskObject = createTaskObject(id, taskText, false, false);
  createNewTaskItem(toDoListContainer, id, taskText, false, false);
  addTaskObjectToList(taskObject, taskList);

  userTextInput.value = ""; //globak
  id++; //global
  localStorage.setItem("toDoList", JSON.stringify(taskList));
};

const addTaskListener = (event) => {
  event.preventDefault();
  const taskText = userTextInput.value;   // global
  not(taskText) || addTask(taskText, toDoListContainer, id);
};


// add the task object to the list of task objects
const addTaskObjectToList = (taskObject, array) => array.push(taskObject);

// create an object to represent the element properties
const createTaskObject = (taskId, taskText, taskCompleted, taskDeleted) => ({
  id: taskId,
  text: taskText,
  completed: taskCompleted,
  deleted: taskDeleted,
});

// check if already exists data in local storage

const loadData = (taskList) => {
  id = taskList.length;
  loadTaskList(taskList);
};
const saveTask = (event) => {

  not(button(element(event))) || updateTask(event);
  saveTaskLocalStorage(taskList);

}


//  Listeners ******************************
// add an event to entire list to check if 'complete' or 'delete' button was clicked and runs it's function
toDoListContainer.addEventListener("click", saveTask);

// add an event to the 'add new task button' to create a task and it's dependencies
addButton.addEventListener("click", addTaskListener);


// main: **************************************

if (data) {
  taskList = JSON.parse(data); // caution, global
  // load the existent data
  loadData(taskList);
} else {
  // initialize a new data
  // initializeData();
  taskList = [];
  id = 0;
}
