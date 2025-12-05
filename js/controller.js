/**
 * Controller Module - DOM & Event Handling
 * 
 * This module handles all DOM interactions and event handling for the game.
 * It communicates with the HogerLagerGame model to get/set game state.
 * 
 * Responsibilities:
 * - Cache DOM elements
 * - Render game state to the UI
 * - Handle user input events
 * - Coordinate game flow between UI and model
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // DOM Element References
    // ==========================================
    
    // Computer panel elements
    const computerDie1 = document.getElementById('computer-die-1');
    const computerDie2 = document.getElementById('computer-die-2');
    const computerTotal = document.getElementById('computer-total');
    const btnComputer = document.getElementById('btn-computer');
    
    // Player panel elements
    const playerDie1 = document.getElementById('player-die-1');
    const playerDie2 = document.getElementById('player-die-2');
    const playerTotal = document.getElementById('player-total');
    const btnSpeler = document.getElementById('btn-speler');
    
    // Controls panel elements
    const saldoWaarde = document.getElementById('saldo-waarde');
    const radioHoger = document.getElementById('radio-hoger');
    const radioLager = document.getElementById('radio-lager');
    const inzetInput = document.getElementById('inzet');
    const inzetError = document.getElementById('inzet-error');
    const gameOverMessage = document.getElementById('game-over-message');
    const btnNieuwSpel = document.getElementById('btn-nieuw-spel');
    
    // Result and history elements
    const resultMessage = document.getElementById('result-message');
    const historyBody = document.getElementById('history-body');
    const historyEmpty = document.getElementById('history-empty');
    const historyCount = document.getElementById('history-count');

    // ==========================================
    // Render Functions
    // ==========================================
    
    /**
     * Renders the computer's dice values and total.
     * Adds animation class for dice roll effect.
     * @param {Object} data - Object with computerDice array and computerTotal
     */
    function renderComputerState(data) {
        // Update dice values
        computerDie1.textContent = data.computerDice[0];
        computerDie2.textContent = data.computerDice[1];
        computerTotal.textContent = data.computerTotal;
        
        // Trigger roll animation
        computerDie1.classList.remove('rolled');
        computerDie2.classList.remove('rolled');
        
        // Force reflow to restart animation
        void computerDie1.offsetWidth;
        void computerDie2.offsetWidth;
        
        computerDie1.classList.add('rolled');
        computerDie2.classList.add('rolled');
    }
    
    /**
     * Renders the player's dice values and total.
     * Adds animation class for dice roll effect.
     * @param {Object} data - Object with playerDice array and playerTotal
     */
    function renderPlayerState(data) {
        // Update dice values
        playerDie1.textContent = data.playerDice[0];
        playerDie2.textContent = data.playerDice[1];
        playerTotal.textContent = data.playerTotal;
        
        // Trigger roll animation
        playerDie1.classList.remove('rolled');
        playerDie2.classList.remove('rolled');
        
        // Force reflow to restart animation
        void playerDie1.offsetWidth;
        void playerDie2.offsetWidth;
        
        playerDie1.classList.add('rolled');
        playerDie2.classList.add('rolled');
    }
    
    /**
     * Clears the player's dice display to initial state.
     * Used when starting a new round.
     */
    function clearPlayerDice() {
        playerDie1.textContent = '–';
        playerDie2.textContent = '–';
        playerTotal.textContent = '0';
        playerDie1.classList.remove('rolled');
        playerDie2.classList.remove('rolled');
    }
    
    /**
     * Clears all dice displays to initial state.
     * Used when resetting the game.
     */
    function clearAllDice() {
        computerDie1.textContent = '–';
        computerDie2.textContent = '–';
        computerTotal.textContent = '0';
        computerDie1.classList.remove('rolled');
        computerDie2.classList.remove('rolled');
        
        clearPlayerDice();
    }
    
    /**
     * Updates the saldo display with the new value.
     * @param {number} newSaldo - The new saldo value to display
     */
    function renderSaldo(newSaldo) {
        saldoWaarde.textContent = newSaldo;
    }
    
    /**
     * Renders the result message after a round is resolved.
     * Shows green message for win, red for loss.
     * @param {Object} outcome - The outcome object from rollPlayerAndResolve()
     */
    function renderResultMessage(outcome) {
        const isWin = outcome.result === 'win';
        const predictionText = outcome.prediction === 'hoger' ? 'Hoger' : 'Lager';
        
        let message;
        if (isWin) {
            message = `🎉 Gewonnen! Jij had ${outcome.playerTotal}, de computer ${outcome.computerTotal}. ` +
                      `(Keuze: ${predictionText}, +${outcome.bet} credits)`;
        } else {
            message = `😢 Verloren... Jij had ${outcome.playerTotal}, de computer ${outcome.computerTotal}. ` +
                      `(Keuze: ${predictionText}, -${outcome.bet} credits)`;
        }
        
        // Clear existing content completely before creating new message
        while (resultMessage.firstChild) {
            resultMessage.removeChild(resultMessage.firstChild);
        }
        resultMessage.innerHTML = '';
        
        // Create new message element
        const messageEl = document.createElement('p');
        messageEl.className = `result-message ${isWin ? 'result-message--win' : 'result-message--lose'}`;
        messageEl.textContent = message;
        
        // Add to container
        resultMessage.appendChild(messageEl);
        resultMessage.classList.add('has-message');
    }
    
    /**
     * Clears the result message area.
     * Removes all content immediately to prevent old messages from showing.
     */
    function clearResultMessage() {
        // Remove all child elements first
        while (resultMessage.firstChild) {
            resultMessage.removeChild(resultMessage.firstChild);
        }
        
        // Clear all content methods to ensure complete removal
        resultMessage.innerHTML = '';
        resultMessage.textContent = '';
        
        // Force a reflow to ensure the clearing is visible immediately
        void resultMessage.offsetHeight;
        
        // Add a class to ensure it's visually cleared (if needed for CSS)
        resultMessage.classList.remove('has-message');
    }
    
    /**
     * Renders the history table with the latest rounds.
     * Shows newest rounds at the top.
     * @param {Array} historyArray - Array of history entry objects
     */
    function renderHistory(historyArray) {
        // Clear existing rows
        historyBody.innerHTML = '';
        
        // Update history count
        const count = historyArray.length;
        if (historyCount) {
            historyCount.textContent = `${count} ${count === 1 ? 'ronde' : 'rondes'}`;
        }
        
        if (historyArray.length === 0) {
            historyEmpty.style.display = 'block';
            if (historyCount) {
                historyCount.textContent = '0 rondes';
            }
            return;
        }
        
        historyEmpty.style.display = 'none';
        
        // Create rows for each history entry
        historyArray.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            const isWin = entry.result === 'win';
            const resultSymbol = isWin ? '✓' : '✗';
            const resultClass = isWin ? 'result-win' : 'result-lose';
            const predictionText = entry.prediction === 'hoger' ? 'Hoger' : 'Lager';
            
            // Add special class for the newest (first) row
            if (index === 0) {
                row.classList.add('newest-round');
            }
            
            row.innerHTML = `
                <td class="mono" style="font-weight: 600;">${entry.roundNumber}</td>
                <td class="mono">${entry.computerTotal}</td>
                <td class="mono">${entry.playerTotal}</td>
                <td style="font-weight: 500;">${predictionText}</td>
                <td class="${resultClass}">${resultSymbol}</td>
                <td class="mono">${entry.saldoAfter}</td>
            `;
            
            historyBody.appendChild(row);
        });
    }
    
    /**
     * Shows an error message under the inzet input.
     * @param {string} message - The error message to display
     */
    function showBetError(message) {
        inzetError.textContent = message;
        inzetInput.style.borderColor = 'var(--danger)';
    }
    
    /**
     * Clears the error message under the inzet input.
     */
    function clearBetError() {
        inzetError.textContent = '';
        inzetInput.style.borderColor = '';
    }
    
    /**
     * Shows the game over message and "Nieuw spel" button.
     */
    function showGameOverMessage() {
        gameOverMessage.textContent = 'Game Over – saldo is op!';
        gameOverMessage.classList.add('show');
        btnNieuwSpel.style.display = 'inline-block';
    }
    
    /**
     * Hides the game over message and "Nieuw spel" button.
     */
    function clearGameOverMessage() {
        gameOverMessage.textContent = '';
        gameOverMessage.classList.remove('show');
        btnNieuwSpel.style.display = 'none';
    }
    
    /**
     * Sets button states for a new round.
     * Computer button enabled, Speler button disabled.
     */
    function setButtonsForNewRound() {
        const gameOver = HogerLagerGame.isGameOver();
        
        btnComputer.disabled = gameOver;
        btnSpeler.disabled = true;
        
        // Enable/disable inputs based on game over state
        inzetInput.disabled = gameOver;
        radioHoger.disabled = gameOver;
        radioLager.disabled = gameOver;
    }
    
    /**
     * Sets button states after computer has rolled.
     * Both buttons may be enabled depending on game state.
     */
    function setButtonsAfterComputerRoll() {
        btnComputer.disabled = false; // Allow re-roll before player rolls
        btnSpeler.disabled = false;
    }

    // ==========================================
    // Event Handlers
    // ==========================================
    
    /**
     * Handles the "Computer gooien" button click.
     * Starts a new round by rolling computer dice.
     */
    function handleComputerRoll() {
        // Check if game is over
        if (HogerLagerGame.isGameOver()) {
            return;
        }
        
        // Clear previous messages and errors FIRST, before anything else
        clearResultMessage();
        clearBetError();
        
        // Clear player dice for new round
        clearPlayerDice();
        
        // Roll computer dice via model
        const computerData = HogerLagerGame.startNewRoundWithComputerRoll();
        
        // Render computer dice and total
        renderComputerState(computerData);
        
        // Enable speler button now that computer has rolled
        setButtonsAfterComputerRoll();
        
        // Ensure result message is still cleared (double-check)
        clearResultMessage();
    }
    
    /**
     * Handles the "Speler gooien" button click.
     * Validates bet, rolls player dice, and resolves the round.
     */
    function handlePlayerRoll() {
        // Check if computer has rolled first
        if (!HogerLagerGame.hasComputerRolled()) {
            showBetError('De computer moet eerst gooien!');
            return;
        }
        
        // Get current prediction selection
        const prediction = radioHoger.checked ? 'hoger' : 'lager';
        
        // Get and parse inzet value
        const inzetValue = inzetInput.value.trim();
        
        // Validate input is not empty
        if (inzetValue === '') {
            showBetError('Voer een inzet in.');
            return;
        }
        
        const betAmount = parseInt(inzetValue, 10);
        
        // Validate it's a valid number
        if (isNaN(betAmount)) {
            showBetError('Voer een geldig getal in.');
            return;
        }
        
        // Set bet and prediction in model (with validation)
        const validationResult = HogerLagerGame.setBetAndPrediction(betAmount, prediction);
        
        if (!validationResult.success) {
            showBetError(validationResult.error);
            return;
        }
        
        // Clear any previous errors
        clearBetError();
        
        // Roll player dice and resolve round
        const outcome = HogerLagerGame.rollPlayerAndResolve();
        
        // Render player dice
        renderPlayerState(outcome);
        
        // Update saldo display
        renderSaldo(outcome.saldoAfter);
        
        // Show result message
        renderResultMessage(outcome);
        
        // Update history
        renderHistory(HogerLagerGame.history);
        
        // Check for game over
        if (outcome.saldoAfter <= 0) {
            btnComputer.disabled = true;
            btnSpeler.disabled = true;
            inzetInput.disabled = true;
            radioHoger.disabled = true;
            radioLager.disabled = true;
            showGameOverMessage();
        } else {
            // Prepare for next round
            setButtonsForNewRound();
        }
    }
    
    /**
     * Handles the "Nieuw spel" button click.
     * Resets the game to initial state.
     */
    function handleNewGame() {
        // Reset game model
        HogerLagerGame.resetGame();
        
        // Clear all UI elements
        clearAllDice();
        clearResultMessage();
        clearBetError();
        clearGameOverMessage();
        
        // Reset saldo display
        renderSaldo(100);
        
        // Reset inzet input
        inzetInput.value = '10';
        inzetInput.disabled = false;
        
        // Reset prediction to default
        radioHoger.checked = true;
        radioLager.checked = false;
        radioHoger.disabled = false;
        radioLager.disabled = false;
        
        // Clear history
        renderHistory([]);
        
        // Reset buttons
        setButtonsForNewRound();
    }

    // ==========================================
    // Initialize UI and Attach Event Listeners
    // ==========================================
    
    /**
     * Initializes the game UI to default state on page load.
     */
    function initializeUI() {
        // Set initial dice displays
        clearAllDice();
        
        // Set initial saldo
        renderSaldo(HogerLagerGame.saldo);
        
        // Set default prediction
        radioHoger.checked = true;
        
        // Set default inzet
        inzetInput.value = HogerLagerGame.lastBet;
        
        // Clear messages
        clearResultMessage();
        clearBetError();
        clearGameOverMessage();
        
        // Clear history
        renderHistory([]);
        
        // Set initial button states
        setButtonsForNewRound();
    }
    
    // Attach event listeners
    btnComputer.addEventListener('click', handleComputerRoll);
    btnSpeler.addEventListener('click', handlePlayerRoll);
    btnNieuwSpel.addEventListener('click', handleNewGame);
    
    // Initialize the UI
    initializeUI();
    
    // Log initialization for debugging
    console.log('🎲 Hoger / Lager – Dobbelspel initialized!');
});

