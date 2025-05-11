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

                if (col < gridSize - 1 && current === board[index + 1]) return true;
                if (row < gridSize - 1 && current === board[index + gridSize]) return true;
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
        const result =
            direction === "left" ? moveLeft(board) :
                direction === "right" ? moveRight(board) :
                    direction === "up" ? moveUp(board) :
                        direction === "down" ? moveDown(board) :
                            null;

        if (!result) return;

        if (JSON.stringify(result.newBoard) !== JSON.stringify(board)) {
            const updatedBoard = addRandomTile(result.newBoard);
            setBoard(updatedBoard);
            setScore(prev => prev + result.gainedScore);

            if (!hasAvailableMoves(updatedBoard)) {
                setGameOver(true);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    handleMove("left");
                    break;
                case "ArrowRight":
                    handleMove("right");
                    break;
                case "ArrowUp":
                    handleMove("up");
                    break;
                case "ArrowDown":
                    handleMove("down");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [board]);

    const moveLeft = (board: CellValue[]): MoveResult => processRows(board, false);
    const moveRight = (board: CellValue[]): MoveResult => processRows(board, true);
    const moveUp = (board: CellValue[]): MoveResult => processColumns(board, false);
    const moveDown = (board: CellValue[]): MoveResult => processColumns(board, true);

    const processRows = (board: CellValue[], reverse: boolean): MoveResult => {
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

    const processColumns = (board: CellValue[], reverse: boolean): MoveResult => {
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

    useEffect(() => {
        let startX = 0;
        let startY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = endX - startX;
            const diffY = endY - startY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 30) handleMove("right");
                else if (diffX < -30) handleMove("left");
            } else {
                if (diffY > 30) handleMove("down");
                else if (diffY < -30) handleMove("up");
            }
        };

        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchend", handleTouchEnd, { passive: false });

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [board]);


    return (
        <div className="game-container">
            <div className="status">
                <h2>Score: {score}</h2>
                <button onClick={initializeBoard}>New Game</button>
            </div>

            <div className="board">
                {gameOver && (
                    <div className="game-over">
                        <h2>💀 Game Over!</h2>
                        <button onClick={initializeBoard}>New Game</button>
                    </div>
                )}

                {board.map((value, index) => (
                    <div key={index} className="cell">
                        {value !== null ? <span className="tile">{value}</span> : null}
                    </div>
                ))}
            </div>

            <div className="controls">
                <button onClick={() => handleMove("left")}>⬅</button>
                <button onClick={() => handleMove("up")}>⬆</button>
                <button onClick={() => handleMove("right")}>➡</button>
                <button onClick={() => handleMove("down")}>⬇</button>
            </div>
        </div>
    );
};

export default GameBoard;
