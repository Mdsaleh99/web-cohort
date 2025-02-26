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

pataNahi()
pataNahi()
pataNahi()
