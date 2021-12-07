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

const lines = [];
const coordinateSystem = {};

let highestX = Number.MIN_SAFE_INTEGER;
let lowestX = Number.MAX_SAFE_INTEGER;
let highestY = Number.MIN_SAFE_INTEGER;
let lowestY = Number.MAX_SAFE_INTEGER;

const updateCoordinateSystemLimits = (x1, y1, x2, y2) => {
  highestX = x1 > highestX ? x1 : highestX;
  lowestX = x1 < lowestX ? x1 : lowestX;

  highestY = y1 > highestY ? y1 : highestY;
  lowestY = y1 < lowestY ? y1 : lowestY;

  highestX = x2 > highestX ? x2 : highestX;
  lowestX = x2 < lowestX ? x2 : lowestX;

  highestY = y2 > highestY ? y2 : highestY;
  lowestY = y2 < lowestY ? y2 : lowestY;
};

const prepareLine = (line) => {

  const [point1, point2] = line.split(' -> ');

  let [x1, y1] = point1.split(',');
  let [x2, y2] = point2.split(',');

  x1 = parseInt(x1);
  y1 = parseInt(y1);

  x2 = parseInt(x2);
  y2 = parseInt(y2);

  updateCoordinateSystemLimits(x1, y1, x2, y2);

  lines.push({ x1, y1, x2, y2 });
};

const prepareData = (dataString) => {

  // prepare lines
  const rawLines = dataString.split('\n');

  for (let i = 0; i < rawLines.length; i++) {

    if (rawLines[i] === '') {
      continue;
    }

    prepareLine(rawLines[i]);
  }

  console.log('prepared lines:', lines.length);

  console.log(highestX, lowestX, highestY, lowestY);

  // prepare coordinate system
  for (let x = lowestX; x < highestX + 1; x++) {

    coordinateSystem[x] = {};

    for (let y = lowestY; y < highestY + 1; y++) {

      coordinateSystem[x][y] = 0;
    }
  }
};

const markPositions = (lines) => {

  for (const line of lines) {

    const { x1, y1, x2, y2 } = line;
    let xLength, yLength, length;
    let xIncrement, yIncrement;

    xLength = x2 - x1;
    yLength = y2 - y1;

    xIncrement = xLength === 0 ? 0 : xLength > 0 ? 1 : -1;
    yIncrement = yLength === 0 ? 0 : yLength > 0 ? 1 : -1;

    length = Math.max(Math.abs(xLength), Math.abs(yLength));

    let x = x1;
    let y = y1;

    for (let i = 0; i < length + 1; i++) {

      coordinateSystem[x][y]++;

      x += xIncrement;
      y += yIncrement;
    }
  }
};

const numberOfMarkedCoordinates = (level) => {

  let markedCoordinates = 0;

  for (let x = lowestX; x < highestX + 1; x++) {

    for (let y = lowestY; y < highestY + 1; y++) {

      if (coordinateSystem[x][y] >= level) {

        markedCoordinates++;
      }
    }
  }

  return markedCoordinates;
};

const handleStringResult = (result) => {

  prepareData(result);
  const filteredLines = lines.filter(line => {
    if (line.x1 === line.x2 || line.y1 === line.y2) {
      return true;
    }
  });

  console.log(filteredLines.length);

  // markPositions(filteredLines); // solution to part 1
  markPositions(lines); // solution to part 2

  console.log(numberOfMarkedCoordinates(2));
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
