const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const convertToBinary = (input) => {

  let binaryString = '';

  for (let i = 0; i < input.length; i++) {

    const char = input.charAt(i);

    let hex = Number.parseInt(char, 16);
    let binary = hex.toString(2).padStart(4, '0');

    binaryString += binary;
  }

  return binaryString;
};

const parseBinaryNumber = (binaryString, position) => {

  let label = binaryString.charAt(position);
  let binaryNumberString = binaryString.slice(position + 1, position + 5);

  while (label !== '0') {

    position += 5;
    label = binaryString.charAt(position);
    binaryNumberString += binaryString.slice(position + 1, position + 5);
  }

  const binaryNumber = Number.parseInt(binaryNumberString, 2);
  console.log('Parse binary number:', binaryNumber);

  position += 5;

  return { value: binaryNumber, position };
};

const parseOperator = (binaryString, position) => {

  const lengthType = binaryString.charAt(position);

  let result;
  let values = [];

  if (lengthType === '0') {

    // length type is number of bits
    const numberOfBits = Number.parseInt(binaryString.slice(position + 1, position + 16), 2);

    console.log('Number of bits in the rest of this packet:', numberOfBits);

    position += 16;

    const stopPosition = position + numberOfBits;

    while (position < stopPosition) {

      result = parsePacket(binaryString, position);
      values.push(result.value);
      position = result.position;
    }

    console.log(values, position);

    return {values, position: stopPosition};

  } else {

    // length type is number of sub-packets
    const numberOfSubPackets = Number.parseInt(binaryString.slice(position + 1, position + 12), 2);

    console.log('Number of sub-packets in this packet:', numberOfSubPackets);

    position += 12;

    for (let i = 0; i < numberOfSubPackets; i++) {

      result = parsePacket(binaryString, position);

      values.push(result.value);
      position = result.position;
    }

    console.log(values, position);

    return { values, position };
  }
};

const evaluate = (typeID, values) => {

  let value;

  switch (typeID) {
    case 0:
      // add
      value = 0;
      for (let i = 0; i < values.length; i++) {
        value += values[i];
      }
      return value;
    case 1:
      // multiply
      value = 1;
      for (let i = 0; i < values.length; i++) {
        value *= values[i];
      }
      return value;
    case 2:
      // minimum
      return Math.min(...values);
    case 3:
      // maximum
      return Math.max(...values);
    case 5:
      // greater than
      return values[0] > values[1] ? 1 : 0;
    case 6:
      // less than
      return values[0] < values[1] ? 1 : 0;
    case 7:
      // equals
      return values[0] === values[1] ? 1 : 0;
    default:
      console.log('Unknown type ID:', typeID);
      return value;
    }
};

const parsePacket = (binaryString, position) => {

  const typeID = Number.parseInt(binaryString.slice(position + 3, position + 6), 2);
  let result;

  console.log('parse packet, position:', position, 'type', typeID);

  position += 6;

  if (typeID === 4) {

    result = parseBinaryNumber(binaryString, position);

  } else {

    result = parseOperator(binaryString, position);

    result = {
      value: evaluate(typeID, result.values),
      position: result.position
    };
  }

  console.log('Position:', position, 'type:', typeID, result);

  return result;
};

const handleStringResult = (result) => {

  const binaryString = convertToBinary(result);

  const parsingResult = parsePacket(binaryString, 0);

  console.log('Length of binary input:', binaryString.length);

  console.log('The result is', parsingResult.value);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
