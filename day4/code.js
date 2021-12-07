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

const getBoards = (rows) => {

  const boards = [];
  let currentBoard = [];

  for (let i = 2; i < rows.length; i++) {

    const row = rows[i];

    if (row === '') {
      boards.push(currentBoard);
      currentBoard = [];
    } else {
      const rawNumbers = row.split(' ');
      const numbers = [];

      for (let j = 0; j < rawNumbers.length; j++) {

        const number = rawNumbers[j];

        if (number !== '') {
          const entry = {
            number,
            marked: false
          };

          numbers.push(entry);
        }
      }
      currentBoard.push(numbers);
    }
  }

  return boards;
};

const markBoards = (boards, number) => {
  for (let i = 0; i < boards.length; i++) {
    for (let j = 0; j < boards[i].length; j++) {
      for (let k = 0; k < boards[i][j].length; k++) {
        if (boards[i][j][k].number === number) {
          boards[i][j][k].marked = true;
        }
      }
    }
  }
};

const checkBoards = (boards) => {
  const finishedBoards = [];

  // check all boards
  for (let i = 0; i < boards.length; i++) {

    // check all rows
    let rowFound = false;

    for (let j = 0; j < boards[i].length; j++) {

      let rowMarked = true;

      for (let k = 0; k < boards[i][j].length; k++) {
        if (!boards[i][j][k].marked) {
          rowMarked = false;
          break;
        }
      }

      if (rowMarked) {
        rowFound = true;
        break;
      }
    }

    if (rowFound) {
      finishedBoards.push(boards[i]);
      // continue;
    }

    // check all columns
    const board = boards[i];

    let columnFound = false;

    // iterate over columns
    for (let c = 0; c < board[0].length; c++) {

      let columnMarked = true;

      // iterate over rows
      for (let r = 0; r < board.length; r++) {
        if (!board[r][c].marked) {
          columnMarked = false;
          break;
        }
      }

      if (columnMarked) {
        columnFound = true;
        break;
      }
    }

    if (columnFound) {
      finishedBoards.push(boards[i]);
      continue;
    }
  }

  return finishedBoards;
};

const calculateSumOfUnmarkedNumbers = (board) => {

  let sum = 0;

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c].marked) {
        sum += parseInt(board[r][c].number);
      }
    }
  }

  return sum;
};

const handleStringResult = (result) => {

  const rows = result.split('\n');
  const numbers = rows[0].split(',');
  const boards = getBoards(rows);

  let finishedBoards = [];
  let winningNumber;

  for (let i = 0; i < numbers.length; i++) {
    markBoards(boards, numbers[i]);
    finishedBoards = checkBoards(boards);

    if (finishedBoards.length > 0) {
      console.log('Bingo!', i, numbers[i]);
      winningNumber = numbers[i];
      break;
    }
  }

  const winningBoard = finishedBoards[0];
  const sum = calculateSumOfUnmarkedNumbers(winningBoard);
  console.log(winningBoard);
  console.log(sum, winningNumber);
  console.log(sum * parseInt(winningNumber));

  // console.log(numbers.length);
  // console.log(finishedBoards.length);
  // console.log(boards.length);
};

inputPromise
  .then(result => {
    handleStringResult(result);
  })
  .catch(error => {
    console.log(error);
  });
