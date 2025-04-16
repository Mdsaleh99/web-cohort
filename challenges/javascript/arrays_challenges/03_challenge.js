function addPuppy(queue, puppyName) {
  // Add puppyName at the beginning of queue and return updated queue
  queue.unshift(puppyName);
  return queue;
}

console.log(addPuppy(["hello", "hi"], "hiii"));
