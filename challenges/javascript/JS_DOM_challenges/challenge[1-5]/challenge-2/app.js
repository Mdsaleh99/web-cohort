const redBtn = document.getElementById("redButton")
const greenBtn = document.getElementById("greenButton")
const blueBtn = document.getElementById("blueButton")
const purpleBtn = document.getElementById("purpleButton")
const resetBtn = document.getElementById("resetButton")
const heading = document.getElementById("mainHeading")

function changeTextColor(color) {
    heading.style.color = color
}

redBtn.addEventListener("click", () => {
    changeTextColor("red")
})

greenBtn.addEventListener("click", () => {
    changeTextColor("green")
})

blueBtn.addEventListener("click", () => {
    changeTextColor("blue")
})

purpleBtn.addEventListener("click", () => {
    changeTextColor("purple")
})

resetBtn.addEventListener("click", () => {
    changeTextColor("")
})
