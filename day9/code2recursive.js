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

const mapAndCalculateBasinSize = (row, column, mapLines, basinCoordinates, basinNumber) => {

  // check if row or column is out of range, then there is nothing to register for this point
  if (row < 0 || row >= mapLines.length || column < 0 || column >= mapLines[row].length) {

    return 0;
  }

  // check if this point has already been registered
  if (basinCoordinates[row][column] !== undefined) {

    // go to next point on the map
    return 0;
  }

  // this point has not been registered yet
  const currentHeigth = parseInt(mapLines[row].charAt(column));

  // if this point is high ground, it can't be part of a basin
  if (currentHeigth === 9) {

    // register this point in the basin coordinates
    basinCoordinates[row][column] = -1;

    // go to next point on the map
    return 0;
  }

  // this point belongs to a basin and needs to be registered
  basinCoordinates[row][column] = basinNumber;

  // this point increases the size of the basin by 1
  let size = 1;

  // try to expand basin in all four direction
  size += mapAndCalculateBasinSize(row - 1, column, mapLines, basinCoordinates, basinNumber);
  size += mapAndCalculateBasinSize(row + 1, column, mapLines, basinCoordinates, basinNumber);
  size += mapAndCalculateBasinSize(row, column - 1, mapLines, basinCoordinates, basinNumber);
  size += mapAndCalculateBasinSize(row, column + 1, mapLines, basinCoordinates, basinNumber);


  // return the recursive sum of all points in this basin
  return size;
};

const handleStringResult = (result) => {

  const mapLines = result.split('\n');

  // data structure for storing what basin a point on the map belongs to
  // -1 signifies the point is not part of a basin
  // higher integers corresponds to basins in the order they are detected
  const basinCoordinates = [];
  for (let i = 0; i < mapLines.length; i++) {
    basinCoordinates.push([]);
  }

  // array for storing the size of basins
  // basin number corresponds to index in the array
  const basins = [];
  let basinNumber = 0;

  for (let row = 0; row < mapLines.length; row++) {

    for (let column = 0; column < mapLines[row].length; column++) {

      const basinSize = mapAndCalculateBasinSize(row, column, mapLines, basinCoordinates, basinNumber);

      if (basinSize > 0) {

        basins[basinNumber] = basinSize;
        basinNumber++;
      }
    }
  }

  // make a map of the basins to easier find problems in the algorithm
  let output = '';

  for (let row = 0; row < mapLines.length; row++) {

    let rowString = '';

    for (let column = 0; column < mapLines[row].length; column++) {

      const basin = basinCoordinates[row][column];

      rowString += basin < 0 ? '   ' : new String(basin).padStart(3);
    }

    output += rowString + '\n';
  }

  fs.writeFile('output.txt', output);

  // sort basins in descending order
  basins.sort((first, second) => {
    return first === second ? 0 : first < second ? 1 : -1;
  });

  console.log('Answer:', basins[0] * basins[1] * basins[2]);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
