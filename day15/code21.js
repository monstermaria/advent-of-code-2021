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

const riskLevelMap = [];
const lowestRiskMap = [];
let lowestRisk = Number.MAX_SAFE_INTEGER;

const getRiskLevelMap = (input) => {

  const riskRows = input.split('\n');
  const mapTiles = [];

  for (let i = 0; i < 9; i++) {

    mapTiles.push([]);
  }

  for (let row = 0; row < riskRows.length; row++) {

    const riskRow = riskRows[row];

    if (riskRow === '') {

      continue;
    }

    for (let i = 0; i < 9; i++) {

      mapTiles[i].push([]);
    }

    for (let column = 0; column < riskRow.length; column++) {

      const risk = parseInt(riskRow.charAt(column));

      for (let i = 0; i < 9; i++) {

        let modifiedRisk = risk + i;

        if (modifiedRisk > 9) {

          modifiedRisk -= 9;
        }

        mapTiles[i][row][column] = modifiedRisk;
      }
    }
  }

  // expand map
  const numberOfRowsPerTile = mapTiles[0].length;
  const maxIntArray = [];

  for (let column = 0; column < riskRows[0].length; column++) {

    maxIntArray[column] = Number.MAX_SAFE_INTEGER;
  }

  for (let row = 0; row < numberOfRowsPerTile; row++) {

    for (let offset = 0; offset < 5; offset++) {

      const rowOffset = offset * numberOfRowsPerTile + row;
      const tileOffset = offset;

      riskLevelMap[rowOffset] = mapTiles[tileOffset + 0][row].concat(
        mapTiles[tileOffset + 1][row],
        mapTiles[tileOffset + 2][row],
        mapTiles[tileOffset + 3][row],
        mapTiles[tileOffset + 4][row]
      );

      lowestRiskMap[rowOffset] = maxIntArray.concat(maxIntArray, maxIntArray, maxIntArray, maxIntArray);
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

  console.log('Starting calculation');

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
