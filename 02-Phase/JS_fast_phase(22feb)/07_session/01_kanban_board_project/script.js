const addTaskBtn = document.getElementById("add-task-btn");
const todoBoard = document.getElementById("todo-board");

// Card - Drag start
// Card - Drag end
// Board k upper se kuch gaya oh hota hai - Drag over

function attachDragEvents(target) { // konsa task board k upper se gaya find karne k liye yeh function likha hai. jab drag start hoga 'flying' attribute add kardo and jab drag end hoga toh oh attribute remove kardo. and jabhi oh card board k upper aayega tab hum oh particluar card search karsakte hai jiske upper 'flying' attribute laga hua hai
  target.addEventListener("dragstart", () => {
    target.classList.add("flying");
  });
  target.addEventListener("dragend", () => {
    target.classList.remove("flying");
  });
}

addTaskBtn.addEventListener("click", () => {
  const input = prompt("What is the task?");
  if (!input) return;

  const taskCard = document.createElement("p");
  taskCard.classList.add("item");
  taskCard.setAttribute("draggable", true);
  taskCard.innerText = input;

  attachDragEvents(taskCard);

  todoBoard.appendChild(taskCard);
});

// const allBoards = document.getElementsByClassName('board')
const allBoards = document.querySelectorAll(".board");
const allItems = document.querySelectorAll(".item");

// allItems.forEach((item) => attachDragEvents(item));
allItems.forEach(attachDragEvents); // this and above foreach code is same, here jab forEach 'attachDragEvents' function ko call karega tab automatically first parameter item dedega. buss hum ek function wrapper hata diya yese '(item) => attachDragEvents(item)'. if function not accepting a parameter we can not do like this 'allItems.forEach(attachDragEvents)' but this works when  '(item) => at...ts(item)' both parameter signature are same

allBoards.forEach((board) => {
  board.addEventListener("dragover", () => {
    const flyingElement = document.querySelector(".flying");
    console.log(board, "Kuch toh mere upper se gya", flyingElement);

    board.appendChild(flyingElement); // .appendChild() If the node already exists in the DOM, it is moved, not duplicated.
  });
});

