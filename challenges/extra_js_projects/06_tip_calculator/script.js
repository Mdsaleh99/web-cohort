const billAmountInput = document.getElementById("billAmount");
const tipPercentageInput = document.getElementById("tipPercentage");
const numPeopleInput = document.getElementById("numPeople");
const calculateButton = document.getElementById("calculateButton");
const totalTipDisplay = document.getElementById("totalTip");
const tipPerPersonDisplay = document.getElementById("tipPerPerson");

calculateButton.addEventListener('click', claculateTip)

function claculateTip() {
    const billAmount = parseFloat(billAmountInput.value)
    const tipPercentage = parseFloat(tipPercentageInput.value)
    const numPeople = parseInt(numPeopleInput.value)

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
    // validations
    if (Number.isNaN(billAmount) || Number.isNaN(tipPercentage) || Number.isNaN(numPeople)) {
        alert("Please enter valid values for all fields")
        return
    }

    const totalTip = ((billAmount * tipPercentage) / 100).toFixed(2)
    const tipPerPerson = totalTip / numPeople

    totalTipDisplay.textContent = `Total Tip: $${totalTip}`;
    tipPerPersonDisplay.textContent = `Tip Per Person: $${tipPerPerson.toFixed(2)}`;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
}