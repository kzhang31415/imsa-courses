function scramble(s) {
  const indices = [1, 3, 10, 2, 13, 6, 0, 5, 15, 7, 11, 14, 4, 12, 9, 8];
  var scrambled = [];
  for(var i = 0; i < s.length; i++){
    scrambled[i] = s[indices[i]];
  }
  return scrambled.join("");
}

modules.export = { scramble };