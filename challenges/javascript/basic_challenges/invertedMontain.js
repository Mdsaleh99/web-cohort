function invertedMountain(n) {
  let inverse = "";
  for (let i = n; i >= 1; i--) {
    for (let j = 1; j <= i; j++) {
      inverse += "*";
    }
    inverse += "\n";
  }

  return inverse;
}
console.log(invertedMountain(4));
