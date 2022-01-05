const fs = require('fs/promises');

const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
// const inputPromise = fs.readFile('./input.txt', 'utf-8');

const getScanners = (input) => {

  const inputRows = input.split('\n');
  const scanners = [];

  let scanner;
  let scannerIndex = 0;

  for (let i = 0; i < inputRows.length; i++) {

    const row = inputRows[i];

    // this is the start of a new scanner input
    if (row.slice(0, 3) === '---') {

      // create a new scanner
      scanner = [];
      scanner.translations = [];
      scanner.index = scannerIndex;
      continue;
    }

    // there is always an empty row after a scanner
    if (row === '') {

      // add the current scanner to the array of scanners
      scanners.push(scanner);
      scannerIndex++;
      continue;
    }

    // parse coordinates
    const raw = row.split(',').map(coordinate => {

      return Number.parseInt(coordinate);
    });

    // add a beacon object to the current scanner
    scanner.push({ raw });
  }

  return scanners;
};

const modifyBeacons = (scanner) => {

  // add relative positions for all beacons, and a magnitude to easily compare distances
  for (let i = 0; i < scanner.length; i++) {

    const beaconOne = scanner[i];
    const relativePositions = [];

    for (let j = 0; j < scanner.length; j++) {

      // no need to add a relative distance to itself
      if (i === j) {

        continue;
      }

      const beaconTwo = scanner[j];

      const x = beaconOne.raw[0] - beaconTwo.raw[0];
      const y = beaconOne.raw[1] - beaconTwo.raw[1];
      const z = beaconOne.raw[2] - beaconTwo.raw[2];
      const magnitude = Math.abs(x) + Math.abs(y) + Math.abs(z);

      const relativePosition = { x, y, z, magnitude };

      relativePositions.push(relativePosition);
    }

    // sort relative distances in ascending order
    relativePositions.sort((firstPosition, secondPosition) => {

      if (firstPosition.magnitude > secondPosition.magnitude) {

        return 1;
      }

      if (firstPosition.magnitude < secondPosition.magnitude) {

        return -1;

      } else {

        return 0;
      }
    });

    beaconOne.relativePositions = relativePositions;
  }
};

const findCorrespondingDirections = (positionOne, positionTwo) => {

  const findDirection = (valueOfDirectionTested) => {

    if (valueOfDirectionTested === positionTwo.x) {
      return 'x';
    } else if (valueOfDirectionTested === -positionTwo.x) {
      return '-x';
    } else if (valueOfDirectionTested === positionTwo.y) {
      return 'y';
    } else if (valueOfDirectionTested === -positionTwo.y) {
      return '-y';
    } else if (valueOfDirectionTested === positionTwo.z) {
      return 'z';
    } else if (valueOfDirectionTested === -positionTwo.z) {
      return '-z';
    }
  };

  const x = findDirection(positionOne.x);
  const y = findDirection(positionOne.y);
  const z = findDirection(positionOne.z);

  const result = { x, y, z };

  if (x && y && z) {

    result.isEqual = true;
  }

  // TODO: add offset in the different direction
  // TODO: check for equal magnitudes in different directions

  return result;
};

const addTransformationInfo = (directionArray, transformation) => {

  switch (transformation) {
    case 'x':
      directionArray[0]++;
      break;
    case '-x':
      directionArray[1]++;
      break;
    case 'y':
      directionArray[2]++;
      break;
    case '-y':
      directionArray[3]++;
      break;
    case 'z':
      directionArray[4]++;
      break;
    case '-z':
      directionArray[5]++;
      break;
    default:
      console.log('Unknown transformation:', transformation);
  }
};

const findDominantTransformation = (directionArray) => {

  let index;
  let highestNumber = 0;

  for (let i = 0; i < 6; i++) {

    if (directionArray[i] > highestNumber) {
      index = i;
      highestNumber = directionArray[i];
    }
  }

  switch (index) {
    case 0:
      return 'x';
    case 1:
      return '-x';
    case 2:
      return 'y';
    case 3:
      return '-y';
    case 4:
      return 'z';
    case 5:
      return '-z';
    default:
      console.log('Index out of bounds:', index);
  }
};

const mergeTransformations = (transformations) => {

  const transformationInfo = {
    x: [0, 0, 0, 0, 0, 0],
    y: [0, 0, 0, 0, 0, 0],
    z: [0, 0, 0, 0, 0, 0]
  };

  let x, y, z;

  for (const transformation of transformations) {

    addTransformationInfo(transformationInfo.x, transformation.x);
    addTransformationInfo(transformationInfo.y, transformation.y);
    addTransformationInfo(transformationInfo.z, transformation.z);
  }

  x = findDominantTransformation(transformationInfo.x);
  y = findDominantTransformation(transformationInfo.y);
  z = findDominantTransformation(transformationInfo.z);

  return { x, y, z };
};

const transformCoordinates = (coordinates, transformation) => {

  const findTransformation = (transformationCode) => {

    switch (transformationCode) {
      case 'x':
        return coordinates[0];
      case '-x':
        return -coordinates[0];
      case 'y':
        return coordinates[1];
      case '-y':
        return -coordinates[1];
      case 'z':
        return coordinates[2];
      case '-z':
        return -coordinates[2];
      default:
        console.log('Unknown direction:', transformationCode);
    }
  };

  const transformedCoordinates = [];

  transformedCoordinates[0] = findTransformation(transformation.x);
  transformedCoordinates[1] = findTransformation(transformation.y);
  transformedCoordinates[2] = findTransformation(transformation.z);

  return transformedCoordinates;
};

const compareBeacons = (scannerOne, scannerTwo) => {

  // find beacons that may be the same
  let overlapConfirmed = false;

  // loop through beacons of scanner one
  for (let i = 0; i < scannerOne.length; i++) {

    if (overlapConfirmed) {

      break;
    }

    const beaconOne = scannerOne[i];

    // loop through beacons of scanner two
    for (let j = 0; j < scannerTwo.length; j++) {

      const beaconTwo = scannerTwo[j];

      // array to keep track of possible transformations between the scanners
      let potentialTransformations = [];

      // compare the relative positions to other beacons for those two beacons
      let equalMagnitudes = 0;
      let startIndexInBeaconTwoRelativePositions = 0;

      // loop through relative positions of beacon one
      for (let k = 0; k < beaconOne.relativePositions.length; k++) {

        const positionOne = beaconOne.relativePositions[k];

        // loop through relative positions of beacon two, starting from a meaningful index
        for (let l = startIndexInBeaconTwoRelativePositions; l < beaconTwo.relativePositions.length; l++) {

          const positionTwo = beaconTwo.relativePositions[l];

          // update position to start comparing from in beacon two
          if (positionOne.magnitude > positionTwo.magnitude) {

            startIndexInBeaconTwoRelativePositions = l + 1;
            continue;
          }

          // equal magnitude means that this is a potential match
          if (positionOne.magnitude === positionTwo.magnitude) {

            const transformation = findCorrespondingDirections(positionOne, positionTwo);

            if (transformation.isEqual) {

              // add transformation data for these two positions
              potentialTransformations.push(transformation);

              // add 1 to equalMagnitudes and skip the rest of the comparisons for this position
              equalMagnitudes++;
              break;
            }

            continue;
          }

          // because the relative positions are sorted on ascending magnitude
          // there is no need to compare the rest of the positions relative to the second beacon
          // once the magnitude of position two is greater than the magnitude of the
          // position that is currently being tested (position one)
          if (positionOne.magnitude < positionTwo.magnitude) {

            break;
          }
        }
      }

      // those two beacons may be the same/those two scanners may overlap
      if (equalMagnitudes >= 11) {

        // compare beacons in depth, and find transformation data for the second scanner
        // TODO: check if this is a true overlap, and extract transformation info
        const transformation = mergeTransformations(potentialTransformations);
        const beaconTwoAligned = transformCoordinates(beaconTwo.raw, transformation);
        const scannerTwoPosition = [
          beaconOne.raw[0] - beaconTwoAligned[0],
          beaconOne.raw[1] - beaconTwoAligned[1],
          beaconOne.raw[2] - beaconTwoAligned[2]
        ];

        scannerTwo.translations[scannerOne.index] = {
          transformation,
          translation: scannerTwoPosition
        };

        // console.log(transformation);
        // console.log('Beacon One:', beaconOne.raw, 'Beacon Two:', beaconTwo.raw);
        // console.log('Beacon Two aligned:', beaconTwoAligned, 'Scanner Two position:', scannerTwoPosition);
        // console.log(scannerOne.translations);
        // console.log(scannerTwo.translations);

        // TODO: check!
        overlapConfirmed = true;
        break;
      }
    }
  }
};

const handleStringResult = (result) => {

  const scanners = getScanners(result);

  for (let i = 0; i < scanners.length; i++) {

    const scanner = scanners[i];

    modifyBeacons(scanner);

  }

  // compareBeacons(scanners[0], scanners[1]);

  // compare beacons from different scanners
  for (let i = 0; i < scanners.length; i++) {

    const scannerOne = scanners[i];

    for (let j = 0; j < scanners.length; j++) {

      // no need to compare beacons from the same scanner
      if (i === j) {

        continue;
      }

      const scannerTwo = scanners[j];

      console.log('Compare beacons from scanners', i, 'and', j);
      compareBeacons(scannerOne, scannerTwo);

    }

    console.log(scannerOne.translations);
  }
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
