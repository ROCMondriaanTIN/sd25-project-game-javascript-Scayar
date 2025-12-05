/**
 * HogerLagerGame - Game Logic Module (Model)
 * 
 * This module contains all the game state and logic for the "Hoger / Lager" dice game.
 * It does NOT interact with the DOM - that's the controller's responsibility.
 * 
 * Game flow:
 * 1. Computer rolls first
 * 2. Player chooses bet amount and prediction (hoger/lager)
 * 3. Player rolls
 * 4. Compare results and update saldo
 */

const HogerLagerGame = {
    // ==========================================
    // Game State Properties
    // ==========================================
    
    /** Current player balance/credits */
    saldo: 100,
    
    /** The last bet amount placed by the player */
    lastBet: 10,
    
    /** The last prediction made by the player ('hoger' or 'lager') */
    lastPrediction: 'hoger',
    
    /** Current round number */
    roundNumber: 0,
    
    /** Computer's dice values [die1, die2] */
    computerDice: [0, 0],
    
    /** Player's dice values [die1, die2] */
    playerDice: [0, 0],
    
    /** Sum of computer's dice */
    computerTotal: 0,
    
    /** Sum of player's dice */
    playerTotal: 0,
    
    /** Array of round history objects (max 5 entries, newest first) */
    history: [],
    
    /** Flag indicating if computer has rolled this round */
    computerHasRolled: false,

    // ==========================================
    // Helper Functions
    // ==========================================
    
    /**
     * Rolls two dice and returns their values as an array.
     * Each die value is between 1 and 6 (inclusive).
     * @returns {number[]} Array with two dice values [die1, die2]
     */
    rollTwoDice() {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        return [d1, d2];
    },

    // ==========================================
    // Main Game Functions
    // ==========================================
    
    /**
     * Starts a new round by rolling the computer's dice.
     * Called when the "Computer gooien" button is clicked.
     * 
     * Actions:
     * - Resets player dice and totals
     * - Rolls computer dice
     * - Sets flag that computer has rolled
     * 
     * Note: roundNumber is incremented only when the round is completed (in rollPlayerAndResolve)
     * 
     * @returns {Object} Object containing computerDice and computerTotal for rendering
     */
    startNewRoundWithComputerRoll() {
        // Reset player dice to indicate they haven't rolled yet
        this.playerDice = [0, 0];
        this.playerTotal = 0;
        
        // Roll computer dice
        this.computerDice = this.rollTwoDice();
        this.computerTotal = this.computerDice[0] + this.computerDice[1];
        
        // Mark that computer has rolled this round
        this.computerHasRolled = true;
        
        // Return data for the controller to render
        return {
            computerDice: this.computerDice,
            computerTotal: this.computerTotal
        };
    },

    /**
     * Validates and stores the bet amount and prediction.
     * Called before the player rolls to ensure valid input.
     * 
     * @param {number} betAmount - The amount the player wants to bet
     * @param {string} prediction - Either 'hoger' or 'lager'
     * @returns {Object} Object with success flag and optional error message
     */
    setBetAndPrediction(betAmount, prediction) {
        // Validate bet amount is a number
        if (typeof betAmount !== 'number' || isNaN(betAmount)) {
            return {
                success: false,
                error: 'Voer een geldig getal in voor de inzet.'
            };
        }
        
        // Validate bet is at least 1
        if (betAmount < 1) {
            return {
                success: false,
                error: 'Inzet moet minimaal 1 zijn.'
            };
        }
        
        // Validate bet is not more than current saldo
        if (betAmount > this.saldo) {
            return {
                success: false,
                error: `Inzet moet tussen 1 en ${this.saldo} zijn.`
            };
        }
        
        // Validate prediction value
        if (prediction !== 'hoger' && prediction !== 'lager') {
            return {
                success: false,
                error: 'Kies hoger of lager.'
            };
        }
        
        // Store valid bet and prediction
        this.lastBet = betAmount;
        this.lastPrediction = prediction;
        
        return { success: true };
    },

    /**
     * Rolls the player's dice and resolves the round outcome.
     * Called when "Speler gooien" is clicked with valid bet/prediction.
     * 
     * Actions:
     * - Increments round number (only when round is completed)
     * - Rolls player dice
     * - Compares with computer total using stored prediction
     * - Updates saldo based on win/loss
     * - Adds entry to history
     * 
     * @returns {Object} Complete round outcome data for rendering
     */
    rollPlayerAndResolve() {
        // Increment round number only when the round is completed
        this.roundNumber++;
        
        // Roll player dice
        this.playerDice = this.rollTwoDice();
        this.playerTotal = this.playerDice[0] + this.playerDice[1];
        
        // Determine win/loss based on prediction
        let result;
        
        if (this.lastPrediction === 'hoger') {
            // Player wins if their total is STRICTLY higher than computer
            result = this.playerTotal > this.computerTotal ? 'win' : 'lose';
        } else {
            // Player wins if their total is STRICTLY lower than computer
            result = this.playerTotal < this.computerTotal ? 'win' : 'lose';
        }
        
        // Update saldo
        if (result === 'win') {
            this.saldo += this.lastBet;
        } else {
            this.saldo -= this.lastBet;
        }
        
        // Ensure saldo doesn't go below 0
        if (this.saldo < 0) {
            this.saldo = 0;
        }
        
        // Reset computer rolled flag for next round
        this.computerHasRolled = false;
        
        // Create history entry
        const historyEntry = {
            roundNumber: this.roundNumber,
            computerTotal: this.computerTotal,
            playerTotal: this.playerTotal,
            prediction: this.lastPrediction,
            result: result,
            saldoAfter: this.saldo
        };
        
        // Add to history (newest first, max 5 entries)
        this.history.unshift(historyEntry);
        if (this.history.length > 5) {
            this.history.pop();
        }
        
        // Return complete outcome data for rendering
        return {
            computerDice: this.computerDice,
            playerDice: this.playerDice,
            computerTotal: this.computerTotal,
            playerTotal: this.playerTotal,
            prediction: this.lastPrediction,
            bet: this.lastBet,
            result: result,
            saldoAfter: this.saldo,
            roundNumber: this.roundNumber
        };
    },

    /**
     * Resets the game to initial state.
     * Called when "Nieuw spel" button is clicked after game over.
     * 
     * Resets:
     * - Saldo to 100
     * - Round number to 0
     * - All dice and totals
     * - History array
     * - Computer rolled flag
     */
    resetGame() {
        this.saldo = 100;
        this.roundNumber = 0;
        this.computerDice = [0, 0];
        this.playerDice = [0, 0];
        this.computerTotal = 0;
        this.playerTotal = 0;
        this.lastBet = 10;
        this.lastPrediction = 'hoger';
        this.history = [];
        this.computerHasRolled = false;
    },

    /**
     * Checks if the game is over (saldo <= 0).
     * @returns {boolean} True if game is over
     */
    isGameOver() {
        return this.saldo <= 0;
    },

    /**
     * Checks if computer has rolled this round.
     * @returns {boolean} True if computer has rolled
     */
    hasComputerRolled() {
        return this.computerHasRolled;
    }
};

// Attach to window for global access by controller
window.HogerLagerGame = HogerLagerGame;

