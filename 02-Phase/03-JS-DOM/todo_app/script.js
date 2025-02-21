const addBtn = document.getElementById("add-btn")
const todoInput = document.getElementById("todo-input")
const todoItems = document.getElementById("todo-items")

addBtn.addEventListener('click', () => {
    const value = todoInput.value
    // console.log(value);
    const li = document.createElement('li')
    const delBtn = document.createElement('button')
    li.innerText = value
    delBtn.innerText = "X"
    li.appendChild(delBtn)
    todoItems.appendChild(li)
    delBtn.addEventListener('click', () => {
        li.remove()
    })
    todoInput.value = ''

    
})