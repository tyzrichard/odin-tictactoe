// Lots of the stuff here is taken from this replit: https://replit.com/@40percentzinc/ConnectFourConsole#script.js
// Very helpful, credits to Alex Younger!

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

    // Checks if a space is taken, it it's free, it puts the player's token inside
    const putToken = (row, column, player) => {
        console.log(board[row][column].getValue())
        if (board[row][column].getValue() !== 0) {
            return;
        } else {
            board[row][column].addToken(player);
        }
    }

    // Method to print board for testing purposes, will remove after porting to UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, putToken, printBoard };
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

function GameController(p1Name = "Player One", p2Name = "Player Two") {
    const board = GameBoard();
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
        console.log(`Putting ${getActivePlayer().name}'s token into column ${column}, row ${row}...`);
        board.putToken(row, column, getActivePlayer().token);

        //Game Logic

        switchPlayerTurn();
        printNewRound();
    };

    //Initial Game Message
    printNewRound();

    return { playRound, getActivePlayer };
}

const game = GameController();
game.playRound(1, 1);
game.playRound(2, 1);
game.playRound(0, 0);
game.playRound(1, 1);
game.playRound(2, 2);