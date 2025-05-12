import { useState, useEffect } from "react";
import "../styles/style.scss";

import {
    addRandomTile,
    hasAvailableMoves,
    createInitialBoard,
} from "../logic/boardUtils";

import {
    processRows,
    processColumns,
} from "../logic/moveUtils";

import type { CellValue } from "../types";

const GameBoard = () => {
    const [board, setBoard] = useState<CellValue[]>(createInitialBoard());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const initializeBoard = () => {
        setBoard(createInitialBoard());
        setScore(0);
        setGameOver(false);
    };

    const handleMove = (direction: "left" | "right" | "up" | "down") => {
        const result =
            direction === "left"
                ? processRows(board, false)
                : direction === "right"
                    ? processRows(board, true)
                    : direction === "up"
                        ? processColumns(board, false)
                        : direction === "down"
                            ? processColumns(board, true)
                            : null;

        if (!result) return;

        if (JSON.stringify(result.newBoard) !== JSON.stringify(board)) {
            const updatedBoard = addRandomTile(result.newBoard);
            setBoard(updatedBoard);
            setScore((prev) => prev + result.gainedScore);

            if (!hasAvailableMoves(updatedBoard)) {
                setGameOver(true);
            }
        }
    };

    // keyboard support
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

    // touch support
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
                diffX > 30 ? handleMove("right") : diffX < -30 && handleMove("left");
            } else {
                diffY > 30 ? handleMove("down") : diffY < -30 && handleMove("up");
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
                        <h2><span> 💀 </span> Game Over!</h2>
                        <button onClick={initializeBoard}>New Game</button>
                    </div>
                )}

                {board.map((value, index) => (
                    <div key={index} className="cell">
                        {value !== null ? <span className="tile">{value}</span> : null}
                    </div>
                ))}
            </div>

            <div className="mobileSwipes">Swipe to control 🫰</div>

            <div className="controls">
                <button onClick={() => handleMove("left")}>⇦</button>
                <button onClick={() => handleMove("up")}>⇧</button>
                <button onClick={() => handleMove("right")}>⇨</button>
                <button onClick={() => handleMove("down")}>⇩</button>
            </div>
        </div>
    );
};

export default GameBoard;
