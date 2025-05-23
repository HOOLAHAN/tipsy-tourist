// src/utils/onlyUnique.js

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export default onlyUnique;