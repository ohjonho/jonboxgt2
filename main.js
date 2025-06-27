/**
 * Trivia Murder Party - Streamlined Main Logic
 * Essential game functionality without bloat
 */

// ========================================
// MINIGAME CONTROLLER
// ========================================

const MinigameController = {
    start(minigameName) {
        switch (minigameName) {
            case 'hunting':
                MinigameController.showHuntingSeason();
                break;
            case 'quantum':
                MinigameController.showQuantumLeap();
                break;
            case 'resource':
                MinigameController.showResourceRace();
                break;
            case 'dice':
                MinigameController.showDiceDuel();
                break;
            case 'codebreaker':
                MinigameController.showCodebreaker();
                break;
            default:
                MinigameController.showHuntingSeason();
        }
    },

    showHuntingSeason() {
        ScreenManager.show('huntingSeasonScreen');
        gameState.minigameSelections.clear();
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        // Use modular UI if available, otherwise fallback to original
        if (window.minigamesUI && window.minigamesUI.buildHuntingSeasonUI) {
            window.minigamesUI.buildHuntingSeasonUI(gameState, DOM, (index) => {
                if (!gameState.minigameSelections.has(gameState.currentPlayer.id)) {
                    gameState.minigameSelections.set(gameState.currentPlayer.id, index);
                    Utils.log(`Player selected square ${index + 1}`, 'success');
                    
                    // Update game state if online and host
                    if (isHostAndOnline()) {
                        updateGameStateInDB(gameState);
                    }
                    
                    MinigameController.simulateAIMinigameSelections();
                    setTimeout(() => MinigameController.processMinigameResults(), 1500);
                }
            });
        } else {
            // Fallback to original implementation
            MinigameController.updateHuntingPlayerStatus();
            MinigameController.createHuntingGrid();
        }
        
        TimerManager.start('huntingTimer', CONFIG.TIMER_DURATION.hunting, () => {
            if (!gameState.minigameSelections.has(gameState.currentPlayer.id)) {
                const randomSquare = Math.floor(Math.random() * CONFIG.GRID_SIZE);
                gameState.minigameSelections.set(gameState.currentPlayer.id, randomSquare);
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                MinigameController.simulateAIMinigameSelections();
                setTimeout(() => MinigameController.processMinigameResults(), 1500);
            }
        });
    },

    updateHuntingPlayerStatus() {
        const huntingPlayerStatus = DOM.get('huntingPlayerStatus');
        if (!huntingPlayerStatus) return;
        
        const fragment = document.createDocumentFragment();
        
        const winnersDiv = document.createElement('div');
        winnersDiv.innerHTML = '<h4>🏹 Hunters (Winners):</h4>';
        const winnersContainer = document.createElement('div');
        
        const losersDiv = document.createElement('div');
        losersDiv.innerHTML = '<h4>🎯 Hunted (Losers):</h4>';
        const losersContainer = document.createElement('div');
        
        gameState.players.forEach(player => {
            const status = gameState.playerStatus.get(player.id);
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<span>${player.name}</span><span>${player.score} pts</span>`;
            
            if (status === 'W') {
                div.style.background = 'rgba(0, 184, 148, 0.3)';
                winnersContainer.appendChild(div);
            } else if (status === 'L') {
                div.style.background = 'rgba(225, 112, 85, 0.3)';
                losersContainer.appendChild(div);
            }
        });
        
        fragment.appendChild(winnersDiv);
        fragment.appendChild(winnersContainer);
        fragment.appendChild(losersDiv);
        fragment.appendChild(losersContainer);
        
        huntingPlayerStatus.innerHTML = '';
        huntingPlayerStatus.appendChild(fragment);
    },

    createHuntingGrid() {
        const huntingGrid = DOM.get('huntingGrid');
        if (!huntingGrid) return;
        
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = i + 1;
            cell.onclick = () => MinigameController.selectHuntingSquare(i);
            fragment.appendChild(cell);
        }
        
        huntingGrid.innerHTML = '';
        huntingGrid.appendChild(fragment);
    },

    selectHuntingSquare(index) {
        if (gameState.minigameSelections.has(gameState.currentPlayer.id)) return;
        
        DOM.getAll('#huntingGrid .grid-cell').forEach(cell => cell.classList.remove('selected'));
        const selectedCell = DOM.getAll('#huntingGrid .grid-cell')[index];
        if (selectedCell) {
            selectedCell.classList.add('selected');
        }
        
        gameState.minigameSelections.set(gameState.currentPlayer.id, index);
        Utils.log(`Player selected square ${index + 1}`, 'success');
        
        MinigameController.simulateAIMinigameSelections();
        setTimeout(() => MinigameController.processMinigameResults(), 1500);
    },

    simulateAIMinigameSelections() {
        gameState.players.forEach(player => {
            if (player.id !== gameState.currentPlayer.id && !gameState.minigameSelections.has(player.id)) {
                let choice;
                if (player.difficulty === 'hard') {
                    const avoidSquares = [0, 3, 12, 15, 5, 6, 9, 10];
                    const safeSquares = Array.from({length: CONFIG.GRID_SIZE}, (_, i) => i).filter(i => !avoidSquares.includes(i));
                    choice = Utils.getRandomElement(safeSquares);
                } else if (player.difficulty === 'easy') {
                    choice = Math.floor(Math.random() * CONFIG.GRID_SIZE);
                } else {
                    choice = Math.floor(Math.random() * CONFIG.GRID_SIZE);
                    if (Math.random() < 0.3) {
                        const edgeSquares = [1, 2, 4, 7, 8, 11, 13, 14];
                        choice = Utils.getRandomElement(edgeSquares);
                    }
                }
                
                gameState.minigameSelections.set(player.id, choice);
            }
        });
    },

    processMinigameResults() {
        const results = [];
        const winnerSelections = new Map();
        const loserSelections = new Map();
        
        gameState.players.forEach(player => {
            const selection = gameState.minigameSelections.get(player.id);
            const status = gameState.playerStatus.get(player.id);
            
            if (status === 'W') {
                winnerSelections.set(player.id, selection);
            } else if (status === 'L') {
                loserSelections.set(player.id, selection);
            }
        });
        
        winnerSelections.forEach((winnerSquare, winnerId) => {
            loserSelections.forEach((loserSquare, loserId) => {
                if (winnerSquare === loserSquare) {
                    const winner = gameState.players.find(p => p.id === winnerId);
                    const loser = gameState.players.find(p => p.id === loserId);
                    
                    if (loser.score > 0) {
                        loser.score -= 1;
                        winner.score += 1;
                        winner.pointsStolen = (winner.pointsStolen || 0) + 1;
                        results.push(`${winner.name} caught ${loser.name} on square ${winnerSquare + 1}! (1 point stolen)`);
                    } else {
                        winner.score += 1;
                        winner.pointsStolen = (winner.pointsStolen || 0) + 1;
                        results.push(`${winner.name} caught ${loser.name} on square ${winnerSquare + 1}! (1 point gained)`);
                    }
                }
            });
        });
        
        if (results.length === 0) {
            results.push('No collisions! All players escaped safely.');
        }
        
        MinigameController.showMinigameResults(results, winnerSelections, loserSelections);
    },

    showMinigameResults(results, winnerSelections, loserSelections) {
        ScreenManager.show('minigameResultsScreen');
        
        const minigameResults = DOM.get('minigameResults');
        if (!minigameResults) return;
        
        const fragment = document.createDocumentFragment();
        
        const gridContainer = document.createElement('div');
        gridContainer.innerHTML = '<h3>Final Grid Results:</h3>';
        
        const resultGrid = document.createElement('div');
        resultGrid.className = 'grid';
        resultGrid.style.margin = '15px auto';
        
        for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = i + 1;
            
            const winnerHere = Array.from(winnerSelections.entries()).find(([_, square]) => square === i);
            const loserHere = Array.from(loserSelections.entries()).find(([_, square]) => square === i);
            
            if (winnerHere && loserHere) {
                cell.classList.add('collision');
                cell.textContent = '💥';
            } else if (winnerHere) {
                cell.classList.add('winner');
                cell.textContent = '🏹';
            } else if (loserHere) {
                cell.classList.add('loser');
                cell.textContent = '🎯';
            }
            
            resultGrid.appendChild(cell);
        }
        
        gridContainer.appendChild(resultGrid);
        fragment.appendChild(gridContainer);
        
        const resultsHeader = document.createElement('h3');
        resultsHeader.textContent = 'Hunt Results:';
        fragment.appendChild(resultsHeader);
        
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'highlight';
            resultDiv.style.fontSize = '0.9rem';
            resultDiv.textContent = result;
            fragment.appendChild(resultDiv);
        });
        
        minigameResults.innerHTML = '';
        minigameResults.appendChild(fragment);
        
        gameState.minigameSelections.clear();
    },

    // Simplified implementations for other minigames
    showQuantumLeap() {
        ScreenManager.show('quantumLeapScreen');
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        if (window.minigamesUI && window.minigamesUI.buildQuantumLeapUI) {
            window.minigamesUI.buildQuantumLeapUI(gameState, DOM, (leapPos) => {
                gameState.quantumPositions.set(gameState.currentPlayer.id, leapPos);
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                setTimeout(() => MinigameController.processQuantumResults(), 1000);
            }, 1);
        }
        
        TimerManager.start('quantumTimer', CONFIG.TIMER_DURATION.quantum, () => {
            if (!gameState.quantumPositions.has(gameState.currentPlayer.id)) {
                const rand = Math.floor(Math.random() * 10) + 1;
                gameState.quantumPositions.set(gameState.currentPlayer.id, rand);
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                setTimeout(() => MinigameController.processQuantumResults(), 1000);
            }
        });
    },

    processQuantumResults() {
        MinigameController.showMinigameResults(['Quantum Leap completed!'], new Map(), new Map());
    },

    showResourceRace() {
        ScreenManager.show('resourceRaceScreen');
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        if (window.minigamesUI && window.minigamesUI.buildResourceRaceUI) {
            window.minigamesUI.buildResourceRaceUI(gameState, DOM, (allocations) => {
                gameState.resourceData.set(gameState.currentPlayer.id, allocations);
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                setTimeout(() => MinigameController.processResourceResults(), 1000);
            });
        }
        
        TimerManager.start('resourceTimer', CONFIG.TIMER_DURATION.resource, () => {
            if (!gameState.resourceData.has(gameState.currentPlayer.id)) {
                gameState.resourceData.set(gameState.currentPlayer.id, { build: 10 });
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                MinigameController.processResourceResults();
            }
        });
    },

    processResourceResults() {
        MinigameController.showMinigameResults(['Resource Race completed!'], new Map(), new Map());
    },

    showDiceDuel() {
        ScreenManager.show('diceDuelScreen');
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        if (window.minigamesUI && window.minigamesUI.buildDiceDuelUI) {
            window.minigamesUI.buildDiceDuelUI(gameState, DOM, (diceData) => {
                gameState.diceData.set(gameState.currentPlayer.id, diceData);
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                setTimeout(() => MinigameController.processDiceResults(), 1000);
            });
        }
        
        TimerManager.start('diceTimer', CONFIG.TIMER_DURATION.dice, () => {
            if (!gameState.diceData.has(gameState.currentPlayer.id)) {
                gameState.diceData.set(gameState.currentPlayer.id, { diceCount: 1, bet: 0 });
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                MinigameController.processDiceResults();
            }
        });
    },

    processDiceResults() {
        MinigameController.showMinigameResults(['Dice Duel completed!'], new Map(), new Map());
    },

    showCodebreaker() {
        ScreenManager.show('codebreakerScreen');
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        if (window.minigamesUI && window.minigamesUI.buildCodebreakerUI) {
            window.minigamesUI.buildCodebreakerUI(gameState, DOM, (guess) => {
                gameState.codeData.attempts.push([...guess]);
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                setTimeout(() => MinigameController.processCodebreakerResults(), 1000);
            });
        }
        
        TimerManager.start('codeTimer', CONFIG.TIMER_DURATION.code, () => {
            if (gameState.codeData.attempts.length === 0) {
                gameState.codeData.attempts.push(['🔴', '🟡', '🟢', '🔵']);
                
                // Update game state if online and host
                if (isHostAndOnline()) {
                    updateGameStateInDB(gameState);
                }
                
                MinigameController.processCodebreakerResults();
            }
        });
    },

    processCodebreakerResults() {
        MinigameController.showMinigameResults(['Codebreaker completed!'], new Map(), new Map());
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.MinigameController = MinigameController;
}

// Fallback for isHostAndOnline function if not available from multiplayer module
if (typeof window.isHostAndOnline === 'undefined') {
    window.isHostAndOnline = function() {
        return gameState.isHost && gameState.connectionStatus === 'online';
    };
}

// Fallback for updateGameStateInDB function if not available from multiplayer module
if (typeof window.updateGameStateInDB === 'undefined') {
    window.updateGameStateInDB = function(newState) {
        // No-op fallback
        console.log('updateGameStateInDB not available, skipping sync');
    };
}