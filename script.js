const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = function() {
        return board;
    }

    const placeMarker = function(index, marker) {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = function () {
      for (let i = 0; i < board.length; i++) {
        board[i] = "";
      }
    };


    return {placeMarker, getBoard, resetBoard};
}) ();

function createPlayer(name, marker) {
    let score = 0;
    const getScore = function() {
        return score;
    }
    const addScore = function() {
        score++;
    }
    return {
        name,
        marker,
        getScore,
        addScore
    };
}

const GameController = (function() {

    let playerOne;
    let playerTwo;
    let activePlayer;
    let gameOver = false;
    let cpuTimeout = null;

    const setPlayers = function (name1, name2, type) {
        playerOne = createPlayer(name1 || "Player 1", "X");

        if (type === "computer") {
            playerTwo = createPlayer("Computer", "O");
        } else {
            playerTwo = createPlayer(name2 || "Player 2", "O");
        }

        activePlayer = playerOne;
        gameOver = false;
    }

    const switchPlayer = function() {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne; 
    };

    const getActivePlayer = function () {
        return activePlayer;
    };

    const getComputerMove = function () {
      const board = Gameboard.getBoard();
      const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      if (Math.random() < 0.3) {
        const available = board
          .map((v, i) => (v === "" ? i : null))
          .filter((v) => v !== null);

        if (available.length === 0) return null;

        return available[Math.floor(Math.random() * available.length)];
      }

      for (let [a, b, c] of winConditions) {
        const line = [board[a], board[b], board[c]];
        if (line.filter((x) => x === "O").length === 2 && line.includes("")) {
          return [a, b, c][line.indexOf("")];
        }
      }

      for (let [a, b, c] of winConditions) {
        const line = [board[a], board[b], board[c]];
        if (line.filter((x) => x === "X").length === 2 && line.includes("")) {
          return [a, b, c][line.indexOf("")];
        }
      }

      const available = board
        .map((v, i) => (v === "" ? i : null))
        .filter((v) => v !== null);
      return available[Math.floor(Math.random() * available.length)];
    };

    const playRound = function (index, type = "human") {
      if (gameOver || !activePlayer) return;
      if (activePlayer.name === "Computer" && type !== "cpu") return;

      if (Gameboard.placeMarker(index, getActivePlayer().marker)) {
        const winner = checkWinner();
        if (winner) {
          gameOver = true;
          getActivePlayer().addScore();
        } else if (!Gameboard.getBoard().includes("")) {
          gameOver = true;
        } else {
          switchPlayer();

          if (!gameOver && getActivePlayer().name === "Computer") {
            const cpuMove = getComputerMove();
            cpuTimeout = setTimeout(() => {
              if (!gameOver) {
                playRound(cpuMove, "cpu");
                DisplayController.updateDisplay();
              }
            }, 400);
          }
        }

        return "Ongoing";
      }
      return "Invalid";
    };

    const checkWinner = function() {
        const board = Gameboard.getBoard();
        const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
        ];

        for (let i = 0; i < winConditions.length; i++) {
            const condition = winConditions[i];
            const a = condition[0];
            const b = condition[1];
            const c = condition[2];

            if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
    }
    
    const restartGame = function () {
      if (cpuTimeout) {
        clearTimeout(cpuTimeout);
        cpuTimeout = null;
      }

      Gameboard.resetBoard();
      activePlayer = playerOne;
      gameOver = false;
    };

    return {
        switchPlayer,
        getActivePlayer,
        playRound,
        checkWinner,
        restartGame,
        setPlayers,
        isGameOver: () => gameOver,
        getScores: () => ({
            p1: playerOne ? playerOne.getScore() : 0,
            p2: playerTwo ? playerTwo.getScore() : 0
        })
    };
}) ();

const DisplayController = (function() {
    const startBtn = document.querySelector("#start-btn");
    const setupSection = document.querySelector("#setup-container");
    const container = document.querySelector("#game-container");
    const resultDiv = document.querySelector("#result-display");
    const restartBtn = document.querySelector("#restart-game-btn");
    const clearBoardBtn = document.querySelector("#clear-board-btn");
    const opponentSelect = document.querySelector("#opponent-type");
    const newGameBtn = document.querySelector("#new-game-btn");
    const controlsContainer = document.querySelector("#controls-container");
    const p2NameInput = document.querySelector("#p2-name");

    opponentSelect.addEventListener("change", function () {
      if (this.value === "computer") {
        p2NameInput.classList.add("hidden"); 
      } else {
        p2NameInput.classList.remove("hidden"); 
      }
    });

    newGameBtn.addEventListener("click", function() {
        GameController.restartGame();
        container.classList.add("hidden");
        controlsContainer.classList.add("hidden");
        resultDiv.textContent = "";
        setupSection.classList.remove("hidden");
    });


    startBtn.addEventListener("click", () => {
        const p1 = document.querySelector("#p1-name").value || "Player 1";
        const p2 = document.querySelector("#p2-name").value || "Player 2";
        const type = document.querySelector("#opponent-type").value;

        document.querySelector("#p1-label").textContent = p1;
        document.querySelector("#p2-label").textContent = (type === "computer") ? "Computer" : p2;


        GameController.setPlayers(p1, p2, type);

        setupSection.classList.add("hidden");
        container.classList.remove("hidden");
        restartBtn.classList.remove("hidden");
        controlsContainer.classList.remove("hidden");
        resultDiv.textContent = `${GameController.getActivePlayer().name}'s turn`;

        updateDisplay();
    });
    
    clearBoardBtn.addEventListener("click", function() {
        GameController.restartGame();
        resultDiv.textContent = `${GameController.getActivePlayer().name.toUpperCase()}'S TURN`;
        updateDisplay();             
    });

    const updateDisplay = function () {
      container.innerHTML = "";
      const board = Gameboard.getBoard();
      const activePlayer = GameController.getActivePlayer();
      const winnerMarker = GameController.checkWinner();

      if (!activePlayer) return;

      if (GameController.isGameOver() && winnerMarker) {
        if (winnerMarker === "O" && activePlayer.name === "Computer") {
          resultDiv.textContent = "COMPUTER WINS! YOU LOSE";
        } else {
          resultDiv.textContent = `${activePlayer.name.toUpperCase()} WINS!`;
        }
      } else if (!board.includes("")) {
        resultDiv.textContent = "IT'S A DRAW";
      } else {
        resultDiv.textContent = `${activePlayer.name.toUpperCase()}'S TURN`;
      }

      const scores = GameController.getScores();
      document.querySelector("#p1-score-val").textContent = scores.p1;
      document.querySelector("#p2-score-val").textContent = scores.p2;

      board.forEach(function (item, index) {
        const gridElement = document.createElement("div");
        gridElement.classList.add("cell");
        gridElement.textContent = item;

        gridElement.addEventListener("click", function () {
          GameController.playRound(index, "human");
          updateDisplay();
        });
        container.appendChild(gridElement);
      });
    };
    updateDisplay();
    return {updateDisplay};
})();

