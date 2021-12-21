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

const parsePacket = (binaryString, position) => {

  const version = Number.parseInt(binaryString.slice(position, position + 3), 2);
  const typeID = Number.parseInt(binaryString.slice(position + 3, position + 6), 2);

  let sumOfVersionNumbers = version;

  console.log(version, typeID, binaryString.slice(position, position + 6));

  position += 6;

  if (position > binaryString.length) {

    console.log('Position exceeds the length of the string. Reached the end!');
    return 0;
  }

  if (typeID === 4) {

    // parse binary number

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

  } else {

    // parse operator
    console.log('Parse operator');

    const lengthType = binaryString.charAt(position);

    if (lengthType === '0') {

      // length type is number of bits
      const numberOfBits = Number.parseInt(binaryString.slice(position + 1, position + 16), 2);
      console.log('Number of bits in the rest of this packet:', numberOfBits);

      position += 16;

      sumOfVersionNumbers += parsePacket(binaryString.slice(position, position + numberOfBits), 0);

      position += numberOfBits;

    } else {

      // length type is number of sub-packets
      const numberOfSubPackets = Number.parseInt(binaryString.slice(position + 1, position + 12), 2);
      console.log('Number of sub-packets in this packet:', numberOfSubPackets);

      position += 12;
    }
  }

  if (position < binaryString.length) {

    console.log('Parse another packet', position, binaryString.length);
    sumOfVersionNumbers += parsePacket(binaryString, position);

  } else {

    console.log('Reached the end of (sub-)string');
  }

  return sumOfVersionNumbers;
};

const handleStringResult = (result) => {

  const binaryString = convertToBinary(result);

  const sumOfVersionNumbers = parsePacket(binaryString, 0);

  console.log('The sum of version numbers is', sumOfVersionNumbers);

};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
