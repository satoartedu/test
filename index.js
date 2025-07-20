const puzzleBoard = document.getElementById("puzzle-board");
const shuffleButton = document.getElementById("shuffle-button");
const winMessage = document.getElementById("win-message");

let puzzle = [];

function initPuzzle() {
    puzzle = [];
    for (let i = 0; i < 16; i++) {
        puzzle.push(i);
    }
    renderBoard();
}

function renderBoard() {
    puzzleBoard.innerHTML = "";
    puzzle.forEach((value, index) => {
        if (value === 0) {
            const emptyPiece = document.createElement("div");
            emptyPiece.classList.add("puzzle-piece");
            puzzleBoard.appendChild(emptyPiece);
        } else {
            const piece = document.createElement("div");
            piece.classList.add("puzzle-piece");
            piece.textContent = value;
            piece.addEventListener("click", () => movePiece(index));
            puzzleBoard.appendChild(piece);
        }
    });
}

function movePiece(index) {
    const emptyIndex = puzzle.indexOf(0);
    const possibleMoves = [
        emptyIndex - 1, emptyIndex + 1, emptyIndex - 4, emptyIndex + 4
    ];

    if (possibleMoves.includes(index) && isValidMove(emptyIndex, index)) {
        puzzle[emptyIndex] = puzzle[index];
        puzzle[index] = 0;
        renderBoard();
        checkWin();
    }
}

function isValidMove(emptyIndex, index) {
    const rowEmpty = Math.floor(emptyIndex / 4);
    const colEmpty = emptyIndex % 4;
    const rowIndex = Math.floor(index / 4);
    const colIndex = index % 4;

    return Math.abs(rowEmpty - rowIndex) + Math.abs(colEmpty - colIndex) === 1;
}

function checkWin() {
    if (puzzle.every((value, index) => value === index)) {
        winMessage.classList.remove("hidden");
    }
}

shuffleButton.addEventListener("click", () => {
    for (let i = 0; i < 1000; i++) {
        const emptyIndex = puzzle.indexOf(0);
        const possibleMoves = [
            emptyIndex - 1, emptyIndex + 1, emptyIndex - 4, emptyIndex + 4
        ];
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        if (isValidMove(emptyIndex, randomMove)) {
            puzzle[emptyIndex] = puzzle[randomMove];
            puzzle[randomMove] = 0;
        }
    }
    renderBoard();
    winMessage.classList.add("hidden");
});

initPuzzle();
