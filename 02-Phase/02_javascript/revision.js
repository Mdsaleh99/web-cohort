const tea = {
  name: "Lemon tea",
  type: "Green",
  caffeineContent: "low",
};

console.log(typeof tea.name);
console.log(typeof tea.type);
console.log(typeof tea.caffeineContent);

tea.origin = "China";

console.log(tea);

tea.caffeineContent = "medium";

delete tea.type;

console.log("origin" in tea);

for (const key in object) {
  console.log(object[key]);
}

const myTeas = {
  greenTea: {},
  blackTea: {},
};
