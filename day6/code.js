const fs = require('fs/promises');

const inputPromise = fs.readFile('./input.txt', 'utf-8');

const parseInt = (nbrString, radix) => {
  let nbr;

  try {
    nbr = Number.parseInt(nbrString, radix);
  } catch (error) {
    console.error(error);
  }

  return nbr;
};

const updateFish = (fish) => {

  const numberOfOldFish = fish.length;

  for (let i = 0; i < numberOfOldFish; i++) {
    if (fish[i] === 0) {
      fish.push(8);
      fish[i] = 6;
    } else {
      fish[i]--;
    }
  }

  return fish;
};

const handleStringResult = (result) => {

  // let fish = [3,4,3,1,2];
  let fish = result.split(',');

  for (let i = 0; i < fish.length; i++) {
    fish[i] = parseInt(fish[i]);
  }

  for (let day = 0; day < 80; day++) {
    fish = updateFish(fish);
    console.log('Day', day, fish.length);
  }

  console.log(fish.length);

};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
