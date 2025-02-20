import AI from "./Ai.js"
import Board from "./Board.js"


export default class Game {
    constructor() {
        this.state = {
            currentPlayer: 1,
            isAiPlaying: false
        }

        this.PLAYERS = {
            HUMAN: 1,
            AI: 2
        }

        this.board = new Board()
        this.ai = new AI(this)
        this.timer = 0
        this.init()
    }

    init() {
        this.initEvents();
        this.updateInterface()
    }

    initEvents() {
        document.getElementById('board').addEventListener('click', (e) => this.handleClick(e)) // click on the board
        document.getElementById('new-game').addEventListener('click', () => this.newGame()) // click on the new game button
    }

    handleClick(event) {
        if (this.state.currentPlayer === this.PLAYERS.AI || this.PLAYERS.isAiPlaying) {
            return;
        }
        let cell = event.target.closest('.case');
        if (!cell) return;

        const row = cell.dataset.row;
        const col = cell.dataset.col;

        if (this.board.selectedPiece) {
            if (this.board.selectPiece.row === row && this.board.selectPiece.col === col) {
                this.board.unselectPiece() // if the same selected piece, unselect this
                return
            }
            this.handleSelectedPieceMove(row, col) // move the selected piece
        } else if (this.board.getPiece(row, col)?.player === this.PLAYERS.HUMAN) {
            this.board.selectPiece(row, col) // select the piece
        }
    }

    handleSelectedPieceMove(row, col) {
        const move = this.board.possibleMoves.find(move => move.row == row && move.col == col)
        if (move) {
            this.board.movePiece(move) // move the piece
            this.changePlayer() // change the player
        } else {
            this.board.unselectPiece(row, col) // unselect the piece
        }
    }

    changePlayer() {
        this.state.currentPlayer = this.state.currentPlayer === this.PLAYERS.HUMAN ? this.PLAYERS.AI : this.PLAYERS.HUMAN
        this.updateInterface()

        if (this.state.currentPlayer === this.PLAYERS.AI) {
            setTimeout(() => this.ai.play(), 1000)
        }
    }

    updateInterface() {
        const scores = this.board.calculateScores() // calculate the scores
        document.getElementById('score-j1').innerText = scores[this.PLAYERS.HUMAN]
        document.getElementById('score-j2').innerText = scores[this.PLAYERS.AI]
        const tours = document.querySelectorAll('.tour');

        // Pour chaque élément "tour", on toggle la classe "yourturn"
        tours.forEach(tour => {
            tour.classList.toggle('yourturn');
        });
        this.duree()
        if (scores[this.PLAYERS.HUMAN] === 0 || scores[this.PLAYERS.AI] === 0) {
            const winner = scores[this.PLAYERS.HUMAN] > scores[this.PLAYERS.AI] ? "L'IA a gagné" : 'Vous avez gagné'
            setTimeout(() => {
                alert(winner)
            }, 500);
        }
    }

    duree() {
        this.timer = 0
        const timerDisplays = document.querySelectorAll('.timer');
        timerDisplays.forEach(timer => {
            timer.classList.toggle('reflexion');
        });

        const timerDisplay = document.querySelector('.reflexion');
        // Vérifie s'il existe déjà un intervalle actif et le supprime
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Démarre un nouvel intervalle
        this.timerInterval = setInterval(() => {
            this.timer++;
            timerDisplay.textContent = this.formatTime(this.timer);
        }, 1000);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    newGame() {
        location.reload()
    }
}