function shinyDiamondRug(n) {
  let diamond = "";
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n - i; j++) {
      diamond += " ";
    }

    for (let k = 1; k <= 2 * i - 1; k++) {
      diamond += "*";
    }
    diamond += "\n";
  }

  for (let i = n - 1; i >= 1; i--) {
    for (let j = 1; j <= n - i; j++) {
      diamond += " ";
    }

    for (let k = 1; k <= 2 * i - 1; k++) {
      diamond += "*";
    }
    diamond += "\n";
  }

  return diamond;
}

console.log(shinyDiamondRug(3));

// function invertedMountain(n) {
//   let inverse = "";
//   for (let i = n; i >= 1; i--) {
//     for (let j = 1; j <= i; j++) {
//       inverse += "*";
//     }
//     inverse += "\n";
//   }

//   return inverse;
// }
// console.log(invertedMountain(4));
