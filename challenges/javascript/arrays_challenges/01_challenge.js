/*
01. JS Arrays

You are organizing a party and have a list of invited guests. But just before the party starts, a new friend decides to join. You need to add them to the guest list.
Problem Statement: Create a function that adds a new guest list and returns the updated list.
*/
function addGuest(guestList, newGuest) {
  // Add the newGuest to guestList and return the updated list
  guestList.push(newGuest);
  return guestList;
}

let updatedGuest = addGuest(["Anirudh", "hi"], "Radhika")
console.log(updatedGuest);
