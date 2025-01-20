import Piece from './Piece.js';

export default class Board {
    /**
     *  Create a new board
     */
    constructor() {
        this.BOARD_SIZE = 10
        this.grid = []
        this.selectedPiece = null
        this.possibleMoves = []

        this.init()
    }
    /**
     * Create the board
     */
    init() {
        const board = document.getElementById('board')
        board.innerHTML = ''

        for (let row = 0; row < this.BOARD_SIZE; row++) {
            this.grid[row] = []
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                this.createCell(row, col, board)
            }
        }
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {number} board 
     */
    createCell(row, col, board) {
        const cell = document.createElement('div') // create a cell
        cell.classList.add('case')
        cell.classList.add(`${(row + col) % 2 === 0 ? 'black-case1' : 'white-case1'}`) // add the color to the cell
        cell.dataset.row = row
        cell.dataset.col = col

        if ((row + col) % 2 !== 0) {
            if (row < 4) {
                this.grid[row][col] = new Piece(row, col, 2) // create a piece AI
                this.grid[row][col].render(cell) // render the piece
            }
            else if (row > 5) {
                this.grid[row][col] = new Piece(row, col, 1) // create a piece HUMAN
                this.grid[row][col].render(cell) // render the piece
            }
            else
                this.grid[row][col] = null
        } else {
            this.grid[row][col] = null
        }
        board.appendChild(cell) // add the cell to the board
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @returns 
     */
    getPiece(row, col) {
        return this.grid[row][col]
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     */
    selectPiece(row, col) {
        this.unselectPiece()
        const piece = this.getPiece(row, col)
        if (piece) {
            this.selectedPiece = piece
            piece.select()
            this.possibleMoves = piece.getPossibleMoves(this)
            this.highlitghtpossibleMoves()
        }
    }

    /**
     *  Unselect the piece
     */
    unselectPiece() {
        if (this.selectedPiece) {
            const cell = document.querySelector(`[data-row="${this.selectedPiece.row}"][data-col="${this.selectedPiece.col}"]`)
            cell.querySelector('.pion').classList.remove('selected')
            this.clearHightlights()
            this.selectedPiece = null
            this.possibleMoves = []
        }
    }

    /**
     * Clear the highlights
     */
    highlitghtpossibleMoves() {
        this.possibleMoves.forEach(move => {
            const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`).classList.add('possible-case') // add the class to the cell
        })
    }

    clearHightlights() {
        document.querySelectorAll('.possible-case').forEach(cell => cell.classList.remove('possible-case')) // remove the class from the cell
    }

    /**
     * 
     * @param {*} move 
     */
    movePiece(move) {
        const { row: fromRow, col: fromCol } = this.selectedPiece // get the selected piece row and col
        const { row: toRow, col: toCol } = move

        this.grid[toRow][toCol] = this.selectedPiece
        this.grid[fromRow][fromCol] = null

        this.selectedPiece.row = toRow
        this.selectedPiece.col = toCol

        if (move.capture) {// check if the move is a capture
            const { row: captureRow, col: captureCol } = move.capture
            this.grid[captureRow][captureCol] = null
            let cell=document.querySelector(`[data-row="${captureRow}"][data-col="${captureCol}"]`)
            cell.querySelector('.pion').remove()
        }

        const fromCell = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`)
        const toCell = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`)
        const pieceElement = fromCell.querySelector('.pion')
        fromCell.removeChild(pieceElement)
        toCell.appendChild(pieceElement)

        this.checkForKing(this.selectedPiece)
        this.unselectPiece()
    }

    /**
     * 
     * @param {} piece 
     */
    checkForKing(piece) {
        if (piece.player === 1 && piece.row === 0 || piece.player === 2 && piece.row === this.BOARD_SIZE - 1) {// check if the piece is in the last row
            piece.isKing = true
            document.querySelector(`[data-row="${piece.row}"][data-col="${piece.col}"] .pion`).classList.add('dame') // add the class to the piece
        }
    }
    /**
     *  Check if the piece can move to the row and col
     */
    calculateScores() {
        const score = { 1: 0, 2: 0 }
        for (let row = 0; row < this.BOARD_SIZE; row++) {
            for (let col = 0; col < this.BOARD_SIZE; col++) {
                const piece = this.grid[row][col]

                if (piece) {
                    score[piece.player]++
                }
            }
        }
        return score
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @returns boolean
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.BOARD_SIZE && col >= 0 && col < this.BOARD_SIZE
    }
}

new Board()