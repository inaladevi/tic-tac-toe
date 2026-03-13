# ❌⭕ Tic-Tac-Toe

A simple browser-based Tic-Tac-Toe game built with modular JavaScript.  
This project focuses on separating game logic from UI handling using **Module Pattern**, **Factory Functions**, and DOM manipulation.

The game manages the board state, player turns, and score tracking while dynamically rendering the interface.

## Live Demo

[View on GitHub Pages](https://inaladevi.github.io/tic-tac-toe/)

## Features

- **Modular Architecture** using JavaScript **IIFEs** to separate responsibilities:
  - `Gameboard` – manages board state.
  - `GameController` – handles game logic and turn flow.
  - `DisplayController` – controls DOM updates and UI rendering.
- **Factory Function for Players** to create player objects with markers and score tracking.
- **Dynamic Board Rendering** where the grid is rebuilt based on the board array.
- **Score Tracking System** that updates player scores after each win.
- **Multiple Game Modes**
  - Player vs Player
  - Player vs Computer
- **Basic Computer Opponent Logic**
  - Attempts winning moves.
  - Blocks opponent winning moves.
  - Otherwise chooses a random available cell.
- **Board Reset Controls**
  - Clear board while keeping scores.
  - Restart game state.
  - Change players and start a new match.
- **Game State Management**
  - Prevents moves when the game is over.
  - Handles draw detection.
  - Uses `setTimeout()` for delayed computer moves.

## Built With

- **HTML5**
- **CSS3**
  - CSS Grid
  - Flexbox
  - Custom Properties (CSS Variables)
- **JavaScript (ES6+)**
  - Module Pattern (IIFE)
  - Factory Functions
  - DOM Manipulation
  - Event Handling

## Preview

![Tic Tac Toe Preview](/preview.png)