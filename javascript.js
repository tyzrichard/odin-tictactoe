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

    // Method to print board for testing purposes, will remove after porting to UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

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

    return { getBoard, checkSpace, putToken, printBoard, checkWin };
}

// A singular cell, with the value 0 (unclaimed), 1 (first player) or 2 (second player)
function Cell() {
    let value = 0;
    // const cell = document.createElement("div");
    // cell.classList.add("cell");
    // boardGrid.appendChild(cell);

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

function DomController() {

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


    return { addCellIcon, resetCells };
}

function GameController(p1Name = "Player One", p2Name = "Player Two") {
    let board = GameBoard();
    const dom = DomController();

    let win = false;

    const players = [
        { name: p1Name, token: 1 },
        { name: p2Name, token: 2 },
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn:`);
    };

    const playRound = (row, column) => {
        if (win) {
            win = false;
            resetGame();
            return
        }
        if (!board.checkSpace(row, column)) {
            console.log(`Putting ${getActivePlayer().name}'s token into column ${column}, row ${row}...`);
            board.putToken(row, column, getActivePlayer().token);
            dom.addCellIcon(row, column, getActivePlayer().token)
            if (board.checkWin(getActivePlayer().token)) {
                win = true;
                console.log(`Congratulations! ${getActivePlayer().name} wins!`);
                board.printBoard();
            } else {
                printNewRound();
            }
            switchPlayerTurn();
        }
    };

    const resetGame = () => {
        dom.resetCells(); // Resets the cells on the frontend...
        board = GameBoard(); // ... and the backend too!
        console.log("reset")
    }

    //Initial Game Message
    printNewRound();

    return { playRound, getActivePlayer, resetGame };
}

const game = GameController();

let cellIndex = 0;
boardGridCells.forEach((cell) => {
    const column = cellIndex % 3;
    const row = (cellIndex - column) / 3;
    cell.addEventListener("click", () => {
        game.playRound(row, column);
    });
    cellIndex++;
});
