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

const createRiskLevelMaps = (input) => {

  const riskRows = input.split('\n');
  const mapTiles = [];

  // prepare map tiles array
  for (let i = 0; i < 9; i++) {

    mapTiles.push([]);
  }

  // parse data row
  for (let row = 0; row < riskRows.length; row++) {

    const riskRow = riskRows[row];

    // skip empty lines
    if (riskRow === '') {

      continue;
    }

    // add new row to all map tiles
    for (let i = 0; i < 9; i++) {

      mapTiles[i].push([]);
    }

    // parse data column
    for (let column = 0; column < riskRow.length; column++) {

      const risk = parseInt(riskRow.charAt(column));

      // calculate modified risk for all 9 different tiles
      for (let i = 0; i < 9; i++) {

        let modifiedRisk = risk + i;

        if (modifiedRisk > 9) {

          modifiedRisk -= 9;
        }

        mapTiles[i][row][column] = modifiedRisk;
      }
    }
  }

  // expand risk level map
  const numberOfRowsPerTile = mapTiles[0].length;
  const maxIntArray = [];

  for (let column = 0; column < riskRows[0].length; column++) {

    maxIntArray[column] = Number.MAX_SAFE_INTEGER;
  }

  // build rows
  for (let row = 0; row < numberOfRowsPerTile; row++) {

    // build rows based on tile position
    for (let offset = 0; offset < 5; offset++) {

      const rowOffset = offset * numberOfRowsPerTile + row;
      const tileOffset = offset;

      riskLevelMap[rowOffset] = mapTiles[tileOffset + 0][row].concat(
        mapTiles[tileOffset + 1][row],
        mapTiles[tileOffset + 2][row],
        mapTiles[tileOffset + 3][row],
        mapTiles[tileOffset + 4][row]
      );

      // lowestRiskMap[rowOffset] = maxIntArray.concat(maxIntArray, maxIntArray, maxIntArray, maxIntArray);
    }
  }

  // initiate lowest risk map
  let startRisk = 0;

  for (let row = 0; row < riskLevelMap.length; row++) {

    let risk = startRisk;

    lowestRiskMap[row] = [];

    for (let column = 0; column < riskLevelMap[row].length; column++) {

      risk += riskLevelMap[row][column];
      lowestRiskMap[row][column] = Number.MAX_SAFE_INTEGER;
      // lowestRiskMap[row][column] = risk;
    }

    // console.log(lowestRiskMap[row]);
    startRisk += riskLevelMap[row][0];
  }

  // save maps
  let riskLevelMapString = '';
  let lowestRiskMapString = '';

  for (let row = 0; row < riskLevelMap.length; row++) {

    riskLevelMapString += riskLevelMap[row].join('') + '\n';
    lowestRiskMapString += lowestRiskMap[row].join(',') + '\n';
  }

  fs.writeFile('riskLevel.txt', riskLevelMapString);
  fs.writeFile('lowestRisk.txt', lowestRiskMapString);
};

const handleStringResult = (result) => {

  const startTime = Date.now();

  createRiskLevelMaps(result);

  console.log('Maps created');

  const stopTime = Date.now();

  const seconds = (stopTime - startTime) / 1000;

  console.log('Time to create maps:', seconds)
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
