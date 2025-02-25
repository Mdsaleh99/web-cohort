const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addButton");
const ul = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

addBtn.addEventListener("click", () => {
  const li = document.createElement("li");
  li.classList.add("task-item");
  const value = taskInput.value;

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.classList.add("complete-checkbox");
  li.append(checkBox);

  // li.innerText = value; // ❌ removes the checkbox when adding the task text. Overwrites the checkbox  (1)

  //   const textNode = document.createTextNode(value); // we Use createTextNode() to add text without removing existing elements. Create a text node for the task text.  This adds the text without removing existing elements (like the checkbox) (2)

  //   li.appendChild(textNode); // Adds the task text after the checkbox without removing existing elements. (2)

  const textSpan = document.createElement("span"); //  Created a span element. because To add a CSS class to a text element, we can't directly apply a class to a TextNode since it only contains raw text without any HTML element structure. e.g: <p>, <span> etc.  (3)
  textSpan.classList.add("task-text"); //  (3)
  textSpan.textContent = value; //  (3)
  li.appendChild(textSpan); // Append the span to li.  (3)

  const btn = document.createElement("button");
  li.appendChild(btn);
  btn.classList.add("delete-button");
  btn.innerText = "Delete";

    ul.appendChild(li);
    taskInput.value = ""
});
