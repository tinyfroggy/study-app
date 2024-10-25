// #region todo list logic

//! todo list container

let todoLists = [
  {
    title: 'todo list title',
    time: "2020/10/10 | 5pm:44m",
    isDon: false,
    id: 0
  }
];

//! end todo list container 

//? date logic 

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let day = date.getDate();
let hour = date.getHours();
let minute = date.getMinutes();

let today = ` ${year}/${month + 1}/${day} | ${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${minute < 10 ? '0' + minute : minute} ${hour >= 12 ? 'PM' : 'AM'}`;

//? end date logic 

// sound when task is completed
const completedTaskSound = new Audio('./voices/completeTask.wav');

const addTask = document.getElementById('add-task');
const taskTitle = document.querySelector('.prompt-task-title');
const submitTask = document.querySelector('.prompt-task-add');
const closeTask = document.querySelector('.prompt-task-close');
const editTaskBtn = document.getElementById('editBtn-task');
const submitEditTaskBtn = document.getElementById('editBtn-task');

const tasksContainer = document.querySelector('.task');

const promptTask = document.querySelector('.prompt-task');

// get tasks from local storage
function getTasksFromLocalStorage() {
  todoLists = JSON.parse(localStorage.getItem('todoLists')) || [];
}

// call get tasks from local storage
getTasksFromLocalStorage();

// store tasks in local storage
function storTaskForLocalStorage() {
  localStorage.setItem('todoLists', JSON.stringify(todoLists));
}

// show the tasks
function displayTasks() {
  tasksContainer.innerHTML = '';

  // for sorting the completed tasks first and then not completed
const sortedTasks = todoLists.sort((a, b) => a.isDon - b.isDon);

  for (const task of sortedTasks) {

    let taskBody =
      `
  <!-- task body -->
    <div class="task-body ${task.isDon ? 'done' : ''}">
      <div class="task-header-text">
        <h2 class="title-task">${task.title}</h2>
        <hr>
        <p><span class="date-task" id="date-task">${task.time}</span></p>
    </div>

        <div class="task-buttons-wrapper">
          <button onclick="deleteTask(${task.id})" class="delete-task circle" title="delete task"><i class="fa-solid fa-trash"></i></button>
          <button onclick="doneTask(${task.id})" class="done-task circle" title="${task.isDon ? 'undo' : 'done'} task"><i class="fa-solid fa-${task.isDon ? 'close' : 'check'}"></i></button>
          <button onclick="editTask(${task.id})" class="edit-task circle" title="edit task"><i class="fa-solid fa-pen-to-square"></i></button>
        </div>

    </div>
  <!-- end task body -->
  `;

    tasksContainer.innerHTML += taskBody;
  }
}

displayTasks();
storTaskForLocalStorage();

// add new task
addTask.addEventListener('click', () => {
  promptTask.classList.remove('hidden');
  taskTitle.focus();
  taskTitle.value = '';
});

// submit new task
submitTask.addEventListener('click', () => {
  addNewTask();
});

// submit and close new task
taskTitle.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addNewTask();
  }
});


// add new task logic
function addNewTask() {

  // you cant add empty task
  if (taskTitle.value === '') {
    alert('Please enter task title');
    return;
  }

  // add new task on todo lists container
  // unshift means add new task on top
  todoLists.unshift({
    title: taskTitle.value,
    time: today,
    isDon: false,
    id: Date.now()
  });

  displayTasks();
  storTaskForLocalStorage();

  // close prompt
  promptTask.classList.add('hidden');
};

// close prompt
closeTask.addEventListener('click', () => {
  promptTask.classList.add('hidden');
  submitTask.classList.remove('hidden');
  submitEditTaskBtn.classList.add('hidden');
});

// edit task logic
function editTask(id) {
  // find task form todo lists container
  const task = todoLists.find(task => task.id === id);

  // show prompt 
  promptTask.classList.remove('hidden');
  submitTask.classList.add('hidden');
  submitEditTaskBtn.classList.remove('hidden');
  taskTitle.focus();
  taskTitle.value = task.title;

  // submit and edit task
  editTaskBtn.onclick = () => {
    saveTaskEdit(task);
  };

  // close prompt after submit
  taskTitle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      saveTaskEdit(task);
    }
  });
}

// save task edit logic
function saveTaskEdit(task) {
  task.title = taskTitle.value;

  displayTasks();
  storTaskForLocalStorage();

  submitEditTaskBtn.classList.add('hidden');
  promptTask.classList.add('hidden');
  submitTask.classList.remove('hidden');
}

// if is done task logic
function doneTask(id) {
  // find the task
  const task = todoLists.find(task => task.id === id);

  // fi true play the sound
  if (task.isDon === false) {
    task.isDon = true;
    completedTaskSound.play();
  } else {
    task.isDon = false;
  }

  displayTasks();
  storTaskForLocalStorage();
}

// delete task logic
function deleteTask(id) {
  // fill all tasks except the deleted one
  todoLists = todoLists.filter(task => task.id !== id);

  displayTasks();
  storTaskForLocalStorage();
}

// #endregion end todo list logic

// #region timer logic

const start = document.getElementById('start');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const timer = document.getElementById('timer');
const plusMinute = document.getElementById('plus-minute');
const minusMinute = document.getElementById('minus-minute');
let sound = new Audio('./voices/levlUp.wav');

let timeLeft = 1500;
let interval;
let isRunning = false;

const updateTimer = () => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timer.innerHTML = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const startTimer = () => {
  interval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft === 0) {
      clearInterval(interval);
      sound.play();
      timeLeft = 1500;
      updateTimer();
    }

  }, 1000);
}

const stopTimer = () => {
  clearInterval(interval);

}

const resetTimer = () => {
  clearInterval(interval);
  timeLeft = 1500;
  updateTimer();

}

start.addEventListener('click', function() {
  if (!isRunning) {
    isRunning = true;
    this.disabled = true;  
    stop.disabled = false;
    reset.disabled = false;
    startTimer();
  }
});

stop.addEventListener('click', function() { 
  if (isRunning) {
    isRunning = false;
    stopTimer();
    start.disabled = false;  
    this.disabled = true;  
  }
});

reset.addEventListener('click', function() {
  this.disabled = true;
  resetTimer();
  isRunning = false;  
  stop.disabled = true;
  start.disabled = false;
});


plusMinute.addEventListener('click', () => {
  timeLeft += 300;
  updateTimer();
});

minusMinute.addEventListener('click', () => {
  if (timeLeft <= 300) {
    alert('Cannot be less than 5 minutes');
    return;
  }
  timeLeft -= 300;
  updateTimer();
});

// #endregion  end timer logic


// #region flash card logic

// flash card container
let flashCards = [
  {
    title: 'flash card title',
    answer: 'flash card answer',
    showAnswer: false,
    id: 2
  }
];

// get flash cards from local storage
function getFromLocalStorage() {
  const flashCardsFromStorage = localStorage.getItem('flashCards');
  if (flashCardsFromStorage) {
    flashCards = JSON.parse(flashCardsFromStorage);
    if (flashCards.length > 0) {
      indexFlashCard = Math.max(...flashCards.map(card => card.id)) + 1;
    }
  } else {
    flashCards = [];
  }
}

const flashCardContainer = document.querySelector('.flash-cards-container');

const addFlashCard = document.querySelector('.flash-card-add');
const closeFlashCard = document.querySelector('.prompt-flash-card-close');
const submitFlashCard = document.querySelector('.prompt-flash-card-add');
const editFlashCardBtn = document.querySelector('.prompt-flash-card-edit');

const flashCardTitle = document.querySelector('.prompt-flash-card-title');
const flashCardAnswer = document.querySelector('.prompt-flash-card-answer');

let indexFlashCard = 1;

getFromLocalStorage();
displayFlashCards();

// show flash cards logic
function displayFlashCards() {
  flashCardContainer.innerHTML = '';

  for (const card of flashCards) {
    let flashCard = `
    <!-- flash card body -->
        <div class="flash-card-body">
          <div class="flash-card-title">
            <h1>${card.title}</h1>
            <div class="buttons-flash-card">
            <button onclick="funShowAnswer(${card.id})" class="circle" title="${card.showAnswer ? 'hide answer' : 'show answer'}"><i class="fa-solid fa-${card.showAnswer ? 'eye-slash' : 'eye'}"></i></button>
            <button onclick="editFlashCard(${card.id})" class="circle" id="flash-card-edit" title="edit flash card"><i class="fa-solid fa-pen-to-square"></i></button>
            <button onclick="deleteFlashCard(${card.id})" class="circle" title="delete flash card"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          <hr class="flash-card-hr">
          <p class="flash-card-answer ${card.showAnswer ? 'show-answer' : 'hidden'}">${card.answer}</p>
        </div>
    <!-- end flash card body -->
    `;

    flashCardContainer.innerHTML += flashCard;
  }
}

// show answer logic
function funShowAnswer(id) {
  const card = flashCards.find(card => card.id === id);
  card.showAnswer = !card.showAnswer;

  displayFlashCards();
  storForLocalStorage();
}

// edit flash card logic
function editFlashCard(id) {
  const index = flashCards.findIndex(card => card.id === id);
  flashCardTitle.value = flashCards[index].title;
  flashCardAnswer.value = flashCards[index].answer;

  document.querySelector('.prompt-flash-card-add').classList.add('hidden');
  document.querySelector('.prompt-flash-card-edit').classList.remove('hidden');
  document.querySelector('.prompt-flash-card').classList.remove('hidden');
  flashCardTitle.focus();
  editFlashCardBtn.onclick = () => {
    saveFlashCardEdit(index);
  };
}

function saveFlashCardEdit(index) {
  if (flashCardTitle.value === '' || flashCardAnswer.value === '') {
    alert('Please enter both title and answer');
    return;
  }

  flashCards[index].title = flashCardTitle.value;
  flashCards[index].answer = flashCardAnswer.value;
  flashCards[index].showAnswer = false;

  displayFlashCards();
  storForLocalStorage();

  document.querySelector('.prompt-flash-card-edit').classList.add('hidden');
  document.querySelector('.prompt-flash-card').classList.add('hidden');
}




function deleteFlashCard(id) {
  flashCards = flashCards.filter(card => card.id !== id);
  displayFlashCards();
  storForLocalStorage();
}

addFlashCard.addEventListener('click', () => {
  document.querySelector('.prompt-flash-card').classList.remove('hidden');
  document.querySelector('.prompt-flash-card-add').classList.remove('hidden');
  document.querySelector('.prompt-flash-card-edit').classList.add('hidden');
  flashCardTitle.value = '';
  flashCardAnswer.value = '';
  flashCardTitle.focus();
});

closeFlashCard.addEventListener('click', () => {
  document.querySelector('.prompt-flash-card').classList.add('hidden');
});

submitFlashCard.addEventListener('click', () => {
  addNewFlashCard();
});

flashCardTitle.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addNewFlashCard();
  }

  if (event.key === 'ArrowDown') {
    flashCardAnswer.focus();
  }
});

flashCardAnswer.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addNewFlashCard();
  }

  if (event.key === 'ArrowUp') {
    flashCardTitle.focus();
  }
});

// fix the enter key

function addNewFlashCard() {
  if (flashCardTitle.value === '' || flashCardAnswer.value === '') {
    alert('Please enter both title and answer');
    return;
  }

  flashCards.push({
    title: flashCardTitle.value,
    answer: flashCardAnswer.value,
    showAnswer: false,
    id: indexFlashCard
  });

  indexFlashCard++;
  storForLocalStorage();

  flashCardTitle.value = '';
  flashCardAnswer.value = '';

  document.querySelector('.prompt-flash-card').classList.add('hidden');

  displayFlashCards();
}

function storForLocalStorage() {
  localStorage.setItem('flashCards', JSON.stringify(flashCards));
}

// #endregion end flash card logic

// #region  nots logic

let nots = [
  {
    text: "1",
    id: 1
  }, {
    text: "2",
    id: 2
  }
];

function getNotsFromLocalStorage() {
  nots = JSON.parse(localStorage.getItem('nots')) || [];
};

getNotsFromLocalStorage();

function storNotsToLocalStorage() {
  localStorage.setItem('nots', JSON.stringify(nots));
}

function generateUniqueId() {
  const timestamp = Date.now();
  return timestamp
}


const notsContainer = document.querySelector('.container-nots');
const createNoteButton = document.querySelector('.create-note');

const promptNote = document.querySelector('.prompt-note');
const textPrompt = document.querySelector('.text-prompt');
const cancelPromptBtn = document.querySelector('.cancel-prompt');
const submitPromptBtn = document.querySelector('.submit-prompt');
const submitEditBtn = document.getElementById('edit-submit');

function renderNots() {
  notsContainer.innerHTML = '';

  for (const note of nots) {

    const noteElement =
      `
    <!-- note -->
      <div class="note">
        <!-- note buttons -->
        <div class="note-buttons">
          <button onclick="deleteNote(${note.id})" class="delete-note" title="delete note"><i class="fa-solid fa-trash-can"></i></button>
          <button onclick="editNote(${note.id})" class="edit-note" title="edit note"><i class="fa-solid fa-pen"></i></button>
        </div>
        <!-- end note buttons -->
        <textarea class="note-board" readonly>${note.text}</textarea>
      </div>
    <!-- end note -->
    `

    notsContainer.innerHTML += noteElement;

  }
}

renderNots();
storNotsToLocalStorage();

createNoteButton.addEventListener('click', () => {
  promptNote.classList.toggle('hidden');
  textPrompt.value = '';
  textPrompt.focus();

  submitPromptBtn.classList.remove('hidden');
  submitEditBtn.classList.add('hidden');
});

cancelPromptBtn.addEventListener('click', () => {
  promptNote.classList.toggle('hidden');
});

submitPromptBtn.addEventListener('click', () => {
  const text = textPrompt.value;
  nots.push({
    text,
    id: generateUniqueId()
  });
  renderNots();
  storNotsToLocalStorage();
  promptNote.classList.toggle('hidden');
});

function editNote(id) {
  const noteToEdit = nots.find(note => note.id === id);

  submitPromptBtn.classList.add('hidden');
  submitEditBtn.classList.remove('hidden');
  promptNote.classList.toggle('hidden');

  textPrompt.focus();

  textPrompt.value = noteToEdit.text;

  submitEditBtn.onclick = () => {
    const text = textPrompt.value;
    noteToEdit.text = text;
    renderNots();
    storNotsToLocalStorage();
    promptNote.classList.add('hidden');
  }
}

function deleteNote(id) {
  nots = nots.filter(note => note.id !== id);
  renderNots();
  storNotsToLocalStorage();
}


// #endregion  end nots logic


