document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('puzzle-board');
    const shuffleButton = document.getElementById('shuffle-button');
    const winMessage = document.getElementById('win-message');

    const SIZE = 4;
    const TILE_COUNT = SIZE * SIZE;
    const EMPTY_VALUE = TILE_COUNT;
    const TILE_SIZE = 100; // Includes gap

    let board = [];
    let tiles = [];

    function getTilePosition(index) {
        return {
            row: Math.floor(index / SIZE),
            col: index % SIZE
        };
    }

    function getIndex(row, col) {
        return row * SIZE + col;
    }

    function isSolvable(arr) {
        let inversions = 0;
        const flatBoard = arr.filter(val => val !== EMPTY_VALUE);

        for (let i = 0; i < flatBoard.length - 1; i++) {
            for (let j = i + 1; j < flatBoard.length; j++) {
                if (flatBoard[i] > flatBoard[j]) {
                    inversions++;
                }
            }
        }
        
        const emptyTileRowFromBottom = SIZE - getTilePosition(arr.indexOf(EMPTY_VALUE)).row;

        if (SIZE % 2 === 1) { // Odd grid
            return inversions % 2 === 0;
        } else { // Even grid
            return (inversions + emptyTileRowFromBottom) % 2 === 0;
        }
    }

    function createBoard() {
        boardElement.innerHTML = '';
        tiles = [];
        board = Array.from({ length: TILE_COUNT }, (_, i) => i + 1);

        for (let i = 0; i < TILE_COUNT; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.value = board[i];

            if (board[i] === EMPTY_VALUE) {
                tile.classList.add('empty');
            } else {
                tile.textContent = board[i];
            }
            
            tile.addEventListener('click', () => onTileClick(i));
            boardElement.appendChild(tile);
            tiles.push(tile);
        }
    }

    function shuffleBoard() {
        winMessage.classList.add('hidden');
        do {
            for (let i = board.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [board[i], board[j]] = [board[j], board[i]];
            }
        } while (!isSolvable(board));

        renderBoard();
    }
    
    function renderBoard() {
        board.forEach((value, index) => {
            const tile = tiles.find(t => parseInt(t.dataset.value) === value);
            if (tile) {
                const { row, col } = getTilePosition(index);
                tile.style.transform = `translate(${col * TILE_SIZE}px, ${row * TILE_SIZE}px)`;
            }
        });
        checkWin();
    }

    function onTileClick(clickedIndex) {
        const emptyIndex = board.indexOf(EMPTY_VALUE);
        const { row: clickedRow, col: clickedCol } = getTilePosition(clickedIndex);
        const { row: emptyRow, col: emptyCol } = getTilePosition(emptyIndex);
        
        const isAdjacent = (Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol)) === 1;
        
        if (isAdjacent) {
            [board[clickedIndex], board[emptyIndex]] = [board[emptyIndex], board[clickedIndex]];
            renderBoard();
        }
    }

    function checkWin() {
        const isWon = board.every((value, index) => value === index + 1);
        if (isWon) {
            winMessage.classList.remove('hidden');
            setTimeout(() => { // Add a little fade-in effect
                winMessage.style.opacity = '1';
            }, 10);
        } else {
            winMessage.classList.add('hidden');
            winMessage.style.opacity = '0';
        }
    }

    shuffleButton.addEventListener('click', shuffleBoard);

    // Initial setup
    createBoard();
    shuffleBoard();
});

