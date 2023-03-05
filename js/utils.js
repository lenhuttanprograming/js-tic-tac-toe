import { GAME_STATUS, CELL_VALUE, TURN } from "./constants.js";
import {
  getReplayButton,
  getCurrentTurnElement,
  getCellElementAtIdx,
} from "./selectors.js";

import { toggleCurrentTurn, updateGameStatus } from "./main.js";

// Write a function to check status of tic-tac-toe game
// Ref: what is tic-tac-toe game: https://en.wikipedia.org/wiki/Tic-tac-toe
// In summary, tic-tac-toe game has 9 cells divided into 3 rows of 3 cells.
// Each cell can have 3 values: either X, O or empty.
// We say X is win if there are 3 'X' in either horizontal, vertical or diagonal row.
// The same to O.
// If 9 cells is full of values but no one win, then the game is ended.
//
// Given an array of 9 items: [a0, a1, ..., a7, a8] represent for the tic-tac-toe game cells value:
// |  a0  | a1  | a2  |
// |  a3  | a4  | a5  |
// |  a6  | a7  | a8  |
// Each item will receive either of 3 values: empty, X or O.
// Return an object includes two keys:
// - `status`: a string indicate status of the game. It can be one of the following values:
//    - 'X': if X is win
//    - `O`: if O is win
//    - 'END': if game is ended and no one win
//    - 'PLAYING': if no one is win and game is not ended yet.
//
// - `winPositions`:
//    - If X or O is win, return indexes of the 3 winning marks(X/O).
//    - Return empty array.
//
// Example:
// Input array: cellValues = ['X', 'O', 'O', '', 'X', '', '', 'O', 'X']; represent for
// |  X  | O  | O  |
// |     | X  |    |
// |     | O  | X  |
// -----
// ANSWER:
// {
//    status: 'X',
//    winPositions: [0, 4, 8],
// }
//

const WIN_INDEX = ["012", "345", "678", "048", "246", "036", "147", "258"];

function getAllPositionStatus(cellValues, sign) {
  const indexSign = [];
  cellValues.forEach((x, index) => {
    if (x === sign) indexSign.push(index);
  });
  return indexSign;
}

// Input: an array of 9 items
// Output: an object as mentioned above
function checkGameStatusV1(cellValues) {
  // Write your code here ...
  // Please feel free to add more helper function if you want.
  // It's not required to write everything just in this function.
  const XIndex = getAllPositionStatus(cellValues, "X").join("");
  const OIndex = getAllPositionStatus(cellValues, "O").join("");
  let winPositions = [];
  let status = "";

  for (let element of WIN_INDEX) {
    if (XIndex.includes(element)) {
      winPositions = element.split("");
      status = "X";
    } else if (OIndex.includes(element)) {
      winPositions = element.split("");
      status = "O";
    }
  }

  if (status === "" && cellValues.join("").length < 9) status = "PLAYING";
  if (status === "" && cellValues.join("").length === 9) status = "END";
  winPositions = winPositions.map((x) => Number(x));

  return {
    status, //GAME_STATUS.PLAYING,
    winPositions, //[],
  };
}

export function checkGameStatus(callValues) {
  const setList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const winSetIndex = setList.findIndex((set) => {
    const first = callValues[set[0]];
    const second = callValues[set[1]];
    const third = callValues[set[2]];

    return first !== "" && second === first && second === third;
  });

  if (winSetIndex >= 0) {
    return {
      status:
        callValues[setList[winSetIndex][0]] === CELL_VALUE.CIRCLE
          ? GAME_STATUS.O_WIN
          : GAME_STATUS.X_WIN,
      winPositions: setList[winSetIndex],
    };
  }

  const isEndGame = callValues.filter((x) => x === "").length === 0;

  return {
    status: isEndGame ? GAME_STATUS.ENDED : GAME_STATUS.PLAYING,
    winPositions: [],
  };
}

export function resetCurrentTurn() {
  const currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
  currentTurnElement.classList.add(TURN.CROSS);
}

export function showReplayButton() {
  const replayButton = getReplayButton();
  if (replayButton) replayButton.classList.add("show");
}

export function hideReplayButton() {
  const replayButton = getReplayButton();
  if (replayButton) replayButton.classList.remove("show");
}

export function highlightCellWin(winPositions) {
  for (let index of winPositions) {
    const cellWin = getCellElementAtIdx(index);
    if (!cellWin) return;
    cellWin.classList.add("win");
  }
}
// console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", "X"]));
// console.log(checkGameStatus(["O", "O", "O", "", "X", "", "", "O", "X"]));
// console.log(checkGameStatus(["O", "X", "O", "O", "X", "O", "", "O", "X"]));
// console.log(checkGameStatus(["O", "X", "O", "O", "X", "O", "X", "O", "X"]));
