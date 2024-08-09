// Lots of the stuff here is taken from this replit: https://replit.com/@40percentzinc/ConnectFourConsole#script.js
// Very helpful, credits to Alex Younger!

const boardGridCells = document.querySelectorAll(".cell");

function GameBoard() {
    // Creating Gameboard
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board; // Method of getting the entire board

    // Checks a space
    const checkSpace = (row, column) => {
        if (board[row][column].getValue() !== 0) {
            return true;
        }
        return false;
    }

    // Puts the player's token inside
    const putToken = (row, column, player) => {
        board[row][column].addToken(player);
    }

    const checkWin = (token) => {
        for (i = 0; i < 3; i++) {
            if (board[i][0].getValue() == token && board[i][1].getValue() == token && board[i][2].getValue() == token) { //Check for row wins
                return true;
            } else if (board[0][i].getValue() == token && board[1][i].getValue() == token && board[2][i].getValue() == token) { //Check for column wins
                return true;
            }
        }
        if (board[0][0].getValue() == token && board[1][1].getValue() == token && board[2][2].getValue() == token) { //Check for both diagonal wins
            return true;
        } else if (board[0][2].getValue() == token && board[1][1].getValue() == token && board[2][0].getValue() == token) {
            return true;
        }
        return false;
    };

    return { getBoard, checkSpace, putToken, checkWin };
}

// A singular cell, with the value 0 (unclaimed), 1 (first player) or 2 (second player)
function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

function DomController() {

    const updateHeader = (message) => {
        const header = document.querySelector(".header-text");
        header.textContent = message;
    }

    const addCellIcon = (row, column, token) => {
        const cellIcon = document.createElement("img");
        if (token == 1) {
            cellIcon.src = "assets/circle.svg";
        } else {
            cellIcon.src = "assets/cross.svg";
        }
        boardGridCells[3 * row + column].appendChild(cellIcon);
    }

    const resetCells = () => {
        boardGridCells.forEach((cell) => {
            if (cell.firstElementChild) {
                cell.firstElementChild.remove();
            }
        });
    }

    const scoreBars = document.querySelector(".score-bar").children;

    const updateScoreBar = (p1score, p2score) => {
        scoreBars[0].style.flex = p1score;
        if (p1score) {
            scoreBars[0].textContent = p1score;
        } 
        scoreBars[1].style.flex = p2score;
        if (p2score) {
            scoreBars[1].textContent = p2score;
        } 
    }

    const resetScoreBar = () => {
        scoreBars[0].style.flex = 1;
        scoreBars[0].textContent = "";
        scoreBars[1].style.flex = 1;
        scoreBars[1].textContent = "";
    }

    return { addCellIcon, resetCells, updateHeader, updateScoreBar, resetScoreBar };
}

function GameController(p1Name = "Player One", p2Name = "Player Two") {
    let board = GameBoard();
    const dom = DomController();

    let end = false;
    let rounds = 0;

    const incrementRounds = () => {
        if (rounds < 8) {
            rounds++;
        } else {
            rounds = 0;
            end = true;
            dom.updateHeader(`It's a tie!`);
            switchPlayerTurn();
        }
    }

    const players = [
        { name: p1Name, token: 1, points: 0},
        { name: p2Name, token: 2, points: 0},
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];

    };

    const getActivePlayer = () => activePlayer;

    const startNewRound = () => {
        dom.updateHeader(`${getActivePlayer().name}'s turn:`);
    };

    const playRound = (row, column) => {
        if (end) {
            end = false;
            startNewRound();
            resetGame();
            return;
        }
        if (!board.checkSpace(row, column)) {
            board.putToken(row, column, getActivePlayer().token);
            dom.addCellIcon(row, column, getActivePlayer().token);
            if (board.checkWin(getActivePlayer().token)) {
                end = true;
                dom.updateHeader(`Congratulations! ${getActivePlayer().name} wins!`);
                getActivePlayer().points++;
                dom.updateScoreBar(players[0].points, players[1].points);
                switchPlayerTurn();
            } else {
                switchPlayerTurn();
                dom.updateHeader(`${getActivePlayer().name}'s turn:`);
                incrementRounds();
            }
        }
    };

    const resetGame = () => {
        dom.resetCells(); // Resets the cells on the frontend...
        board = GameBoard(); // ... and the backend too!
        rounds = 0;
    }

    //Initial Game Message
    startNewRound();
    resetGame();
    dom.resetScoreBar();

    return { playRound, getActivePlayer, resetGame };
}

function Game() {
    let gameController = GameController();

    let cellIndex = 0;
    boardGridCells.forEach((cell) => {
        const column = cellIndex % 3;
        const row = (cellIndex - column) / 3;
        cell.addEventListener("click", () => {
            gameController.playRound(row, column);
        });
        cellIndex++;
    });

    const reset = document.querySelector(".reset");
    reset.addEventListener("click", () => {
        gameController = GameController(); // Resets everything
    })

}

const game = Game();

