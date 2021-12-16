const fs = require('fs/promises');

// const inputPromise = fs.readFile('./test-input.txt', 'utf-8');
const inputPromise = fs.readFile('./input.txt', 'utf-8');

const addLetterCounts = (main, supplier) => {

  for (const letter of Object.keys(supplier)) {

    if (!main[letter]) {

      main[letter] = 0;
    }

    main[letter] += supplier[letter];
  }
};

const parseInput = (input) => {

  const rawLines = input.split('\n');

  if (rawLines.length === 0) {

    console.log('Not enough lines in input data');
    return;
  }

  const polymerInfo = {
    template: rawLines[0],
    pairInsertions: {},
    subTreeInfo: []
  };

  for (let i = 1; i < rawLines.length; i++) {

    if (rawLines[i] === '') {

      // skip empty lines
      continue;
    }

    const [pair, letterToInsert] = rawLines[i].split(' -> ');

    if (pair && letterToInsert) {

      polymerInfo.pairInsertions[pair] = letterToInsert;

    } else {

      console.log('Incorrect input line:', rawLines[i]);
    }
  }

  return polymerInfo;
};

const calculateSubTrees = (node, levels, polymerInfo) => {

  if (levels < 0) {

    return;
  }

  if (!polymerInfo.subTreeInfo[levels]) {

    polymerInfo.subTreeInfo[levels] = {};
  }

  const combination = node.letter + node.rightSibling;

  if (!polymerInfo.subTreeInfo[levels][combination]) {

    const letterCount = {};

    if (levels === 0) {

      letterCount[node.letter] = 1;

    } else if (node.rightSibling === '') {

      calculateSubTrees(node, levels - 1, polymerInfo);

      addLetterCounts(letterCount, polymerInfo.subTreeInfo[levels - 1][combination]);

    } else {

      const newNodeOne = {
        letter: node.letter,
        rightSibling: polymerInfo.pairInsertions[combination]
      };

      const newNodeTwo = {
        letter: polymerInfo.pairInsertions[combination],
        rightSibling: node.rightSibling
      };

      calculateSubTrees(newNodeOne, levels - 1, polymerInfo);
      calculateSubTrees(newNodeTwo, levels - 1, polymerInfo);

      addLetterCounts(letterCount, polymerInfo.subTreeInfo[levels - 1][newNodeOne.letter + newNodeOne.rightSibling]);
      addLetterCounts(letterCount, polymerInfo.subTreeInfo[levels - 1][newNodeTwo.letter + newNodeTwo.rightSibling]);
    }

    polymerInfo.subTreeInfo[levels][combination] = letterCount;
  }
};

const buildTree = (polymerInfo, levels) => {

  const polymerTemplate = [];

  for (let i = 0; i < polymerInfo.template.length; i++) {

    const node = {
      letter: polymerInfo.template.charAt(i),
      rightSibling: polymerInfo.template.charAt(i + 1)
    };

    polymerTemplate.push(node);
  }

  polymerInfo.template = polymerTemplate;

  for (const node of polymerInfo.template) {

    calculateSubTrees(node, levels, polymerInfo);
  }
};

const handleStringResult = (result) => {

  const polymerInfo = parseInput(result);
  const levels = 40;

  buildTree(polymerInfo, levels);

  const letterCount = {};

  for (const node of polymerInfo.template) {

    addLetterCounts(letterCount, polymerInfo.subTreeInfo[levels][node.letter + node.rightSibling]);
  }

  console.log(letterCount);

  let maxCount = Number.MIN_SAFE_INTEGER;
  let minCount = Number.MAX_SAFE_INTEGER;

  for (const count of Object.values(letterCount)) {

    maxCount = count > maxCount ? count : maxCount;
    minCount = count < minCount ? count : minCount;
  }

  console.log('The answer is', maxCount - minCount);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
