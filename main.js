const toDoListContainer = document.querySelector('.todo-list');
const userTextInput = document.querySelector('#user-input');
const addButton = document.querySelector('#add-button');

// load all task items on screen
function loadTaskList(array) {
    array.forEach((item) => {
        createNewTaskItem(toDoListContainer, item.id, item.text, item.completed, item.deleted);
    })
}

// create a new task item and check it's state
const createNewTaskItem = (container, id, text, completed, deleted) => {
    if (deleted) return;
    const taskCompleted = completed ? 'todo-item-completed' : 'todo-item';

    const item =
        `<li class='${taskCompleted}'>
        <div class="item-img"><img src="./images/to-do-icon.png"></div>
        <div class="item-text">${text}</div>
        <div class="item-buttons">
            <button id="${id}" class="complete-button"><i class="fa fa-check" aria-hidden="true"></i></button>
            <button id="${id}" class="delete-button"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
        </div>
    </li>
  `;
    container.insertAdjacentHTML('beforeend', item);
}

// Check if task is completed or not, change it's state and style
const completeTask = (button) => {
    const taskItem = button.closest('li');
    let taskObject = taskList[button.id];

    if (taskObject) {
        if (taskItem.className === 'todo-item') {
            taskItem.className = 'todo-item-completed';
            taskObject.completed = true;
        }
        else {
            taskItem.className = 'todo-item';
            taskObject.completed = false;
        }
    }
}

// Check if task was deleted or not, change it's state and style
const deleteTask = (button) => {
    const taskItem = button.closest('li');
    let taskObject = taskList[button.id];

    taskItem.remove();
    if (taskObject) {
        taskObject.deleted = true;
    }
}

// add an event to entire list to check if 'complete' or 'delete' button was clicked and runs it's function
toDoListContainer.addEventListener('click', (event) => {
    const element = event.target;
    const button = element.closest('button');

    if (button) {
        button.className === 'complete-button'
            ? completeTask(button)
            : deleteTask(button);
    }
    localStorage.setItem('toDoList', JSON.stringify(taskList));
})

// add an event to the 'add new task button' to create a task and it's dependencies
addButton.addEventListener('click', (event) => {
    event.preventDefault();
    const taskText = userTextInput.value;

    if (taskText) {
        createNewTaskItem(toDoListContainer, id, taskText, false, false);
        const taskObject = createTaskObject(id, taskText, false, false);
        addTaskObjectToList(taskObject, taskList);

        userTextInput.value = '';
        id++;
        localStorage.setItem('toDoList', JSON.stringify(taskList));
    }
});

// add the task object to the list of task objects
const addTaskObjectToList = (taskObject, array) => {
    array.push(taskObject);
}

// create an object to represent the element properties
const createTaskObject = (taskId, taskText, taskCompleted, taskDeleted) => {
    return {
        id: taskId,
        text: taskText,
        completed: taskCompleted,
        deleted: taskDeleted
    }
}

// initializes the id property and get the list of task objects from local storage
let id = 0;
let data = localStorage.getItem('toDoList');

// check if already exists data in local storage
if (data) {
    // load the existent data
    taskList = JSON.parse(data);
    id = taskList.length;
    loadTaskList(taskList);
}
else {
    // initialize a new data
    taskList = [];
    id = 0;
}

