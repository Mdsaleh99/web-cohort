const nameInput = document.getElementById("nameInput")
const jobInput = document.getElementById("jobInput")
const ageInput = document.getElementById("ageInput")
const bioInput = document.getElementById("bioInput")
const nameDisplay = document.getElementById("nameDisplay")
const jobDisplay = document.getElementById("jobDisplay")
const ageDisplay = document.getElementById("ageDisplay")
const bioDisplay = document.getElementById("bioDisplay")


nameInput.addEventListener("input", (e) => {
    nameDisplay.innerText = e.target.value
})

ageInput.addEventListener("input", (e) => {
    ageDisplay.innerText = e.target.value
})

jobInput.addEventListener("input", (e) => {
    jobDisplay.innerText = e.target.value
})

bioInput.addEventListener("input", (e) => {
    bioDisplay.innerText = e.target.value
})