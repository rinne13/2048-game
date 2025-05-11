import { useState, useEffect } from "react";
import "./style.scss";

type CellValue = number | null;

const gridSize = 4;

const GameBoard = () => {
    const initialBoard: CellValue[] = Array(gridSize * gridSize).fill(null);

    const [board, setBoard] = useState<CellValue[]>(initialBoard);

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
        let newBoard = addRandomTile(initialBoard);
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
    };

    useEffect(() => {
        initializeBoard();
    }, []);

    const handleMove = (direction: "left" | "right" | "up" | "down") => {
        let newBoard: CellValue[] = board;

        if (direction === "left") newBoard = moveLeft(board);
        else if (direction === "right") newBoard = moveRight(board);
        else if (direction === "up") newBoard = moveUp(board);
        else if (direction === "down") newBoard = moveDown(board);


        if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
            setBoard(addRandomTile(newBoard));
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

    const moveLeft = (board: CellValue[]): CellValue[] => {
        return board.reduce<CellValue[]>((newBoard, _, row) => {
            if (row % gridSize === 0) {
                const currentRow = board.slice(row, row + gridSize);
                const mergedRow = mergeRow(currentRow);
                newBoard.push(...mergedRow);
            }
            return newBoard;
        }, []);
    };

    const moveRight = (board: CellValue[]): CellValue[] => {
        return board.reduce<CellValue[]>((newBoard, _, row) => {
            if (row % gridSize === 0) {
                const currentRow = board.slice(row, row + gridSize).reverse();
                const mergedRow = mergeRow(currentRow).reverse();
                newBoard.push(...mergedRow);
            }
            return newBoard;
        }, []);
    };
    const moveUp = (board: CellValue[]): CellValue[] => {
        const newBoard = [...board];

        for (let col = 0; col < gridSize; col++) {
            const column: CellValue[] = [];

            for (let row = 0; row < gridSize; row++) {
                const index = row * gridSize + col;
                column.push(board[index]);
            }

            const merged = mergeRow(column);

            for (let row = 0; row < gridSize; row++) {
                const index = row * gridSize + col;
                newBoard[index] = merged[row];
            }
        }
        return newBoard;
    }

    const moveDown = (board: CellValue[]): CellValue[] => {
        const newBoard = [...board];

        for (let col = 0; col < gridSize; col++) {
            const column: CellValue[] = [];

            for (let row = gridSize - 1; row >= 0; row--) {
                const index = row * gridSize + col;
                column.push(board[index]);
            }

            const merged = mergeRow(column).reverse();

            for (let row = 0; row < gridSize; row++) {
                const index = row * gridSize + col;
                newBoard[index] = merged[row];
            }
        }
        return newBoard;
    }

    const mergeRow = (row: CellValue[]): CellValue[] => {
        const filtered = row.filter((cell): cell is number => cell !== null);
        const merged: CellValue[] = [];
        let skip = false;

        for (let i = 0; i < filtered.length; i++) {
            if (skip) {
                skip = false;
                continue;
            }

            if (filtered[i] === filtered[i + 1]) {
                merged.push(filtered[i] * 2);
                skip = true;
            } else {
                merged.push(filtered[i]);
            }
        }

        while (merged.length < gridSize) {
            merged.push(null);
        }

        return merged;
    };

    return (
        <div className="game-container">
            <div className="board">
                {board.map((value, index) => (
                    <div key={index} className="cell">
                        {value !== null ? <span className="tile">{value}</span> : null}
                    </div>
                ))}
            </div>

            <div className="controls">
                <button onClick={() => handleMove("up")}>⬆</button>
                <button onClick={() => handleMove("down")}>⬇</button>
                <button onClick={() => handleMove("left")}>⬅</button>
                <button onClick={() => handleMove("right")}>➡</button>
            </div>
        </div>
    );
};

export default GameBoard;
