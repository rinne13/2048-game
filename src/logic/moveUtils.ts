import type { CellValue, MoveResult } from "../types.ts";
const gridSize = 4;

export const mergeRow = (
  row: CellValue[]
): { mergedRow: CellValue[]; score: number } => {
  const filtered = row.filter((cell): cell is number => cell !== null);
  const merged: CellValue[] = [];
  let score = 0;
  let skip = false;

  for (let i = 0; i < filtered.length; i++) {
    if (skip) {
      skip = false;
      continue;
    }

    if (filtered[i] === filtered[i + 1]) {
      const value = filtered[i] * 2;
      merged.push(value);
      score += value;
      skip = true;
    } else {
      merged.push(filtered[i]);
    }
  }

  while (merged.length < gridSize) {
    merged.push(null);
  }

  return { mergedRow: merged, score };
};

export const processRows = (
  board: CellValue[],
  reverse: boolean
): MoveResult => {
  const newBoard: CellValue[] = [];
  let gainedScore = 0;

  for (let row = 0; row < gridSize; row++) {
    const rowStart = row * gridSize;
    const currentRow = board.slice(rowStart, rowStart + gridSize);
    const rowToProcess = reverse ? currentRow.reverse() : currentRow;

    const { mergedRow, score } = mergeRow(rowToProcess);
    gainedScore += score;

    newBoard.push(...(reverse ? mergedRow.reverse() : mergedRow));
  }

  return { newBoard, gainedScore };
};

export const processColumns = (
  board: CellValue[],
  reverse: boolean
): MoveResult => {
  const newBoard = [...board];
  let gainedScore = 0;

  for (let col = 0; col < gridSize; col++) {
    const column: CellValue[] = [];

    for (let row = 0; row < gridSize; row++) {
      const index = reverse
        ? (gridSize - 1 - row) * gridSize + col
        : row * gridSize + col;
      column.push(board[index]);
    }

    const { mergedRow, score } = mergeRow(column);
    gainedScore += score;

    const processedColumn = reverse ? mergedRow.reverse() : mergedRow;

    for (let row = 0; row < gridSize; row++) {
      newBoard[row * gridSize + col] = processedColumn[row];
    }
  }

  return { newBoard, gainedScore };
};
