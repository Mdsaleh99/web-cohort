const bulb = document.getElementById("bulb")
const bulbToggleBtn = document.getElementById("toggleButton")
const bulbStatus = document.getElementById("status")
const body = document.getElementById("body")
const h1 = document.getElementsByTagName("h1")[0]
const p = document.getElementsByTagName("p")[0]

// To change the text color of only the first <p> or <h1> tag using DOM and getElementsByTagName, you can access the element by its index (0 for the first one).
// getElementsByTagName("h1")[0] → Selects the first <h1> tag.
// 💡 Tip:   1) The index starts at 0.      2) To target the second tag, use [1].



bulbToggleBtn.addEventListener('click', () => {
    const currnetBulbColor = bulb.style.backgroundColor

    if (!currnetBulbColor || currnetBulbColor === 'grey') {
        
        bulb.style.backgroundColor = "yellow";
        body.style.backgroundColor = "black"
        h1.style.color = "white"
        p.style.color = "white"
        bulbStatus.innerText = "Status: On";
        bulbToggleBtn.innerText = "Turn Off";
        bulbStatus.style.color = "white"
        
    } else {
        bulb.style.backgroundColor = "";
        bulbStatus.innerText = "Status: Off";
        bulbToggleBtn.innerText = "Trun On";
        bulbStatus.style.color = "";
        body.style.backgroundColor = "";
        h1.style.color = "";
        p.style.color = "";
    }
    
})
