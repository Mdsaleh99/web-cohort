/**
 * Write your challenge solution here
 */
// Image data
const images = [
  {
    url: "https://plus.unsplash.com/premium_photo-1666863909125-3a01f038e71f?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "Beautiful Mountain Landscape",
  },
  {
    url: "https://plus.unsplash.com/premium_photo-1690576837108-3c8343a1fc83?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "Ocean Sunset View",
  },
  {
    url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "Autumn Forest Path",
  },
  {
    url: "https://plus.unsplash.com/premium_photo-1680466057202-4aa3c6329758?q=80&w=2138&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "Urban City Skyline",
  },
];

const carouselContainerById = document.getElementById("carousel");
const carouselContainerByClassName =
  document.getElementsByClassName("carousel-container");
const carouselTrack = document.getElementById("carouselTrack");
const carouselCaptionById = document.getElementById("caption");
const carouselCaptionByClassName = document.getElementsByClassName("carousel-caption");
const prevBtn = document.getElementById("prevButton");
const nextBtn = document.getElementById("nextButton");
const carouselNav = document.getElementById("carouselNav");
const carouselNavByClassName = document.getElementsByClassName("carousel-nav");
const autoPlayBtn = document.getElementById("autoPlayButton");
const timerDisplay = document.getElementById("timerDisplay");
const carousel = document.querySelector(".carousel-container .carousel-track");

console.log(autoPlayBtn);
console.log(carouselCaptionByClassName);
console.log(carouselContainerById);
console.log(carouselNav);

document.addEventListener("DOMContentLoaded", () => {
  // let img = document.createElement("img"); // if we write this here it creates only one 'img' element so we written this in forEach() for every iteration create a new 'img'

  images.forEach((image, index) => {
    let img = document.createElement("img");
    img.src = image.url;
    img.classList.add("carousel-slide");
    carouselTrack.appendChild(img);

    console.log(img);
  });

  for (let i = 0; i < images.length; i++) {
    let span = document.createElement("span");
    carouselNav.appendChild(span);
    span.classList.add("carousel-indicator");
  }

  let currentIndex = 0;

  function chnageSlideAndCaption() {
    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    carouselCaptionById.innerText = images[currentIndex].caption;
    const spanIndicator = document.querySelectorAll(
      ".carousel-nav .carousel-indicator"
    );
    spanIndicator.forEach((indicator) => {
      indicator.classList.remove("active");
    });
    spanIndicator[currentIndex].classList.add("active");
    console.log(spanIndicator);
  }

  // carouselCaptionById.innerText = images[currentIndex].caption;
  // const spanIndicator = document.querySelectorAll(".carousel-nav .carousel-indicator");
  // spanIndicator[currentIndex].classList.add("active")
  
  chnageSlideAndCaption(); // instead of writing above 3 lines direct call this function to initalise caption and indicator when page is loaded. by writing above code we voilating the 'DRY' principle

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    chnageSlideAndCaption();
  });

  nextBtn.addEventListener("click", () => {
    // let currentIndex = 0; // if we declare currentIndex here, its resets to 0 every time. so, fix this write this outside the event listener.
    const totalSlides = images.length;
    currentIndex = (currentIndex + 1) % totalSlides; // Loop back to first slide
    // carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`; // by doing this we changing only image not both image and caption so we written updateSlide() function which change the caption accordingly when image changes
    chnageSlideAndCaption();
    // console.log(currentIndex);
  });
  let seconds = 1;
  function updateTimer() {
    timerDisplay.textContent = seconds
    seconds++
  }
  autoPlayBtn.addEventListener('click', function () {
    setInterval(updateTimer, 1000)

    // setTimeout(, 2000)
  })

});

// translateX() function allows you to re-position an element along the x-axis (horizontally).

/*
currentIndex = (currentIndex - 1 + images.length) % images.length;
Understanding the Formula
(currentIndex - 1): Moves to the previous slide.
+ images.length: Ensures we avoid negative indices when currentIndex is 0.
% images.length: Ensures the index wraps around properly when reaching the first slide.

E.g:
Let’s say we are at index 2 (currentIndex = 2) and click "Previous":
currentIndex = (2 - 1 + images.length) % images.length;
          = (1 + 4) % 4;
          = 5 % 4;
          = 1;  // Moves to index 1

*/