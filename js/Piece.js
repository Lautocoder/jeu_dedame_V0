
export default class Piece {
    constructor(row, col, player) {
        this.row = row
        this.col = col
        this.player = player
        this.isKing = false
    }

    render(cell) {
        const piece = document.createElement('div')
        piece.className = `pion ${this.player === 1 ? "white-pion1" : "black-pion1"}`
        if (this.isKing) {
            piece.classList.add('dame')
        }
        cell.appendChild(piece)
    }

    select(){
        const cell = document.querySelector(`[data-row="${this.row}"][data-col="${this.col}"]`)
        cell.querySelector('.pion').classList.add('selected')
    }

    getPossibleMoves(board){
        const moves = []
        const directions = this.isKing ? [{row: -1,col: -1},{row: -1,col: 1},{row: 1,col: -1},{row: 1,col: 1}] : [{row: this.player === 1 ? -1 : 1, col: -1},{row: this.player === 1 ? -1 : 1, col: 1}]
        
        const captures = this.getCaptures(board, directions)
        if(captures.length>0){
            return captures
        }

        directions.forEach(direction=>{
            const row = this.row + direction.row
            const col = this.col + direction.col

            if(board.isValidPosition(row,col) && !board.getPiece(row,col)){
                moves.push({row,col})
            }
        })

        return moves
    }

    getCaptures(board, directions){
        const captures = []
        directions.forEach(direction=>{
            const captureRow = this.row + direction.row
            const captureCol = this.col + direction.col
            const landinRow = captureRow + direction.row
            const landingCol = captureCol + direction.col

            if(board.isValidPosition(landinRow,landingCol)){
                const potentialCapture = board.getPiece(captureRow,captureCol)
                const landingSquare = board.getPiece(landinRow,landingCol)

                if(potentialCapture && potentialCapture.player !== this.player && !landingSquare){
                    captures.push({row: landinRow, col: landingCol, capture: {row: captureRow, col: captureCol}})
                }
            }
        })
        return captures
    }
}