# 1. Sync vs Async Methods
Task Type	            Sync / Async?	            Handled By?
fs.readFileSync()	        Sync   	                 JavaScript Engine
fs.readFile()	            Async ✅	                libuv Thread Pool
http.get()	                Async ✅	                OS Networking API
setTimeout()	            Async ✅	                Event Loop
for Loop	                Sync 	                 JavaScript Engine
bcrypt.hashSync()	        Sync 	                 JavaScript Engine
bcrypt.hash()	            Async ✅	                libuv Thread Pool
crypto.pbkdf2()	            Async ✅	                libuv Thread Pool
console.log()	            Sync 	                 JavaScript Engine

# 2. Thread Pool 
Async Methods run on a separate thread in libuv's thread pool. 
Libuv has 4 threads by default. 

# 3. Sync vs Async Execution
Main thread execute our sync code and pass on the async code to lib uv. 
User written sync Js code has higher priority than async code. 
Sync code will execute first then Main thread will check the callstack that if there is anything in callback queue.

# 4. Micro Queue
Your Event Loop first goes into micro queue where there are 2 queues -> nextTick queue & Promise queue
nextTick queue has higher priority then Promise queue

nextTick and Promise queues are executed in between each queue and also in between each callback execution in the timer and check queues

At the time of code execution all the callbacks are added to their respective queues 
then first micro queue is executed first ( nt -> promises) 
when the nextTick queue is executed and the promises queue is also empty and done executing all the callbacks,
they will move to    Timer Queue -> I/O queue -> Check Queue -> Close Queue -> 

# 5. Timer Queue
After execution of callbacks in micro queue -> Timer Queue
After every callbacks execution in the Timer queue the event loop will check the micro queue and execute accordingly

# 6. 