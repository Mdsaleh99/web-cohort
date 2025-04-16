class TaskScheduler {
  constructor(concurrency) {
    this.concurrency = Number(concurrency);
    this.runningTask = 0
    this.__waitingQueue = []
  }
  
  getNextTask() {
    if(this.runningTask < this.concurrency && this.__waitingQueue.length > 0){
        const nextTask = this.__waitingQueue.shift()
        nextTask()
    }
  }
    

  addTask(task) {
    return new Promise((resolve, reject) => {
        async function __taskRunner() {
            this.runningTask += 1
            try {
                const result = await task()
                console.log("Result", result);
                resolve(result)
            } catch (error) {
                console.log('Task Failed', error);
                reject(error)
            } finally {
                this.runningTask -= 1
                // after decrement , See if there is any taske in Queue
                // if so, run that
                this.getNextTask()
            }
        }
        
        if (this.runningTask < this.concurrency) {
            __taskRunner.call(this)
        } else {
            this.__waitingQueue.push(__taskRunner.bind(this))
        }
    });
  }
}

const scheduler = new TaskScheduler(2)

scheduler.addTask(
    () => new Promise((res) => setTimeout(() => res('Task 1'), 5 * 1000))
)

scheduler.addTask(
  () => new Promise((res) => setTimeout(() => res("Task 2"), 5 * 1000))
);

scheduler.addTask(
  () => new Promise((res) => setTimeout(() => res("Task 3"), 5 * 1000))
);

scheduler.addTask(
  () => new Promise((res) => setTimeout(() => res("Task 4"), 5 * 1000))
);


/*
* 📌 What is a Task Scheduler? (Simple Explanation)
A Task Scheduler is a system that manages and runs tasks (or jobs) based on certain rules, such as time intervals, priorities, or limits on the number of tasks running at once.

Imagine a task scheduler as a chef in a restaurant who can cook only a few dishes at a time (limit). When orders come in (tasks), the chef follows these rules:
If there's space on the stove, the chef starts cooking.
If the stove is full, new orders wait in line.
As soon as one dish is done, the next order starts.

This ensures that the chef does not overload the stove and burns the food (prevents system overload).

! ========================================================================================

* 📌 Task Scheduler with a Limit
Many schedulers limit the number of tasks that can run simultaneously to avoid performance issues.

For example, if the limit is 3, and 5 tasks are waiting:
The first 3 tasks start immediately.
The remaining 2 tasks wait in the queue.
As soon as a running task finishes, a waiting task starts.



*/