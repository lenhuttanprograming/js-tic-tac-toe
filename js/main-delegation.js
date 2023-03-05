import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  checkGameStatus,
  resetCurrentTurn,
  showReplayButton,
  hideReplayButton,
  highlightCellWin,
} from "./utils.js";
import {
  getCurrentTurnElement,
  getCellElementList,
  getReplayButton,
  getGameStatusElement,
} from "./selectors.js";

//

/**
 * Global variables
 */
export let currentTurn = TURN.CROSS;
export let isGameEnded = false;
export let cellValues = new Array(9).fill("");

export function toggleCurrentTurn() {
  //update currentTurn
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  // apply DOM currentTurnElement
  const currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
  currentTurnElement.classList.add(currentTurn);
}

export function updateGameStatus(status) {
  const gameStatus = getGameStatusElement();
  if (!gameStatus) return;
  gameStatus.textContent = status;

  isGameEnded = status !== GAME_STATUS.PLAYING ? true : false;
}

function resetAllElements() {
  // reset temp variables
  currentTurn = TURN.CROSS;
  isGameEnded = false;
  cellValues = cellValues.map((x) => "");

  // reset DOM
  // reset current Turn
  resetCurrentTurn();

  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);

  // reset gameboard
  const elementList = getCellElementList();
  if (!elementList) return;

  for (let elelement of elementList) {
    elelement.className = "";
  }

  // hide button replay
  hideReplayButton();

  // location.reload();
}

function handleElementList(element, index) {
  // check if elelement is check or not
  const isClicked =
    element.classList.contains(TURN.CROSS) ||
    element.classList.contains(TURN.CIRCLE);
  if (isClicked || isGameEnded) return;

  // add class for element
  element.classList.add(currentTurn);

  // update currentTurn to cellValues
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  // check Game status
  const game = checkGameStatus(cellValues);

  console.log(game);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      //  update status
      console.log(game.status);
      updateGameStatus(game.status);
      showReplayButton();
      //  show replay btn
      break;
    }

    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      // update status
      updateGameStatus(game.status);
      // show replay btn
      showReplayButton();
      // highligt win cells
      highlightCellWin(game.winPositions);
      break;
    }
    default:
  }

  // toggle the current
  toggleCurrentTurn();

  // console.log(element, index);
}

function initReplayButton() {
  const replayButton = getReplayButton();
  if (replayButton) replayButton.addEventListener("click", resetAllElements);
}

function initCellElementList() {
  const elementList = getCellElementList();

  elementList.forEach((element, index) => {
    element.dataset.idx = index;
  });

  const ul = document.getElementById("cellList");

  if (!ul) return;
  ul.addEventListener("click", (event) => {
    if (event.target.tagName !== "LI") return;

    const index = event.target.dataset.idx;
    handleElementList(event.target, index);
  });
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

// console.log(getCellElementList());
// console.log(getCellElementAtIdx(4));
// console.log(getCurrentTurnElement());
// console.log(getGameStatusElement());

(() => {
  //bind click event for all element list
  initCellElementList();

  initReplayButton();

  //bind click event for replay button
})();
