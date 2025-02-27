const pataNahi = (fn, delay) => {
    let myId = null
    // console.log(parameters);
    
    return (...args) => {
        console.log(...args);
        
        if (myId === null) {
            fn(...args);
            myId = setTimeout(() => {
                myId = null
            }, delay);
        }
    }
}

// the above code is a concept of Throttling
// e.g: in coding platform the run button delayed for 30 second when we click run button for 2nd time
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
// www.geeksforgeeks.org/difference-between-debouncing-and-throttling/

// VERY IMPORTANT NOTE TO UNDERSTAND JAVASCRIPT ==> konse memory me data jara hai and oh daigram (event loop) yaad rahkna hai because functions kis kis queue me jara hai aur kaise execution hora hai

pataNahi();
pataNahi()
pataNahi()
