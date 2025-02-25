/*
Problem statement
You are designing a simple robot system. Each robot has a name and a battery Level. The robot should have a method charge() that increases the battery level by 20, but it cannot exceed 100.

Challenge
Implement a constructor function Robot that initializes name and batteryLevel.
Attach a method charge() to its prototype that increases batteryLevel by 20, ensuring it does not go above 100.
*/

function Robot(name, batteryLevel) {
  // Initialize name and batteryLevel properties
  this.name = name;
  this.batteryLevel = batteryLevel;
}

// Define charge method on Robot's prototype
Robot.prototype.charge = function () {
  this.batteryLevel = Math.min(this.batteryLevel + 20, 100);
  return this.batteryLevel;
};
