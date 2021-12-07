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

const sortAndCountFish = (fish) => {

  const fishNumbers = [];

  for (let i = 0; i < 9; i++) {
    fishNumbers.push(0);
  }

  for (let i = 0; i < fish.length; i++) {
    const daysToSpawn = fish[i];
    fishNumbers[daysToSpawn]++;
  }

  return fishNumbers;
};

const updateFishNumbers = (fishNumbers) => {

  const newFishNumbers = [];
  const numberOfSpawningFish = fishNumbers[0];

  for (let i = 0; i < fishNumbers.length - 1; i++) {
    newFishNumbers[i] = fishNumbers[i + 1];
  }

  newFishNumbers[6] += numberOfSpawningFish;
  newFishNumbers[8] = numberOfSpawningFish;

  return newFishNumbers;
};

const handleStringResult = (result) => {

  let fish = result.split(',');
  let fishNumbers;

  for (let i = 0; i < fish.length; i++) {
    fish[i] = parseInt(fish[i]);
  }

  fishNumbers = sortAndCountFish(fish);

  for (let day = 0; day < 256; day++) {
    fishNumbers = updateFishNumbers(fishNumbers);
  }

  console.log(fishNumbers.reduce((previous, current) => {
    return previous + current;
  }, 0));
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
