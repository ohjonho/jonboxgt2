/**
 * Trivia Murder Party - UI Management
 * Handles all UI-related functionality, screens, and DOM operations
 */

// ========================================
// MODAL MANAGEMENT
// ========================================

const ModalManager = {
    showUsernameModal() {
        const modal = DOM.get('usernameModal');
        if (modal) {
            modal.classList.add('active');
            const input = DOM.get('usernameModalInput');
            if (input) {
                input.focus();
                input.value = '';
            }
        }
    },

    closeUsernameModal() {
        const modal = DOM.get('usernameModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    showJoinScreen() {
        ScreenManager.show('joinRoomScreen');
        const roomInput = DOM.get('roomCodeInput');
        if (roomInput) {
            roomInput.focus();
        }
    },

    showHomeScreen() {
        ScreenManager.show('homeScreen');
    }
};

// ========================================
// PLAYER MANAGEMENT UI
// ========================================

const PlayerManager = {
    showLobby() {
        ScreenManager.show('lobbyScreen');
        
        DOM.setText('roomCodeDisplay', gameState.room);
        PlayerManager.updatePlayerList();
        PlayerManager.updateStartButton();
        PlayerManager.updateQuestionStatus();
    },

    updatePlayerList() {
        const playerListEl = DOM.get('playerList');
        if (!playerListEl) return;
        
        const fragment = document.createDocumentFragment();
        
        const onlinePlayers = gameState.players.filter(p => p.isOnline !== false);
        const aiPlayers = gameState.players.filter(p => p.difficulty);
        
        const header = document.createElement('h3');
        
        if (gameState.supabaseSubscription && onlinePlayers.length > 0) {
            header.textContent = `🌐 Players (${gameState.players.length}/${CONFIG.MAX_PLAYERS})`;
            
            if (onlinePlayers.length > 0) {
                const onlineHeader = document.createElement('h4');
                onlineHeader.textContent = `Online Players (${onlinePlayers.length}):`;
                onlineHeader.style.marginTop = '10px';
                fragment.appendChild(onlineHeader);
                
                onlinePlayers.forEach(player => {
                    const div = document.createElement('div');
                    div.className = 'item';
                    
                    const isCurrentPlayer = player.id === gameState.currentPlayer?.id;
                    const hostIndicator = player.isHost ? ' 👑' : '';
                    
                    let statusHTML = '';
                    if (gameState.powerups.has(player.id)) {
                        statusHTML += '<span class="status powerup">💪</span>';
                    }
                    if (gameState.playerStatus.has(player.id)) {
                        const status = gameState.playerStatus.get(player.id);
                        statusHTML += `<span class="player-type ${status.toLowerCase()}">${status}</span>`;
                    }
                    
                    div.innerHTML = `
                        <span>${player.name}${isCurrentPlayer ? ' (You)' : ''}${hostIndicator}</span>
                        <span>${player.score || 0} pts ${statusHTML}</span>
                    `;
                    fragment.appendChild(div);
                });
            }
            
            if (aiPlayers.length > 0) {
                const aiHeader = document.createElement('h4');
                aiHeader.textContent = `AI Players (${aiPlayers.length}):`;
                aiHeader.style.marginTop = '10px';
                fragment.appendChild(aiHeader);
                
                aiPlayers.forEach(player => {
                    const div = document.createElement('div');
                    div.className = 'item';
                    
                    let statusHTML = '';
                    if (gameState.powerups.has(player.id)) {
                        statusHTML += '<span class="status powerup">💪</span>';
                    }
                    if (gameState.playerStatus.has(player.id)) {
                        const status = gameState.playerStatus.get(player.id);
                        statusHTML += `<span class="player-type ${status.toLowerCase()}">${status}</span>`;
                    }
                    
                    div.innerHTML = `
                        <span>${player.name}</span>
                        <span>${player.score} pts ${statusHTML}</span>
                    `;
                    fragment.appendChild(div);
                });
            }
        } else {
            header.textContent = `📴 Offline Players (${gameState.players.length}/${CONFIG.MAX_PLAYERS})`;
            
            gameState.players.forEach(player => {
                const div = document.createElement('div');
                div.className = 'item';
                
                let statusHTML = '';
                if (gameState.powerups.has(player.id)) {
                    statusHTML += '<span class="status powerup">💪</span>';
                }
                if (gameState.playerStatus.has(player.id)) {
                    const status = gameState.playerStatus.get(player.id);
                    statusHTML += `<span class="player-type ${status.toLowerCase()}">${status}</span>`;
                }
                
                const isCurrentPlayer = player.id === gameState.currentPlayer?.id;
                div.innerHTML = `
                    <span>${player.name}${isCurrentPlayer ? ' (You)' : ''}</span>
                    <span>${player.score} pts ${statusHTML}</span>
                `;
                fragment.appendChild(div);
            });
        }
        
        playerListEl.innerHTML = '';
        playerListEl.appendChild(header);
        playerListEl.appendChild(fragment);
    },

    updateStartButton() {
        const startBtn = DOM.get('startGameBtn');
        if (startBtn) {
            if (gameState.players.length >= CONFIG.MIN_PLAYERS) {
                startBtn.disabled = false;
                startBtn.textContent = 'Start Game';
            } else {
                startBtn.disabled = true;
                startBtn.textContent = `Start Game (${gameState.players.length}/${CONFIG.MIN_PLAYERS} players)`;
            }
        }
    },

    updateQuestionStatus() {
        try {
            const playerListEl = DOM.get('playerList');
            if (!playerListEl) return;
            
            const existingStatus = playerListEl.querySelector('.question-status');
            if (existingStatus) {
                existingStatus.remove();
            }
            
            const statusDiv = document.createElement('div');
            statusDiv.className = 'question-status';
            statusDiv.style.cssText = 'font-size: 0.9rem; opacity: 0.8; margin-top: 10px; text-align: center; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px;';
            
            const apiCount = gameState.apiQuestions?.length || 0;
            const backupCount = gameState.backupQuestions?.length || 0;
            const workingApis = STATIC_DATA.TRIVIA_APIS.filter(api => api.working === true).length;
            
            let statusText;
            if (apiCount > 0) {
                statusText = `🌐 ${apiCount} fresh questions loaded + ${backupCount} backup questions`;
            } else if (workingApis > 0) {
                statusText = `🌐 ${workingApis} APIs available + ${backupCount} backup questions`;
            } else {
                statusText = `📚 Using ${backupCount} backup questions (APIs unavailable)`;
            }
            
            statusDiv.textContent = statusText;
            playerListEl.appendChild(statusDiv);
        } catch (error) {
            Utils.log(`Error updating question status: ${error.message}`, 'warn');
        }
    }
};

// ========================================
// GAME CONTROLLER UI
// ========================================

const GameController = {
    showCategorySelection() {
        ScreenManager.show('categoryScreen');
        
        DOM.setText('currentRound', gameState.currentRound);
        gameState.flags.clear();
        
        const categoryOptions = DOM.get('categoryOptions');
        if (!categoryOptions) return;
        
        const shuffledCategories = Utils.shuffle(STATIC_DATA.CATEGORIES).slice(0, 4);
        const fragment = document.createDocumentFragment();
        
        shuffledCategories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = category;
            div.onclick = () => GameController.selectCategory(category);
            fragment.appendChild(div);
        });
        
        categoryOptions.innerHTML = '';
        categoryOptions.appendChild(fragment);
        
        TimerManager.start('categoryTimer', CONFIG.TIMER_DURATION.category, () => {
            if (!gameState.flags.has('categorySelected')) {
                GameController.selectCategory(Utils.getRandomElement(shuffledCategories));
            }
        });
    },

    selectCategory(category) {
        if (gameState.flags.has('categorySelected')) return;
        gameState.flags.add('categorySelected');
        
        DOM.getAll('#categoryOptions .option').forEach(opt => opt.classList.remove('selected'));
        event?.target?.classList.add('selected');
        
        Utils.log(`Category selected: ${category}`, 'success');
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        setTimeout(() => {
            gameState.currentScreen = 'questionScreen';
            if (isHostAndOnline()) {
                updateGameStateInDB(gameState);
            }
            GameController.generateQuestion(category);
        }, 1000);
    },

    generateQuestion(category) {
        const question = GameStateManager.getNextQuestion(category);
        if (question) {
            // Convert the question format to match what the UI expects
            gameState.currentQuestion = {
                question: question.question,
                answers: question.options,
                correct_answer: question.options[question.correct],
                category: question.category
            };
            
            // Update game state if online and host
            if (isHostAndOnline()) {
                updateGameStateInDB(gameState);
            }
            
            GameController.showQuestion();
        } else {
            Utils.log('No question available for category', 'error');
            GameController.showQuestion();
        }
    },

    showQuestion() {
        ScreenManager.show('questionScreen');
        
        const question = gameState.currentQuestion;
        if (!question) return;
        
        DOM.setText('questionRound', gameState.currentRound);
        DOM.setText('questionText', question.question);
        
        const answerOptions = DOM.get('answerOptions');
        if (!answerOptions) return;
        
        const shuffledAnswers = Utils.shuffle([...question.answers]);
        const fragment = document.createDocumentFragment();
        
        shuffledAnswers.forEach((answer, index) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = answer;
            div.onclick = () => GameController.selectAnswer(index);
            fragment.appendChild(div);
        });
        
        answerOptions.innerHTML = '';
        answerOptions.appendChild(fragment);
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        TimerManager.start('questionTimer', CONFIG.TIMER_DURATION.question, () => {
            if (!gameState.flags.has('answerSelected')) {
                GameController.selectAnswer(Math.floor(Math.random() * 4));
            }
        });
    },

    selectAnswer(index) {
        if (gameState.flags.has('answerSelected')) return;
        gameState.flags.add('answerSelected');
        
        const selectedAnswer = gameState.currentQuestion.answers[index];
        gameState.playerAnswers.set(gameState.currentPlayer.id, selectedAnswer);
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        setTimeout(() => {
            gameState.currentScreen = 'answersScreen';
            if (isHostAndOnline()) {
                updateGameStateInDB(gameState);
            }
            GameController.processAnswers();
        }, 1000);
    },

    processAnswers() {
        const question = gameState.currentQuestion;
        const correctAnswer = question.correct_answer;
        
        gameState.players.forEach(player => {
            const playerAnswer = gameState.playerAnswers.get(player.id);
            if (playerAnswer === correctAnswer) {
                player.score += 1;
                player.correctAnswers += 1;
            }
        });
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        GameController.distributePowerups();
        GameController.showAnswers();
    },

    distributePowerups() {
        const winners = gameState.players.filter(player => 
            gameState.playerAnswers.get(player.id) === gameState.currentQuestion.correct_answer
        );
        
        if (winners.length > 0) {
            const randomWinner = Utils.getRandomElement(winners);
            gameState.powerups.set(randomWinner.id, true);
            Utils.log(`${randomWinner.name} got a powerup!`, 'success');
        }
    },

    showAnswers() {
        ScreenManager.show('answersScreen');
        
        const question = gameState.currentQuestion;
        const answersDisplay = DOM.get('answersDisplay');
        if (!answersDisplay) return;
        
        const fragment = document.createDocumentFragment();
        
        const correctAnswer = question.correct_answer;
        const header = document.createElement('h3');
        header.textContent = `Correct Answer: ${correctAnswer}`;
        header.style.color = '#00b894';
        fragment.appendChild(header);
        
        gameState.players.forEach(player => {
            const div = document.createElement('div');
            div.className = 'item';
            
            const playerAnswer = gameState.playerAnswers.get(player.id);
            const isCorrect = playerAnswer === correctAnswer;
            const hasPowerup = gameState.powerups.has(player.id);
            
            if (isCorrect) {
                div.classList.add('correct');
                div.innerHTML = `
                    <span>${player.name} ✅</span>
                    <span>+1 point ${hasPowerup ? '💪' : ''}</span>
                `;
            } else {
                div.classList.add('incorrect');
                div.innerHTML = `
                    <span>${player.name} ❌</span>
                    <span>${playerAnswer || 'No answer'} ${hasPowerup ? '💪' : ''}</span>
                `;
            }
            
            fragment.appendChild(div);
        });
        
        answersDisplay.innerHTML = '';
        answersDisplay.appendChild(fragment);
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
    },

    showScoreboard() {
        ScreenManager.show('scoreboardScreen');
        
        const scoreboard = DOM.get('scoreboard');
        if (!scoreboard) return;
        
        const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
        const fragment = document.createDocumentFragment();
        
        sortedPlayers.forEach((player, index) => {
            const div = document.createElement('div');
            div.className = 'item';
            
            const rank = index + 1;
            const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            const hasPowerup = gameState.powerups.has(player.id);
            
            div.innerHTML = `
                <span>${rankEmoji} ${player.name} ${hasPowerup ? '💪' : ''}</span>
                <span>${player.score} pts</span>
            `;
            
            if (rank === 1) div.classList.add('winner');
            fragment.appendChild(div);
        });
        
        scoreboard.innerHTML = '';
        scoreboard.appendChild(fragment);
        
        // Update game state if online
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
    },

    showFinalRound() {
        ScreenManager.show('finalRoundScreen');
        
        // Update game state before showing final round
        gameState.currentScreen = 'finalRoundScreen';
        gameState.flags.clear();
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        const finalQuestion = STATIC_DATA.FINAL_ROUND_QUESTION;
        DOM.setText('finalQuestionText', finalQuestion.question);
        
        const finalOptions = DOM.get('finalOptions');
        if (!finalOptions) return;
        
        const fragment = document.createDocumentFragment();
        finalQuestion.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = option;
            div.onclick = () => GameController.selectFinalAnswer(index);
            fragment.appendChild(div);
        });
        
        finalOptions.innerHTML = '';
        finalOptions.appendChild(fragment);
        
        TimerManager.start('finalTimer', CONFIG.TIMER_DURATION.final, () => {
            if (!gameState.flags.has('finalAnswerSelected')) {
                GameController.selectFinalAnswer(Math.floor(Math.random() * finalQuestion.options.length));
            }
        });
    },

    selectFinalAnswer(index) {
        if (gameState.flags.has('finalAnswerSelected')) return;
        gameState.flags.add('finalAnswerSelected');
        
        const finalQuestion = STATIC_DATA.FINAL_ROUND_QUESTION;
        const selectedAnswer = finalQuestion.options[index];
        
        if (!gameState.finalAnswers.has(gameState.currentPlayer.id)) {
            gameState.finalAnswers.set(gameState.currentPlayer.id, []);
        }
        
        const playerAnswers = gameState.finalAnswers.get(gameState.currentPlayer.id);
        if (!playerAnswers.includes(selectedAnswer)) {
            playerAnswers.push(selectedAnswer);
        }
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        setTimeout(() => {
            gameState.currentScreen = 'finalAnswersScreen';
            if (isHostAndOnline()) {
                updateGameStateInDB(gameState);
            }
            GameController.processFinalAnswers();
        }, 1000);
    },

    processFinalAnswers() {
        const finalQuestion = STATIC_DATA.FINAL_ROUND_QUESTION;
        const correctAnswers = finalQuestion.correct;
        
        gameState.players.forEach(player => {
            const playerAnswers = gameState.finalAnswers.get(player.id) || [];
            const correctCount = playerAnswers.filter(answer => 
                correctAnswers.includes(finalQuestion.options.indexOf(answer))
            ).length;
            
            if (correctCount === correctAnswers.length) {
                player.score += CONFIG.POINTS.finalFull;
            } else if (correctCount > 0) {
                player.score += CONFIG.POINTS.finalPartial;
            }
        });
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        GameController.showFinalAnswers();
    },

    showFinalAnswers() {
        ScreenManager.show('finalAnswersScreen');
        
        // Update game state before showing final answers
        gameState.currentScreen = 'finalAnswersScreen';
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        const finalAnswersDisplay = DOM.get('finalAnswersDisplay');
        if (!finalAnswersDisplay) return;
        
        const fragment = document.createDocumentFragment();
        
        const finalQuestion = STATIC_DATA.FINAL_ROUND_QUESTION;
        const correctAnswers = finalQuestion.correct;
        const header = document.createElement('h3');
        header.textContent = `Correct Answers: ${correctAnswers.map(i => finalQuestion.options[i]).join(', ')}`;
        header.style.color = '#00b894';
        fragment.appendChild(header);
        
        gameState.players.forEach(player => {
            const div = document.createElement('div');
            div.className = 'item';
            
            const playerAnswers = gameState.finalAnswers.get(player.id) || [];
            const correctCount = playerAnswers.filter(answer => 
                correctAnswers.includes(finalQuestion.options.indexOf(answer))
            ).length;
            
            if (correctCount === correctAnswers.length) {
                div.classList.add('correct');
                div.innerHTML = `
                    <span>${player.name} ✅</span>
                    <span>+${CONFIG.POINTS.finalFull} points</span>
                `;
            } else if (correctCount > 0) {
                div.classList.add('partially-correct');
                div.innerHTML = `
                    <span>${player.name} ⚪</span>
                    <span>+${CONFIG.POINTS.finalPartial} points</span>
                `;
            } else {
                div.classList.add('incorrect');
                div.innerHTML = `
                    <span>${player.name} ❌</span>
                    <span>0 points</span>
                `;
            }
            
            fragment.appendChild(div);
        });
        
        finalAnswersDisplay.innerHTML = '';
        finalAnswersDisplay.appendChild(fragment);
    },

    showFinalResults() {
        ScreenManager.show('finalResultsScreen');
        
        const finalScoreboard = DOM.get('finalScoreboard');
        if (!finalScoreboard) return;
        
        const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
        const fragment = document.createDocumentFragment();
        
        sortedPlayers.forEach((player, index) => {
            const div = document.createElement('div');
            div.className = 'item';
            
            let rank = '';
            if (index === 0) rank = '🥇';
            else if (index === 1) rank = '🥈';
            else if (index === 2) rank = '🥉';
            else rank = `${index + 1}.`;
            
            div.innerHTML = `
                <span>${rank} ${player.name}</span>
                <span>${player.score} pts</span>
            `;
            
            if (index === 0) {
                div.classList.add('winner');
            }
            
            fragment.appendChild(div);
        });
        
        finalScoreboard.innerHTML = '';
        finalScoreboard.appendChild(fragment);
    },

    nextRound() {
        if (gameState.currentRound <= CONFIG.FINAL_ROUND) {
            GameController.showCategorySelection();
        } else {
            GameController.showFinalRound();
        }
    },

    playAgain() {
        // Update game state before resetting
        gameState.currentScreen = 'homeScreen';
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        GameStateManager.reset();
        ScreenManager.show('homeScreen');
    }
};

// ========================================
// EVENT LISTENER SETUP
// ========================================

const EventManager = {
    initialize() {
        this.setupHomeScreenEvents();
        this.setupJoinScreenEvents();
        this.setupLobbyEvents();
        this.setupModalEvents();
        this.setupGameEvents();
        this.setupMinigameEvents();
        
        Utils.log('Event listeners initialized', 'success');
    },

    setupHomeScreenEvents() {
        const createRoomBtn = DOM.get('createRoomBtn');
        const joinRoomBtn = DOM.get('joinRoomBtn');
        
        if (createRoomBtn) {
            createRoomBtn.onclick = () => ModalManager.showUsernameModal();
        }
        
        if (joinRoomBtn) {
            joinRoomBtn.onclick = () => ModalManager.showJoinScreen();
        }
    },

    setupJoinScreenEvents() {
        const joinGameBtn = DOM.get('joinGameBtn');
        const backToHomeBtn = DOM.get('backToHomeBtn');
        const roomCodeInput = DOM.get('roomCodeInput');
        const usernameInput = DOM.get('usernameInput');
        
        if (joinGameBtn) {
            joinGameBtn.onclick = () => {
                const roomCode = roomCodeInput?.value?.trim()?.toUpperCase();
                const username = usernameInput?.value?.trim();
                
                if (!roomCode || roomCode.length !== 6) {
                    alert('Please enter a valid 6-character room code.');
                    return;
                }
                if (!username) {
                    alert('Please enter your username.');
                    return;
                }
                
                gameState.pendingUsername = username;
                MultiplayerManager.joinRoom();
            };
        }
        
        if (backToHomeBtn) {
            backToHomeBtn.onclick = () => ModalManager.showHomeScreen();
        }
        
        // Enter key support
        if (roomCodeInput) {
            roomCodeInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    usernameInput?.focus();
                }
            };
        }
        
        if (usernameInput) {
            usernameInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    joinGameBtn?.click();
                }
            };
        }
    },

    setupLobbyEvents() {
        const addEasyAIBtn = DOM.get('addEasyAIBtn');
        const addMediumAIBtn = DOM.get('addMediumAIBtn');
        const addHardAIBtn = DOM.get('addHardAIBtn');
        const shareRoomBtn = DOM.get('shareRoomBtn');
        const startGameBtn = DOM.get('startGameBtn');
        const leaveRoomBtn = DOM.get('leaveRoomBtn');
        
        if (addEasyAIBtn) {
            addEasyAIBtn.onclick = () => this.addAI('easy');
        }
        
        if (addMediumAIBtn) {
            addMediumAIBtn.onclick = () => this.addAI('medium');
        }
        
        if (addHardAIBtn) {
            addHardAIBtn.onclick = () => this.addAI('hard');
        }
        
        if (shareRoomBtn) {
            shareRoomBtn.onclick = () => this.shareRoom();
        }
        
        if (startGameBtn) {
            startGameBtn.onclick = () => this.startGame();
        }
        
        if (leaveRoomBtn) {
            leaveRoomBtn.onclick = () => this.leaveRoom();
        }
    },

    setupModalEvents() {
        const confirmUsernameBtn = DOM.get('confirmUsernameBtn');
        const cancelUsernameBtn = DOM.get('cancelUsernameBtn');
        const usernameModalInput = DOM.get('usernameModalInput');
        
        if (confirmUsernameBtn) {
            confirmUsernameBtn.onclick = () => {
                const username = usernameModalInput?.value?.trim();
                if (!username) {
                    alert('Please enter your username.');
                    return;
                }
                
                gameState.pendingUsername = username;
                ModalManager.closeUsernameModal();
                MultiplayerManager.createRoom();
            };
        }
        
        if (cancelUsernameBtn) {
            cancelUsernameBtn.onclick = () => ModalManager.closeUsernameModal();
        }
        
        if (usernameModalInput) {
            usernameModalInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    confirmUsernameBtn?.click();
                }
            };
        }
    },

    setupGameEvents() {
        const proceedToMinigameBtn = DOM.get('proceedToMinigameBtn');
        const continueToScoreboardBtn = DOM.get('continueToScoreboardBtn');
        const nextRoundBtn = DOM.get('nextRoundBtn');
        const viewFinalResultsBtn = DOM.get('viewFinalResultsBtn');
        const playAgainBtn = DOM.get('playAgainBtn');
        const mainMenuBtn = DOM.get('mainMenuBtn');
        
        if (proceedToMinigameBtn) {
            proceedToMinigameBtn.onclick = () => this.proceedToMinigame();
        }
        
        if (continueToScoreboardBtn) {
            continueToScoreboardBtn.onclick = () => this.continueToScoreboard();
        }
        
        if (nextRoundBtn) {
            nextRoundBtn.onclick = () => this.nextRound();
        }
        
        if (viewFinalResultsBtn) {
            viewFinalResultsBtn.onclick = () => this.viewFinalResults();
        }
        
        if (playAgainBtn) {
            playAgainBtn.onclick = () => this.playAgain();
        }
        
        if (mainMenuBtn) {
            mainMenuBtn.onclick = () => this.mainMenu();
        }
    },

    setupMinigameEvents() {
        // Minigame events will be set up dynamically by the minigame controllers
    },

    addAI(difficulty) {
        if (gameState.players.length >= CONFIG.MAX_PLAYERS) {
            alert('Maximum players reached!');
            return;
        }
        
        const aiNames = {
            easy: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
            medium: ['Frank', 'Grace', 'Henry', 'Iris', 'Jack'],
            hard: ['Kate', 'Leo', 'Maya', 'Noah', 'Olivia']
        };
        
        const usedNames = gameState.players.map(p => p.name);
        const availableNames = aiNames[difficulty].filter(name => !usedNames.includes(name));
        
        if (availableNames.length === 0) {
            alert('No more AI names available for this difficulty!');
            return;
        }
        
        const aiPlayer = {
            id: Utils.generateUUID(),
            name: Utils.getRandomElement(availableNames),
            score: 0,
            correctAnswers: 0,
            pointsStolen: 0,
            difficulty: difficulty,
            isHost: false,
            isOnline: false
        };
        
        gameState.players.push(aiPlayer);
        Utils.log(`Added ${difficulty} AI: ${aiPlayer.name}`, 'success');
        
        PlayerManager.updatePlayerList();
        PlayerManager.updateStartButton();
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
    },

    shareRoom() {
        const roomCode = gameState.room;
        const shareText = `Join my Trivia Murder Party game! Room code: ${roomCode}`;
        const shareUrl = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Trivia Murder Party',
                text: shareText,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
                alert('Room link copied to clipboard!');
            }).catch(() => {
                // Final fallback: show alert
                alert(`${shareText}\n\nLink: ${shareUrl}`);
            });
        }
    },

    startGame() {
        if (gameState.players.length < CONFIG.MIN_PLAYERS) {
            alert(`Need at least ${CONFIG.MIN_PLAYERS} players to start!`);
            return;
        }
        
        Utils.log('Starting game...', 'success');
        
        // Update game state before showing category selection
        gameState.currentScreen = 'categoryScreen';
        gameState.currentRound = 1;
        gameState.flags.clear();
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        GameController.showCategorySelection();
    },

    leaveRoom() {
        if (confirm('Are you sure you want to leave the room?')) {
            GameStateManager.reset();
            ModalManager.showHomeScreen();
        }
    },

    proceedToMinigame() {
        const minigames = ['hunting', 'quantum', 'resource', 'dice', 'codebreaker'];
        const randomMinigame = Utils.getRandomElement(minigames);
        
        // Update game state before starting minigame
        gameState.currentMinigame = randomMinigame;
        gameState.currentScreen = `${randomMinigame}Screen`;
        gameState.flags.clear();
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        MinigameController.start(randomMinigame);
    },

    continueToScoreboard() {
        // Update game state before showing scoreboard
        gameState.currentScreen = 'scoreboardScreen';
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        GameController.showScoreboard();
    },

    viewFinalResults() {
        // Update game state before showing final results
        gameState.currentScreen = 'finalResultsScreen';
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        GameController.showFinalResults();
    },

    playAgain() {
        GameController.playAgain();
    },

    mainMenu() {
        // Update game state before returning to menu
        gameState.currentScreen = 'homeScreen';
        
        // Update game state if online and host
        if (isHostAndOnline()) {
            updateGameStateInDB(gameState);
        }
        
        GameStateManager.reset();
        ModalManager.showHomeScreen();
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ModalManager = ModalManager;
    window.PlayerManager = PlayerManager;
    window.GameController = GameController;
    window.EventManager = EventManager;
    // Global function aliases for HTML compatibility
    window.showUsernameModal = ModalManager.showUsernameModal;
    window.closeUsernameModal = ModalManager.closeUsernameModal;
    window.showJoinScreen = ModalManager.showJoinScreen;
    window.showHomeScreen = ModalManager.showHomeScreen;
    // Initialize event listeners when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            EventManager.initialize();
        });
    } else {
        EventManager.initialize();
    }
} 