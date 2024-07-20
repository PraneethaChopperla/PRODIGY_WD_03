let gameBoard = [];
let currentPlayer = 'X';
let gameOver = false;
let singlePlayer = false;

// Initialize game board
function initGame() {
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameOver = false;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'hint');
    });
}

// Add event listeners to cells
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

// Mode selection buttons
document.getElementById('twoPlayerMode').addEventListener('click', () => {
    singlePlayer = false;
    initGame();
});
document.getElementById('singlePlayerMode').addEventListener('click', () => {
    singlePlayer = true;
    initGame();
});
document.getElementById('hintButton').addEventListener('click', showHint);

function handleCellClick(cellIndex) {
    if (gameOver || gameBoard[cellIndex] !== '') return;
    
    gameBoard[cellIndex] = currentPlayer;
    document.getElementById(`cell-${cellIndex + 1}`).textContent = currentPlayer;
    document.getElementById(`cell-${cellIndex + 1}`).classList.add(currentPlayer.toLowerCase());
    
    if (checkForWin()) {
        gameOver = true;
        alert(`Player ${currentPlayer} wins!`);
        return;
    }
    
    if (!gameBoard.includes('')) {
        gameOver = true;
        alert("It's a draw!");
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    if (singlePlayer && currentPlayer === 'O') {
        aiMove();
    }
}

function checkForWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function aiMove() {
    const bestMove = getBestMove();
    gameBoard[bestMove] = 'O';
    document.getElementById(`cell-${bestMove + 1}`).textContent = 'O';
    document.getElementById(`cell-${bestMove + 1}`).classList.add('o');
    
    if (checkForWin()) {
        gameOver = true;
        alert('Player O wins!');
        return;
    }
    
    if (!gameBoard.includes('')) {
        gameOver = true;
        alert("It's a draw!");
        return;
    }
    
    currentPlayer = 'X';
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    let winner = checkWinner();
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }
    if (!gameBoard.includes('')) {
        return 'tie';
    }
    return null;
}

function showHint() {
    const hintMove = getHintMove();
    if (hintMove !== undefined) {
        document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('hint'));
        document.getElementById(`cell-${hintMove + 1}`).classList.add('hint');
    }
}

function getHintMove() {
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = currentPlayer;
            if (checkForWin()) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    return getBestMove();
}

// Initialize game for the first time
initGame();
