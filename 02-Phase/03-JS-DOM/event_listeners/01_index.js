function changeBackground(color) {
  document.body.style.backgroundColor = color;
}

// // Event Listeners
// const darkModeBtn = document.getElementById("dark-mode-button");
// darkModeBtn.addEventListener("click", () => {
//     changeBackground('black')
// });


const themeBtn = document.getElementById("theme-mode");
themeBtn.addEventListener("click", () => {
    const currnetColor = document.body.style.backgroundColor
    if (!currnetColor || currnetColor == 'white') {
        changeBackground('black')
        
        themeBtn.innerText = "Light Mode"
    } else {
        changeBackground("white")
        themeBtn.innerText = "Dark Mode"
    }
});