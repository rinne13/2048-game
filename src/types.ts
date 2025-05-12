export type CellValue = number | null;

export type MoveResult = {
  newBoard: CellValue[];
  gainedScore: number;
};
