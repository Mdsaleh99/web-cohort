function filterHealthy(foodList) {
  // Remove unhealthy food and return updated list
  return foodList.filter((food) => food !== "Burger");
   
}
console.log(filterHealthy(["sugar", "Burger", "hello"]));
