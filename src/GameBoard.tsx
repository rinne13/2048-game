import { useState, useEffect } from "react";
import "./style.scss";

type CellValue = number | null;


const GameBoard = () => {

    const gridSize = 4;
    const initialBoard: CellValue[] = Array(gridSize * gridSize).fill(null);

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


    const [board, setBoard] = useState<CellValue[]>(initialBoard);

    useEffect(() => {
        let newBoard = addRandomTile(initialBoard);
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowUp") {
                console.log("⬆️ move up");
            } else if (event.key === "ArrowDown") {
                console.log("⬇️ move down");
            } else if (event.key === "ArrowLeft") {
                console.log("⬅️ move left");
            } else if (event.key === "ArrowRight") {
                console.log("➡️ move right");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);



    return (
        <div className="board">
            {board.map((value, index) => (
                <div key={index} className="cell">
                    {value !== null ? <span className="tile">{value}</span> : null}
                </div>
            ))}

        </div>
    );
};

export default GameBoard;
