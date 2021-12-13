const fs = require('fs/promises');
const { start } = require('repl');

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

const parseDotCoordinates = (coordinateArray, dotArray) => {

  const dot = {
    x: parseInt(coordinateArray[0]),
    y: parseInt(coordinateArray[1])
  };

  dotArray.push(dot);
};

const parseInstruction = (instruction, instructionArray) => {

  // skip empty lines
  if (instruction === '') {

    return;
  }

  const instructionObject = {};

  let tempArray = instruction.split('fold along ');

  if (tempArray.length !== 2 || tempArray[0] !== '') {

    console.log('Incorrect input format:', instruction);

    return;
  }

  tempArray = tempArray[1].split('=');

  if (tempArray.length !== 2 || !(tempArray[0] === 'x' || tempArray[0] === 'y')) {

    console.log('Incorrect input format:', instruction);

    return;
  }

  instructionObject.direction = tempArray[0];
  instructionObject.position = parseInt(tempArray[1]);

  instructionArray.push(instructionObject);
};

const mapDots = (dots) => {

  const map = [];
  let maxX = 0;
  let maxY = 0;

  dots.forEach(dot => {

    const { x, y } = dot;

    maxX = x > maxX ? x : maxX;
    maxY = y > maxY ? y : maxY;

    if (!map[y]) {
      map[y] = [];
    }

    map[y][x] = true;
  });

  return { map, maxX, maxY };
};

const parseInput = (input) => {

  const rawLines = input.split('\n');
  const dots = [];
  const instructions = [];

  for (let i = 0; i < rawLines.length; i++) {

    const splitLine = rawLines[i].split(',');

    // split line will have different lengths depending on its content
    switch (splitLine.length) {

      // dot coordinates will have length of 2
      case 2:
        parseDotCoordinates(splitLine, dots);
        break;

      // instructions will have a length of 1
      case 1:
        parseInstruction(splitLine[0], instructions);
        break;

      // this should never happen
      default:
        console.log('Incorrect input data:', rawLines[i]);
    }
  }

  return [mapDots(dots), instructions];
};

const printDots = (mapInfo) => {

  const { map, maxX, maxY } = mapInfo;
  let mapString = '';

  for (let row = 0; row <= maxY; row++) {

    if (!map[row]) {

      map[row] = [];
    }

    for (let column = 0; column <= maxX; column++) {

      if (map[row][column]) {

        mapString += '#';

      } else {

        mapString += '.';
      }
    }

    mapString += '\n';
  }

  console.log(mapString);
};

const fold = (dotMapInfo, instructions) => {

  const { map, maxX, maxY } = dotMapInfo;

  for (let i = 0; i < instructions.length; i++) {

    const { direction, position } = instructions[i];

    if (direction === 'y') {

      // check that the folding line is empty
      if (map[position] !== undefined && map[position].length > 0) {

        console.log('Folding line y =', position, 'not empty:', map[position]);

        return;
      }

      // ok to fold
      delete map[position];

      let rowOffset = 1;

      while (position + rowOffset <= maxY) {

        // check that there is a row in this position
        if (map[position + rowOffset]) {

          // make sure that there is a row to transfer this row to
          if (!map[position - rowOffset]) {

            map[position - rowOffset] = [];
          }

          // transfer the row
          for (let column = 0; column <= maxX; column++) {

            if (map[position + rowOffset][column]) {

              map[position - rowOffset][column] = true;
            }
          }
        }

        // delete row
        delete map[position + rowOffset];

        rowOffset++;
      }

      // update the size of the map
      dotMapInfo.maxY = position - 1;
    }

    if (direction === 'x') {

      for (let row = 0; row <= maxY; row++) {

        // check if there is anything on this row
        if (map[row] && map[row].length > 0) {

          // check that the folding point is empty
          if (map[row] && map[row][position]) {

            console.log('Folding line x =', position, 'not empty on row', row);

            return;
          }

          // ok to fold
          let columnOffset = 1;

          while (position + columnOffset <= maxX) {

            if (map[row][position + columnOffset]) {

              // transfer dot
              map[row][position - columnOffset] = true;

              // delete old dot
              delete map[row][position + columnOffset];
            }

            columnOffset++;
          }
        }
      }

      // update the size of the map
      dotMapInfo.maxX = position - 1;
    }

  }
};

const countDots = (dotMapInfo) => {

  const { map, maxX, maxY } = dotMapInfo;

  let numberOfDots = 0;

  for (let row = 0; row <= maxY; row++) {

    if (!map[row]) {

      continue;
    }

    for (let column = 0; column <= maxX; column++) {

      if (map[row][column]) {

        numberOfDots++;
      }
    }
  }

  return numberOfDots;
};

const handleStringResult = (result) => {

  const [dotMapInfo, instructions] = parseInput(result);

  console.log(dotMapInfo.maxX, dotMapInfo.maxY);
  console.log(instructions);

  fold(dotMapInfo, instructions);

  console.log('Number of dots:', countDots(dotMapInfo));
  printDots(dotMapInfo);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
