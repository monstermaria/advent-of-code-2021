const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const parseInt = (nbrString) => {
  let nbr;

  try {
    nbr = Number.parseInt(nbrString);
  } catch (error) {
    console.error(error);
  }

  return nbr;
};

const printOctopuses = (octopuses) => {

  for (let row = 0; row < octopuses.length; row++) {

    console.log(octopuses[row].join());
  }
};

const increaseEnergyLevel = (octopuses) => {

  for (let row = 0; row < octopuses.length; row++) {

    for (let column = 0; column < octopuses[row].length; column++) {

      octopuses[row][column]++;
    }
  }
};

const setOfFlashes = (octopuses, octopusesFlashed, row, column, nearbyFlashed) => {

  // check if row or column is out of range, then there is no flashes here
  if (row < 0 || row >= octopuses.length || column < 0 || column >= octopuses[row].length) {

    return 0;
  }

  // check if this octopus has already flashed
  if (octopusesFlashed[row][column]) {

    // no more flashes here
    return 0;
  }

  // increase energy level if a nearby octopus flashed
  if (nearbyFlashed) {

    octopuses[row][column]++;
  }

  // this octopus might flash
  let flashes = 0;

  if (octopuses[row][column] > 9) {

    // flash!
    flashes++;
    octopusesFlashed[row][column] = true;

    // set of flashes for surrounding octopuses

    // octopuses above
    flashes += setOfFlashes(octopuses, octopusesFlashed, row - 1, column - 1, true);
    flashes += setOfFlashes(octopuses, octopusesFlashed, row - 1, column, true);
    flashes += setOfFlashes(octopuses, octopusesFlashed, row - 1, column + 1, true);

    // octopuses on the sides
    flashes += setOfFlashes(octopuses, octopusesFlashed, row, column - 1, true);
    flashes += setOfFlashes(octopuses, octopusesFlashed, row, column + 1, true);

    // octopuses below
    flashes += setOfFlashes(octopuses, octopusesFlashed, row + 1, column - 1, true);
    flashes += setOfFlashes(octopuses, octopusesFlashed, row + 1, column, true);
    flashes += setOfFlashes(octopuses, octopusesFlashed, row + 1, column + 1, true);
  }

  return flashes;
};

const checkForFlashes = (octopuses, octopusesFlashed) => {

  let flashes = 0;

  for (let row = 0; row < octopuses.length; row++) {

    for (let column = 0; column < octopuses[row].length; column++) {

      flashes += setOfFlashes(octopuses, octopusesFlashed, row, column, false);
    }
  }

  return flashes;
};

const resetFlashedOctopuses = (octopuses, octopusesFlashed) => {

  for (let row = 0; row < octopuses.length; row++) {

    for (let column = 0; column < octopuses[row].length; column++) {

      if (octopuses[row][column] > 9) {

        octopuses[row][column] = 0;
      }

      octopusesFlashed[row][column] = false;
    }
  }
};

const handleStringResult = (result) => {

  // prepare octopus data
  const octopuses = result.split('\n');

  for (let row = 0; row < octopuses.length; row++) {
    octopuses[row] = octopuses[row].split('').map(parseInt);
  }

  // prepare helper data
  const octopusesFlashed = [];

  for (let row = 0; row < octopuses.length; row++) {
    octopusesFlashed.push([]);
    for (let column = 0; column < octopuses[row].length; column++) {
      octopusesFlashed[row].push(false);
    }
  }

  printOctopuses(octopuses);

  let totalNumberOfFlashes = 0;

  for (let i = 0; i < 100; i++) {

    increaseEnergyLevel(octopuses);

    totalNumberOfFlashes += checkForFlashes(octopuses, octopusesFlashed);

    resetFlashedOctopuses(octopuses, octopusesFlashed);
  }

  console.log('Total number of flashes:', totalNumberOfFlashes);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
