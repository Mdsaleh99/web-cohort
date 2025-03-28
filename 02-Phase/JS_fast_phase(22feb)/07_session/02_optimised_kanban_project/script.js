let draggedCard = null;
let rightClickedCard = null;

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

function addTask(columnId) {
  const input = document.getElementById(`${columnId}-input`);
  const taskText = input.value.trim();
  if (taskText === "") {
    return;
  }
  const taskDate = new Date().toLocaleString();
  const taskElement = createTaskElement(taskText, taskDate); // Pass date
  document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
  saveTaskToLocalStorage(columnId, taskText, taskDate);
  input.value = "";
  updateTaskCount(columnId);
}

function createTaskElement(taskText, taskDate = null) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("card");

  if (!taskDate) {
    const now = new Date();
    taskDate = now.toLocaleString();
  }

  taskElement.innerHTML = `<span>${taskText}</span><br><small id="time">${taskDate}</small>`;

  taskElement.draggable = true;
  taskElement.addEventListener("dragstart", dragStart);
  taskElement.addEventListener("dragend", dragEnd);
  taskElement.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    rightClickedCard = this;
    console.log(event.pageX, event.pageY);

    showContextMenu(event.pageX, event.pageY);
  });
  return taskElement;
}

function dragStart() {
  setTimeout(() => {
    this.classList.add("dragging");
  }, 100);

  draggedCard = this;
}
function dragEnd() {
  this.classList.remove("dragging");
  draggedCard = null;
  updateLocalStorage();
  ["todo", "doing", "done"].forEach(updateTaskCount);
}

const columns = document.querySelectorAll(".column .tasks");
columns.forEach((column) => {
  column.addEventListener("dragover", dragOver);
});

function dragOver(event) {
  event.preventDefault();

  const afterElement = getDragAfterElement(this, event.pageY);

  if (afterElement === null) {
    this.appendChild(draggedCard);
  } else {
    this.insertBefore(draggedCard, afterElement);
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".card:not(.dragging)"),
  ];

  const result = draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();

      const offset = y - box.top - box.height / 2;
      console.log(offset);

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  );
  return result.element;
}

const contextMenu = document.getElementsByClassName("context-menu")[0];

function showContextMenu(x, y) {
  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  contextMenu.style.display = "block";
}

document.addEventListener("click", function () {
  contextMenu.style.display = "none";
});

function editTask() {
  if (rightClickedCard !== null) {
    const newTaskText = prompt(
      "Edit task:-",
      rightClickedCard.querySelector("span").textContent
    ).trim();
    if (newTaskText !== "") {
      rightClickedCard.querySelector("span").textContent = newTaskText;
      updateLocalStorage();
    }
  }
}

function deleteTask() {
  if (rightClickedCard !== null) {
    const columnId = rightClickedCard.parentElement.id.replace("-tasks", "");
    rightClickedCard.remove();
    updateTaskCount(columnId);
    updateLocalStorage();
  }
}

function updateTaskCount(columnId) {
  const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
  document.getElementById(`${columnId}-count`).textContent = count;
}

function saveTaskToLocalStorage(columnId, taskText, taskDate) {
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  tasks.push({ text: taskText, date: taskDate });
  localStorage.setItem(columnId, JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.forEach(({ text, date }) => {
      const taskElement = createTaskElement(text, date);
      document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
    });
    updateTaskCount(columnId);
  });
}

function updateLocalStorage() {
  ["todo", "doing", "done"].forEach((columnId) => {
    const tasks = [];
    document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card) => {
      const taskText = card.querySelector("span").textContent;
      const taskDate = card.querySelector("small").textContent;
      tasks.push({ text: taskText, date: taskDate });
    });
    localStorage.setItem(columnId, JSON.stringify(tasks));
  });
}
