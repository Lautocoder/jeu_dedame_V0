
export default class AI {
    constructor(game) {
        this.game = game
    }

    play() {
        this.game.state.isAiPlaying = true
        setTimeout(() => {
            const move = this.getBestMove()
            this.game.board.selectPiece(move.piece.row,move.piece.col)//select the piece
            this.game.board.movePiece(move.move)
            this.game.state.isAiPlaying = false
            this.game.changePlayer()
        }, 1000)
    }

    getBestMove() {
        const possibleMoves = this.getAllPossibleMoves()//get all possible moves
        if(possibleMoves.length === 0){
            return  null
        }

        const capetureOnly= possibleMoves.filter(m=>m.move.capture)//get only the moves that are captures
        if(capetureOnly.length>0){
            return this.selectBestCapture(capetureOnly)
        }

        return this.selectBestPositionnalMove(possibleMoves)
    }

    getAllPossibleMoves(){
        const moves = []
        for(let row = 0; row < this.game.board.BOARD_SIZE; row++){
            for(let col = 0; col < this.game.board.BOARD_SIZE; col++){
                const piece = this.game.board.getPiece(row,col)
                if(piece && piece.player === this.game.PLAYERS.AI){//if the piece is an AI piece
                    const possibleMoves = piece.getPossibleMoves(this.game.board)//get possible moves for the piece
                    possibleMoves.forEach(move=>{
                        moves.push({piece,move})
                    })
                }
            }
        }
        return moves
    }

    selectBestCapture(captures){
        const scoreedCaptures = captures.map(capture=>({
            ...capture,
            score: this.evaluateCapture(capture)
        }))
        return captures[Math.floor(Math.random()*captures.length)]
    }

    evaluateCapture(capture){
        let score = 10
        if(capture.piece.isKing){
            score += 2
        }
        const capturedPiece = this.game.board.getPiece(capture.move.capture.row,capture.move.capture.col)

        if (capturedPiece && capturedPiece.isKing) {
            score += 3
        }

        score += this.evaluatePosition(capture.move.row,capture.move.col)

        return score
    }
    
    selectBestPositionnalMove(moves){
        const scoredMoves = moves.map(move=>({
            ...move,
            score: this.evaluatePosition(move.move.row,move.move.col)
        }))
        return this.selectBestMove(scoredMoves)
    }

    evaluatePosition(row,col){
        let score = 0
        score+=(row/this.game.board.BOARD_SIZE)*2
        const distanceFromCenter = Math.abs(col- this.game.board.BOARD_SIZE/2)
        score+=(this.game.board.BOARD_SIZE/2 - distanceFromCenter)/2

        if (col === 0 || col === this.game.board.BOARD_SIZE - 1) {
            score += 1
            
        }

        return score
    }

    selectBestMove(scoredMoves){
        const maxScore = Math.max(...scoredMoves.map(move=>move.score))
        const bestMoves = scoredMoves.filter(move=>move.score === maxScore)
        return bestMoves[Math.floor(Math.random()*bestMoves.length)]
    }
}