import type { CellValue } from "../types";

const gridSize = 4;

export const addRandomTile = (board: CellValue[]): CellValue[] => {
  const emptyIndexes = board
    .map((value, index) => (value === null ? index : null))
    .filter((v): v is number => v !== null);

  if (emptyIndexes.length === 0) return board;

  const randomIndex =
    emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  const newTile = Math.random() < 0.9 ? 2 : 4;

  const newBoard = [...board];
  newBoard[randomIndex] = newTile;

  return newBoard;
};

export const hasAvailableMoves = (board: CellValue[]): boolean => {
  if (board.includes(null)) return true;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const index = row * gridSize + col;
      const current = board[index];

      if (col < gridSize - 1 && current === board[index + 1]) return true;
      if (row < gridSize - 1 && current === board[index + gridSize])
        return true;
    }
  }

  return false;
};

export const createInitialBoard = (): CellValue[] => {
  let board: CellValue[] = Array(gridSize * gridSize).fill(null);
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};
