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

const handleBasinRow = (row, startColumn, stopColumn, coordinates, basins) => {

  const basinRowLength = stopColumn - startColumn;

  // check if there are any basins above this row
  const basinsAboveThisRow = [];

  if (row > 0) {

    for (let i = startColumn; i < stopColumn; i++) {

      const basinAbove = coordinates[row - 1][i];

      if (basinAbove > -1) {

        // there is a basin above connected to this row
        if (basinsAboveThisRow.indexOf(basinAbove) === -1) {

          // add this basin number if it isn't already in the array
          basinsAboveThisRow.push(basinAbove);
        }
      }
    }

    // if there are more than one basin above, they have to be merged, because this row connects them
    while (basinsAboveThisRow.length > 1) {

      // TODO: merge basins
      const basin1 = basinsAboveThisRow[0];
      const basin2 = basinsAboveThisRow[1];

      // add the size of basin 2 to basin 1
      basins[basin1] += basins[basin2];

      // set the size of basin 2 to 0
      basins[basin2] = 0;

      // change all markings for basin 2 in the basin coordinates
      // count down instead of up, because it must be found on the row above
      // stop when it isn't found on a row or all rows above have been traversed
      for (let ri = row - 1; ri >= 0; ri--) {

        let basin2FoundOnThisRow = false;

        for (let ci = 0; ci < coordinates[ri].length; ci++) {

          const basin = coordinates[ri][ci];

          if (basin === basin2) {

            basin2FoundOnThisRow = true;
            coordinates[ri][ci] = basin1;
          }
        }

        if (!basin2FoundOnThisRow) {
          break;
        }
      }

      // remove the basin that was just merged from the basins above array
      basinsAboveThisRow.splice(1, 1);
    }
  }

  // determine basin number
  let basinNumber;

  if (basinsAboveThisRow.length > 0) {

    // there is a basin above
    basinNumber = basinsAboveThisRow[0];

  } else {

    // start a new basin
    basinNumber = basins.length;

    // initialize the size of the basin
    basins[basinNumber] = 0;
  }

  // add this basin row to the size of current basin
  basins[basinNumber] += basinRowLength;

  // mark the coordinates for this basin row with current basin number
  for (let i = startColumn; i < stopColumn; i++) {

    // coordinates[row][i] = basinNumber;
    coordinates[row].push(basinNumber);
  }
};

const handleStringResult = (result) => {

  const mapLines = result.split('\n');

  // data structure for storing what basin a point on the map belongs to
  // -1 signifies the point is not part of a basin
  // higher integers corresponds to basins in the order they are detected
  const basinCoordinates = [];

  // array for storing the size of basins
  // basin number corresponds to index in the array
  const basins = [];

  for (let row = 0; row < mapLines.length; row++) {

    // variable for keeping track of basins in the current row
    let basinRowStart = null;

    // add a new empty row to the coordinate array
    basinCoordinates.push([]);

    for (let column = 0; column < mapLines[row].length; column++) {

      const currentHeigth = parseInt(mapLines[row].charAt(column));

      // this point is high ground, and can't be part of a basin
      if (currentHeigth === 9) {

        // check if a basin row ends here, and handle it if it does
        if (basinRowStart !== null) {

          handleBasinRow(row, basinRowStart, column, basinCoordinates, basins);
        }

        // add this point to the coordinate row
        basinCoordinates[row].push(-1);

        // prepare for a new basin row
        basinRowStart = null;

        // go to next point on the map
        continue;
      }

      // this point is in a basin. start a new basin row if there is't one already
      if (basinRowStart === null) {

        basinRowStart = column;
      }

      // end the basin row if this is the last entry in this row
      if (column === mapLines[row].length - 1 && basinRowStart !== null) {

        handleBasinRow(row, basinRowStart, column + 1, basinCoordinates, basins);
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
