# 🧩 2048 React Game (in progress)

This is a pet project: a clone of the classic **2048** game built with **React** and **TypeScript**.

The project is currently in development.  
The core layout and initial logic (random tile generation and keyboard input) are implemented.

---

## 🎯 Features (so far)

- 4×4 game board
- Tiles with values 2 or 4 appear randomly on start
- Arrow key input is captured (`↑ ↓ ← →`)
- Tiles are rendered dynamically with correct positions and values

---

## ✅ Technologies

- React
- TypeScript
- SCSS (custom styles)

---

## 📁 Folder Structure

src/ ├── components/ │ └── GameBoard.tsx │ └── style.scss ├── App.tsx

yaml
Copy code

---

## 🚀 Setup & Run

```bash
npm install
npm run dev
```

## Planned features

Tile movement logic (left, right, up, down)

Tile merging logic (2 + 2 = 4, etc.)

Adding a new tile after each valid move

Game over detection

Scoring

Animations and color themes

Local storage: saving best score
