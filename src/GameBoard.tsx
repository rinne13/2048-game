import { useState, useEffect } from "react";
import "./style.scss";

type CellValue = number | null;
type MoveResult = {
    newBoard: CellValue[];
    gainedScore: number;
};

const gridSize = 4;

const GameBoard = () => {
    const [board, setBoard] = useState<CellValue[]>(Array(gridSize * gridSize).fill(null));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const hasAvailableMoves = (board: CellValue[]): boolean => {
        if (board.includes(null)) return true;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const index = row * gridSize + col;
                const current = board[index];

                if (col < gridSize - 1) {
                    const right = board[index + 1];
                    if (current === right) return true;
                }

                if (row < gridSize - 1) {
                    const below = board[index + gridSize];
                    if (current === below) return true;
                }
            }
        }
        return false;
    };

    const addRandomTile = (board: CellValue[]): CellValue[] => {
        const emptyIndexes = board
            .map((value, index) => (value === null ? index : null))
            .filter((v): v is number => v !== null);

        if (emptyIndexes.length === 0) return board;

        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        const newTile = Math.random() < 0.9 ? 2 : 4;

        const newBoard = [...board];
        newBoard[randomIndex] = newTile;

        return newBoard;
    };

    const initializeBoard = () => {
        let newBoard = addRandomTile(Array(gridSize * gridSize).fill(null));
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);

    };

    useEffect(() => {
        initializeBoard();
    }, []);

    const handleMove = (direction: "left" | "right" | "up" | "down") => {
        let result: MoveResult;

        if (direction === "left") result = moveLeft(board);
        else if (direction === "right") result = moveRight(board);
        else if (direction === "up") result = moveUp(board);
        else result = moveDown(board);

        if (JSON.stringify(result.newBoard) !== JSON.stringify(board)) {
            setBoard(addRandomTile(result.newBoard));
            setScore(prev => prev + result.gainedScore);
        }
        if (!hasAvailableMoves(addRandomTile(result.newBoard))) {
            setGameOver(true);
        }

    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") handleMove("left");
            else if (event.key === "ArrowRight") handleMove("right");
            else if (event.key === "ArrowUp") handleMove("up");
            else if (event.key === "ArrowDown") handleMove("down");
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [board]);

    const moveLeft = (board: CellValue[]): MoveResult => {
        const newBoard: CellValue[] = [];
        let gainedScore = 0;

        for (let row = 0; row < gridSize; row++) {
            const rowStart = row * gridSize;
            const currentRow = board.slice(rowStart, rowStart + gridSize);
            const { mergedRow, score } = mergeRow(currentRow);
            newBoard.push(...mergedRow);
            gainedScore += score;
        }

        return { newBoard, gainedScore };
    };

    const moveRight = (board: CellValue[]): MoveResult => {
        const newBoard: CellValue[] = [];
        let gainedScore = 0;

        for (let row = 0; row < gridSize; row++) {
            const rowStart = row * gridSize;
            const currentRow = board.slice(rowStart, rowStart + gridSize).reverse();
            const { mergedRow, score } = mergeRow(currentRow);
            newBoard.push(...mergedRow.reverse());
            gainedScore += score;
        }

        return { newBoard, gainedScore };
    };

    const moveUp = (board: CellValue[]): MoveResult => {
        const newBoard = [...board];
        let gainedScore = 0;

        for (let col = 0; col < gridSize; col++) {
            const column: CellValue[] = [];
            for (let row = 0; row < gridSize; row++) {
                column.push(board[row * gridSize + col]);
            }

            const { mergedRow, score } = mergeRow(column);
            gainedScore += score;

            for (let row = 0; row < gridSize; row++) {
                newBoard[row * gridSize + col] = mergedRow[row];
            }
        }

        return { newBoard, gainedScore };
    };

    const moveDown = (board: CellValue[]): MoveResult => {
        const newBoard = [...board];
        let gainedScore = 0;

        for (let col = 0; col < gridSize; col++) {
            const column: CellValue[] = [];
            for (let row = gridSize - 1; row >= 0; row--) {
                column.push(board[row * gridSize + col]);
            }

            const { mergedRow, score } = mergeRow(column);
            gainedScore += score;

            const reversed = mergedRow.reverse();
            for (let row = 0; row < gridSize; row++) {
                newBoard[row * gridSize + col] = reversed[row];
            }
        }

        return { newBoard, gainedScore };
    };

    const mergeRow = (row: CellValue[]): { mergedRow: CellValue[]; score: number } => {
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

    return (
        <div className="game-container">
            <div className="status">
                <h2>Score: {score}</h2>
                <button onClick={initializeBoard}>New Game</button>
            </div>

            <div className="board">
                {gameOver && (
                    <div className="game-over-overlay">
                        <div className="game-over-text">Game Over</div>
                    </div>
                )}

                {board.map((value, index) => (
                    <div key={index} className="cell">
                        {value !== null ? <span className="tile">{value}</span> : null}
                    </div>
                ))}
            </div>

            <div className="controls">
                <button onClick={() => handleMove("up")}>⬆</button>

                <button onClick={() => handleMove("left")}>⬅</button>
                <button onClick={() => handleMove("right")}>➡</button>

                <button onClick={() => handleMove("down")}>⬇</button>
            </div>
        </div>
    );
};

export default GameBoard;
