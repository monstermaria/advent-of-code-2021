const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
// const inputPromise = fs.readFile('./input.txt', 'utf-8');
const inputPromise = fs.readFile('./riskLevel.txt', 'utf-8');

const parseInt = (nbrString) => {
  let nbr;

  try {
    nbr = Number.parseInt(nbrString);
  } catch (error) {
    console.error(error);
  }

  return nbr;
};

const riskLevelMap = [];
const lowestRiskMap = [];
let lowestRisk = Number.MAX_SAFE_INTEGER;

const getRiskLevelMap = (input) => {

  const riskRows = input.split('\n');

  for (let row = 0; row < riskRows.length; row++) {

    const riskRow = riskRows[row];

    if (riskRow === '') {

      continue;
    }

    riskLevelMap[row] = [];
    lowestRiskMap[row] = [];

    for (let column = 0; column < riskRow.length; column++) {

      riskLevelMap[row][column] = parseInt(riskRow.charAt(column));
      lowestRiskMap[row][column] = Number.MAX_SAFE_INTEGER;
    }
  }
};

const calculatRouteRisk = (row, column, risk) => {

  risk += riskLevelMap[row][column];

  // discard this route if there already is a better or equally good route to this point
  if (risk >= lowestRiskMap[row][column]) {

    return;
  }

  // check if this route have already exceeded the risk level of the best route
  if (risk >= lowestRisk) {

    return;
  }

  // this route is better than the previous one
  lowestRiskMap[row][column] = risk;

  // check if this is the end point
  if (row === riskLevelMap.length - 1 && column === riskLevelMap[row].length - 1) {

    // update info on safest route
    lowestRisk = risk;

    return;
  }

  // start new route recursions for all directions from here
  if (row < riskLevelMap.length - 1) {

    calculatRouteRisk(row + 1, column, risk); // down
  }

  if (column < riskLevelMap[row].length - 1) {

    calculatRouteRisk(row, column + 1, risk); // right
  }

  if (column > 0) {

    calculatRouteRisk(row, column - 1, risk); // left
  }

  if (row > 0) {

    calculatRouteRisk(row - 1, column, risk); // up
  }
};

const handleStringResult = (result) => {

  getRiskLevelMap(result);

  const startTime = Date.now();

  calculatRouteRisk(0, 0, -riskLevelMap[0][0]);

  const stopTime = Date.now();

  const seconds = (stopTime - startTime) / 1000;

  console.log('Time to calculate the best route:', seconds)

  console.log('The lowest risk is', lowestRisk);

};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
