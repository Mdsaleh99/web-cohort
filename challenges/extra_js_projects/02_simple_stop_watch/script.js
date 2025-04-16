const timeInput = document.getElementById('timeInput')
const startBtn = document.getElementById("startBtn")
const countdownDisplay = document.getElementById("countdownDisplay")

function startTimer() {
    let valueInSeconds = parseInt(timeInput.value);
    // console.log(typeof valueInSeconds);
    
    if (isNaN(valueInSeconds)) {
        countdownDisplay.innerText = "Please enter a number"
        return
    }

    if (valueInSeconds <= 0) {
        countdownDisplay.innerText = "Please enter a number grater than 0"
        return
    }

    let timerId = setInterval(function () {
        valueInSeconds--
        countdownDisplay.innerText = `Time remaining: ${valueInSeconds} seconds`;
        if (valueInSeconds <= 0) {
            clearInterval(timerId);
            countdownDisplay.innerText = "Times Up"
        }
    }, 1000)

    
}

startBtn.addEventListener("click", startTimer)

