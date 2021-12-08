const fs = require('fs/promises');
const { posix } = require('path');

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

const fuelConsumptionPerDistance = [];

let lowestPosition = Number.MAX_SAFE_INTEGER;
let highestPosition = Number.MIN_SAFE_INTEGER;
let lowestFuelConsumption = Number.MAX_SAFE_INTEGER;

const sortAndCountCrabPositions = (crabPositions) => {

  const crabPositionNumbers = [];

  for (let i = 0; i < crabPositions.length; i++) {
    const position = crabPositions[i];

    lowestPosition = position < lowestPosition ? position : lowestPosition;
    highestPosition = position > highestPosition ? position : highestPosition;

    if (!crabPositionNumbers[position]) {
      crabPositionNumbers[position] = 0;
    }

    crabPositionNumbers[position]++;
  }

  return crabPositionNumbers;
};

const calculateFuelConsumptionForEveryDistance = () => {

  let fuelConsumption = 0;

  for (let i = 0; i <= highestPosition; i++) {
    fuelConsumption += i;
    fuelConsumptionPerDistance[i] = fuelConsumption;
  }
};

const calculateFuelConsumption = (crabPositionNumbers) => {

  const fuelConsumptionNumbers = [];

  calculateFuelConsumptionForEveryDistance();

  for (let newPos = lowestPosition; newPos <= highestPosition; newPos++) {

    let fuelConsumption = 0;

    for (let oldPos = lowestPosition; oldPos <= highestPosition; oldPos++) {

      const numberOfCrabs = crabPositionNumbers[oldPos];

      if (!numberOfCrabs) {
        continue;
      }

      const distance = Math.abs(newPos - oldPos);
      const fuelPerCrab = fuelConsumptionPerDistance[distance];

      fuelConsumption += numberOfCrabs * fuelPerCrab;
    }

    fuelConsumptionNumbers[newPos] = fuelConsumption;

    if (fuelConsumption < lowestFuelConsumption) {
      lowestFuelConsumption = fuelConsumption;
    }
  }

  return fuelConsumptionNumbers;
};

const handleStringResult = (result) => {

  let crabPositions = result.split(',');

  for (let i = 0; i < crabPositions.length; i++) {
    crabPositions[i] = parseInt(crabPositions[i]);
  }

  console.log(crabPositions.length);

  let crabPositionNumbers = sortAndCountCrabPositions(crabPositions);

  console.log(lowestPosition, highestPosition);
  console.log(crabPositionNumbers.length);

  let fuelConsumptionNumbers = calculateFuelConsumption(crabPositionNumbers);

  console.log(fuelConsumptionNumbers);
  console.log(lowestFuelConsumption);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
