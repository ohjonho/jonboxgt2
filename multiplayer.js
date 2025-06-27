/**
 * Trivia Murder Party - Multiplayer Management
 * Handles all multiplayer functionality, Supabase sync, and connection management
 */

console.log('[multiplayer.js] loaded');

// ========================================
// CONNECTION MANAGEMENT
// ========================================

const ConnectionManager = {
    status: 'loading', // 'loading', 'online', 'offline', 'connecting'
    message: 'Initializing...',

    updateStatus(status, message) {
        this.status = status;
        this.message = message;
        
        const statusEl = DOM.get('connection-indicator');
        if (statusEl) {
            statusEl.textContent = `${status === 'online' ? '🌐' : status === 'offline' ? '📴' : '⏳'} ${message}`;
            statusEl.className = `connection-status ${status}`;
        }
        
        // Show offline modal if status is offline
        if (status === 'offline') {
            const offlineModal = DOM.get('offlineModal');
            if (offlineModal) {
                offlineModal.classList.add('active');
            }
        }
        
        Utils.log(`Connection status: ${status} - ${message}`, status === 'online' ? 'success' : status === 'offline' ? 'warn' : 'info');
    },

    async testSupabase() {
        try {
            this.updateStatus('connecting', 'Connecting...');
            
            // Test basic connection without relying on specific table schemas
            const { data, error } = await supabaseClient
                .from('rooms')
                .select('*')
                .limit(1);
            
            if (error) {
                // If rooms table doesn't exist, try a different approach
                Utils.log(`Rooms table test failed: ${error.message}`, 'warn');
                
                // Test if we can at least connect to Supabase
                try {
                    const { data: testData, error: testError } = await supabaseClient
                        .from('_test_connection')
                        .select('*')
                        .limit(1);
                    
                    // If we get a 404, it means Supabase is working but table doesn't exist
                    if (testError && testError.code === 'PGRST116') {
                        Utils.log('Supabase connection working, but tables may not exist', 'warn');
                        this.updateStatus('offline', 'Tables Missing');
                        return false;
                    }
                } catch (e) {
                    // If we can't even test connection, assume offline
                    this.updateStatus('offline', 'Connection Failed');
                    return false;
                }
                
                this.updateStatus('offline', 'Tables Missing');
                return false;
            }
            
            this.updateStatus('online', 'Online');
            Utils.log('✅ Supabase connection successful', 'success');
            return true;
        } catch (error) {
            this.updateStatus('offline', 'Offline Mode');
            Utils.log(`❌ Supabase connection failed: ${error.message}`, 'error');
            return false;
        }
    },

    async initializeSupabase() {
        console.log('[multiplayer.js] Calling initializeSupabase');
        try {
            if (typeof supabase !== 'undefined') {
                const { createClient } = supabase;
                supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
                return await this.testSupabase();
            } else {
                Utils.log('Supabase library not loaded', 'error');
                this.updateStatus('offline', 'Library Error');
                return false;
            }
        } catch (error) {
            Utils.log(`Supabase initialization error: ${error.message}`, 'error');
            this.updateStatus('offline', 'Init Error');
            return false;
        }
    }
};

// ========================================
// MULTIPLAYER MANAGER
// ========================================

const MultiplayerManager = {
    async createRoom() {
        try {
            const username = gameState.pendingUsername;
            if (!username) { Utils.log('No username provided', 'error'); return; }
            GameStateManager.reset();
            gameState.room = Utils.generateRoomCode();
            gameState.isHost = true;
            gameState.currentPlayer = {
                id: Utils.generateUUID(),
                name: username,
                score: 0,
                correctAnswers: 0,
                pointsStolen: 0,
                isHost: true,
                isOnline: true
            };

            // Try to use Supabase if available
            if (ConnectionManager.status === 'online' && supabaseClient) {
                try {
                    // Try to create room in Supabase
                    const { error: roomError } = await supabaseClient
                        .from('rooms')
                        .insert([{ code: gameState.room, status: 'waiting' }]);
                    
                    if (roomError) {
                        Utils.log(`Rooms table error: ${roomError.message}`, 'warn');
                        throw new Error('Tables not available');
                    }

                    // Try to insert player with correct schema and UUID
                    const { error: playerError } = await supabaseClient
                        .from('players')
                        .insert([{ 
                            room_code: gameState.room, 
                            username: username, 
                            is_host: true,
                            id: gameState.currentPlayer.id,
                            score: 0
                        }]);
                    
                    if (playerError) {
                        Utils.log(`Players table error: ${playerError.message}`, 'warn');
                        throw new Error('Tables not available');
                    }
                    
                    // Try to create game state (only if games table exists)
                    try {
                        const { error: gameError } = await supabaseClient
                            .from('games')
                            .insert([{ 
                                room_code: gameState.room, 
                                state: JSON.stringify({
                                    ...gameState,
                                    players: [gameState.currentPlayer],
                                    joinRequests: []
                                })
                            }]);
                        
                        if (gameError) {
                            Utils.log(`Games table not available: ${gameError.message}`, 'warn');
                            // Continue without games table
                        }
                    } catch (gameError) {
                        Utils.log(`Games table does not exist, continuing without it`, 'warn');
                    }
                    
                    // If we get here, Supabase is working
                    MultiplayerManager.subscribeToPlayers(gameState.room);
                    await MultiplayerManager.syncPlayersFromDatabase();
                    
                    // Only subscribe to games if table exists
                    try {
                        subscribeToGameState(gameState.room);
                    } catch (e) {
                        Utils.log(`Games subscription failed: ${e.message}`, 'warn');
                    }
                    
                    ConnectionManager.updateStatus('online', 'Room Created');
                    
                } catch (error) {
                    Utils.log(`Supabase tables not available, using offline mode: ${error.message}`, 'warn');
                    ConnectionManager.updateStatus('offline', 'Offline Mode');
                    gameState.players = [gameState.currentPlayer];
                }
            } else {
                // Already offline
                ConnectionManager.updateStatus('offline', 'Offline Mode');
                gameState.players = [gameState.currentPlayer];
            }

            Utils.log(`Room created: ${gameState.room}`, 'success');
            
            // Start host polling for join requests
            if (gameState.isHost) {
                startHostPolling();
            }
            
            // Fetch questions if API manager is available
            if (window.APIManager) {
                window.APIManager.fetchQuestionsFromAnyApi().then(success => {
                    if (success) PlayerManager.updateQuestionStatus();
                });
            }
            
            PlayerManager.showLobby();
            gameState.currentScreen = 'lobbyScreen';
            
            // Only update DB if online and games table exists
            if (ConnectionManager.status === 'online') {
                try {
                    updateGameStateInDB(gameState);
                } catch (e) {
                    Utils.log(`Games table update failed: ${e.message}`, 'warn');
                }
            }

        } catch (error) {
            Utils.log(`Error creating room: ${error.message}`, 'error');
            alert('Failed to create room. Please try again.');
            ScreenManager.show('homeScreen');
        }
    },

    async joinRoom() {
        try {
            const roomCode = DOM.get('roomCodeInput')?.value?.trim()?.toUpperCase();
            const username = DOM.get('usernameInput')?.value?.trim();
            if (!roomCode || roomCode.length !== 6) { alert('Please enter a valid 6-character room code.'); return; }
            if (!username) { alert('Please enter your username.'); return; }

            GameStateManager.reset();
            gameState.room = roomCode;
            gameState.isHost = false;
            gameState.currentPlayer = {
                id: Utils.generateUUID(),
                name: username,
                score: 0,
                correctAnswers: 0,
                pointsStolen: 0,
                isHost: false,
                isOnline: true
            };

            // Try to use Supabase if available
            if (ConnectionManager.status === 'online' && supabaseClient) {
                try {
                    // Try to check if room exists
                    const { data: roomData, error: roomError } = await supabaseClient
                        .from('rooms')
                        .select('*')
                        .eq('code', roomCode)
                        .single();
                    
                    if (roomError) {
                        Utils.log(`Room check failed: ${roomError.message}`, 'warn');
                        throw new Error('Tables not available');
                    }
                    
                    if (!roomData) {
                        alert('Room not found. Please check the code and try again.');
                        return;
                    }
                    
                    // Try to insert player with correct schema and UUID
                    const { error: playerError } = await supabaseClient
                        .from('players')
                        .insert([{ 
                            room_code: roomCode, 
                            username: username,
                            is_host: false,
                            id: gameState.currentPlayer.id,
                            score: 0
                        }]);
                    
                    if (playerError) {
                        Utils.log(`Player insert failed: ${playerError.message}`, 'warn');
                        throw new Error('Tables not available');
                    }
                    
                    // Add join request to games table if it exists
                    try {
                        const { data: gameData } = await supabaseClient
                            .from('games')
                            .select('*')
                            .eq('room_code', roomCode)
                            .single();
                        
                        if (gameData) {
                            let state = Utils.safeParseJSON(gameData.state) || {};
                            if (!state.joinRequests) state.joinRequests = [];
                            state.joinRequests.push({
                                id: gameState.currentPlayer.id,
                                name: username,
                                timestamp: Date.now()
                            });
                            
                            await supabaseClient
                                .from('games')
                                .update({ state: JSON.stringify(state) })
                                .eq('room_code', roomCode);
                        }
                    } catch (gameError) {
                        Utils.log(`Games table not available for join request: ${gameError.message}`, 'warn');
                    }
                    
                    // Try to subscribe and sync
                    MultiplayerManager.subscribeToPlayers(roomCode);
                    await MultiplayerManager.syncPlayersFromDatabase();
                    
                    // Only subscribe to games if table exists
                    try {
                        subscribeToGameState(roomCode);
                    } catch (e) {
                        Utils.log(`Games subscription failed: ${e.message}`, 'warn');
                    }
                    
                    ConnectionManager.updateStatus('online', 'Joined Room');

                } catch (error) {
                    Utils.log(`Supabase tables not available, using offline mode: ${error.message}`, 'warn');
                    ConnectionManager.updateStatus('offline', 'Offline Mode');
                    gameState.players = [gameState.currentPlayer];
                }
            } else {
                // Already offline
                ConnectionManager.updateStatus('offline', 'Offline Mode');
                gameState.players = [gameState.currentPlayer];
            }

            PlayerManager.showLobby();
            gameState.currentScreen = 'lobbyScreen';
            
            // Only update DB if online and games table exists
            if (ConnectionManager.status === 'online') {
                try {
                    updateGameStateInDB(gameState);
                } catch (e) {
                    Utils.log(`Games table update failed: ${e.message}`, 'warn');
                }
            }

        } catch (error) {
            Utils.log(`Error joining room: ${error.message}`, 'error');
            alert('Failed to join room. Please try again.');
        }
    },

    subscribeToPlayers(roomCode) {
        if (!supabaseClient || ConnectionManager.status !== 'online') {
            Utils.log('Cannot subscribe to players: not connected', 'warn');
            return;
        }
        
        try {
            Utils.log(`Setting up player subscription for room: ${roomCode}`, 'info');
            
            if (gameState.supabaseSubscription) {
                Utils.log('Unsubscribing from previous subscription', 'info');
                gameState.supabaseSubscription.unsubscribe();
            }
            
            gameState.supabaseSubscription = supabaseClient
                .channel(`players-${roomCode}`)
                .on('postgres_changes', {
                    event: '*', 
                    schema: 'public', 
                    table: 'players', 
                    filter: `room_code=eq.${roomCode}` 
                }, async (payload) => {
                    Utils.log(`Player change detected: ${payload.eventType} for ${payload.new?.username || 'unknown'}`, 'info');
                    await MultiplayerManager.syncPlayersFromDatabase();
                    PlayerManager.updatePlayerList();
                })
                .subscribe((status) => {
                    Utils.log(`Player subscription status: ${status}`, status === 'SUBSCRIBED' ? 'success' : 'warn');
                });
            
            Utils.log('✅ Successfully subscribed to player updates', 'success');
        } catch (error) {
            Utils.log(`Error subscribing to players: ${error.message}`, 'warn');
        }
    },

    async syncPlayersFromDatabase() {
        if (!supabaseClient || !gameState.room || ConnectionManager.status !== 'online') {
            Utils.log('Cannot sync players: not connected or no room', 'warn');
            return;
        }
        
        try {
            Utils.log(`Syncing players for room: ${gameState.room}`, 'info');
            
            // Try to get players from players table with correct schema
            const { data: playersData, error: playersError } = await supabaseClient
                .from('players')
                .select('*')
                .eq('room_code', gameState.room);
            
            if (playersError) {
                Utils.log(`Players table sync failed: ${playersError.message}`, 'warn');
                return;
            }

            Utils.log(`Found ${playersData?.length || 0} players in database`, 'info');

            if (playersData && playersData.length > 0) {
                const onlinePlayers = playersData.map(p => ({
                    id: p.id || p.username,
                    name: p.username,
                    score: p.score || 0,
                    correctAnswers: 0,
                    pointsStolen: 0,
                    isHost: p.is_host || false,
                    isOnline: true
                }));

                // Merge with existing AI players
                const aiPlayers = gameState.players.filter(p => p.difficulty);
                const oldPlayerCount = gameState.players.length;
                gameState.players = [...onlinePlayers, ...aiPlayers];
                
                Utils.log(`✅ Synced ${onlinePlayers.length} online players + ${aiPlayers.length} AI players`, 'success');
                Utils.log(`Player details: ${onlinePlayers.map(p => `${p.name}(${p.isHost ? 'host' : 'player'})`).join(', ')}`, 'info');
                
                // Update UI if player count changed
                if (gameState.players.length !== oldPlayerCount) {
                    Utils.log(`Player count updated: ${oldPlayerCount} → ${gameState.players.length}`, 'info');
                    if (gameState.currentScreen === 'lobbyScreen') {
                        PlayerManager.updatePlayerList();
                        PlayerManager.updateStartButton();
                    }
                }
            } else {
                Utils.log('No players found in database', 'warn');
                // Keep AI players if any
                const aiPlayers = gameState.players.filter(p => p.difficulty);
                gameState.players = aiPlayers;
            }
        } catch (error) {
            Utils.log(`Error syncing players: ${error.message}`, 'warn');
        }
    }
};

// ========================================
// GAME STATE SYNC
// ========================================

let gameStateSubscription = null;

async function updateGameStateInDB(newState) {
    if (!gameState.room || !supabaseClient || ConnectionManager.status !== 'online') return;
    
    try {
        Utils.log(`Updating game state in DB for room ${gameState.room} with ${newState.players?.length || 0} players`, 'info');
        
        // Create a clean copy of the state without circular references
        const cleanState = {
            room: newState.room,
            currentRound: newState.currentRound,
            currentQuestion: newState.currentQuestion,
            players: newState.players.map(player => ({
                id: player.id,
                name: player.name,
                score: player.score || 0,
                correctAnswers: player.correctAnswers || 0,
                pointsStolen: player.pointsStolen || 0,
                isHost: player.isHost || false,
                isOnline: player.isOnline !== false,
                difficulty: player.difficulty || null
            })),
            currentScreen: newState.currentScreen,
            flags: Array.from(newState.flags || []),
            playerAnswers: newState.playerAnswers ? Object.fromEntries(newState.playerAnswers) : {},
            powerups: newState.powerups ? Object.fromEntries(newState.powerups) : {},
            minigameSelections: newState.minigameSelections ? Object.fromEntries(newState.minigameSelections) : {},
            quantumPositions: newState.quantumPositions ? Object.fromEntries(newState.quantumPositions) : {},
            resourceData: newState.resourceData ? Object.fromEntries(newState.resourceData) : {},
            diceData: newState.diceData ? Object.fromEntries(newState.diceData) : {},
            codeData: newState.codeData || {},
            currentMinigame: newState.currentMinigame,
            currentMinigameTurn: newState.currentMinigameTurn,
            currentMinigameRound: newState.currentMinigameRound,
            finalAnswers: newState.finalAnswers ? Object.fromEntries(newState.finalAnswers) : {}
        };
        
        // Try upsert first, if it fails, try insert
        let { error } = await supabaseClient
            .from('games')
            .upsert([{ room_code: gameState.room, state: JSON.stringify(cleanState) }]);
        
        if (error) {
            Utils.log(`Games table upsert failed: ${error.message}`, 'warn');
            
            // Try insert instead
            const { error: insertError } = await supabaseClient
                .from('games')
                .insert([{ room_code: gameState.room, state: JSON.stringify(cleanState) }]);
            
            if (insertError) {
                Utils.log(`Games table insert also failed: ${insertError.message}`, 'warn');
            } else {
                Utils.log(`✅ Game state created successfully in DB`, 'success');
            }
        } else {
            Utils.log(`✅ Game state updated successfully in DB`, 'success');
        }
    } catch (e) {
        Utils.log(`Games table operation failed: ${e.message}`, 'warn');
    }
}

async function subscribeToGameState(roomCode) {
    if (!supabaseClient || ConnectionManager.status !== 'online') {
        Utils.log('Cannot subscribe to game state: not connected', 'warn');
        return;
    }
    
    try {
        if (gameStateSubscription) gameStateSubscription.unsubscribe();
        
        gameStateSubscription = supabaseClient
            .channel(`games-${roomCode}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'games',
                filter: `room_code=eq.${roomCode}`
            }, async (payload) => {
                if (payload.new && payload.new.state) {
                    const newState = Utils.safeParseJSON(payload.new.state);
                    if (newState) {
                        Utils.log(`Game state update received: ${newState.players?.length || 0} players`, 'info');
                        
                        // Reconstruct the game state properly
                        const oldPlayerCount = gameState.players.length;
                        
                        // Update players
                        if (newState.players) {
                            gameState.players = newState.players;
                        }
                        
                        // Update other state properties
                        if (newState.currentRound) gameState.currentRound = newState.currentRound;
                        if (newState.currentQuestion) gameState.currentQuestion = newState.currentQuestion;
                        if (newState.currentScreen) gameState.currentScreen = newState.currentScreen;
                        
                        // Reconstruct Maps and Sets
                        if (newState.flags) gameState.flags = new Set(newState.flags);
                        if (newState.playerAnswers) gameState.playerAnswers = new Map(Object.entries(newState.playerAnswers));
                        if (newState.powerups) gameState.powerups = new Map(Object.entries(newState.powerups));
                        if (newState.minigameSelections) gameState.minigameSelections = new Map(Object.entries(newState.minigameSelections));
                        if (newState.quantumPositions) gameState.quantumPositions = new Map(Object.entries(newState.quantumPositions));
                        if (newState.resourceData) gameState.resourceData = new Map(Object.entries(newState.resourceData));
                        if (newState.diceData) gameState.diceData = new Map(Object.entries(newState.diceData));
                        if (newState.codeData) gameState.codeData = newState.codeData;
                        if (newState.currentMinigame) gameState.currentMinigame = newState.currentMinigame;
                        if (newState.currentMinigameTurn) gameState.currentMinigameTurn = newState.currentMinigameTurn;
                        if (newState.currentMinigameRound) gameState.currentMinigameRound = newState.currentMinigameRound;
                        if (newState.finalAnswers) gameState.finalAnswers = new Map(Object.entries(newState.finalAnswers));
                        
                        // Log player changes
                        if (gameState.players.length !== oldPlayerCount) {
                            Utils.log(`Player count changed: ${oldPlayerCount} → ${gameState.players.length}`, 'info');
                        }
                        
                        // Update UI to reflect new state
                        if (gameState.currentScreen) {
                            ScreenManager.show(gameState.currentScreen);
                        }
                        
                        if (gameState.currentScreen === 'lobbyScreen') {
                            PlayerManager.updatePlayerList();
                            PlayerManager.updateStartButton();
                        }
                        
                        if (gameState.currentScreen === 'scoreboardScreen') {
                            if (typeof ScoreboardUI !== 'undefined' && ScoreboardUI.showScoreboard) {
                                ScoreboardUI.showScoreboard();
                            } else {
                                // Fallback: just update the player list
                                if (typeof PlayerManager !== 'undefined' && PlayerManager.updatePlayerList) {
                                    PlayerManager.updatePlayerList();
                                }
                            }
                        }
                    }
                }
            })
            .subscribe();
        
        Utils.log('✅ Successfully subscribed to game state updates', 'success');
    } catch (error) {
        Utils.log(`Games table does not exist, skipping subscription: ${error.message}`, 'warn');
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function isHostAndOnline() {
    return gameState.isHost && ConnectionManager.status === 'online';
}

// ========================================
// HOST POLLING FOR JOIN REQUESTS
// ========================================

function startHostPolling() {
    // Host polling to merge join requests (only if online and host)
    setInterval(async () => {
        if (gameState.isHost && gameState.room && ConnectionManager.status === 'online' && supabaseClient) {
            try {
                // Try to get joinRequests from DB (only if games table exists)
                try {
                    // Use a more specific query to avoid 406 errors
                    const { data: gameRows, error } = await supabaseClient
                        .from('games')
                        .select('state')
                        .eq('room_code', gameState.room)
                        .limit(1);
                    
                    if (error) {
                        Utils.log(`Games table query error: ${error.message}`, 'warn');
                        return;
                    }
                    
                    if (!gameRows || gameRows.length === 0) {
                        // No game state exists yet, create initial state
                        const initialState = {
                            room: gameState.room,
                            players: gameState.players,
                            currentRound: 1,
                            currentScreen: 'lobbyScreen',
                            flags: [],
                            playerAnswers: {},
                            powerups: {},
                            minigameSelections: {},
                            quantumPositions: {},
                            resourceData: {},
                            diceData: {},
                            codeData: {},
                            finalAnswers: {}
                        };
                        
                        await supabaseClient
                            .from('games')
                            .insert([{ room_code: gameState.room, state: JSON.stringify(initialState) }]);
                        
                        Utils.log('Created initial game state', 'success');
                        return;
                    }
                    
                    const gameRow = gameRows[0];
                    let state = Utils.safeParseJSON(gameRow.state);
                    if (!state) {
                        Utils.log('Invalid game state JSON', 'warn');
                        return;
                    }
                    
                    let changed = false;
                    if (state.joinRequests && Array.isArray(state.joinRequests)) {
                        Utils.log(`Processing ${state.joinRequests.length} join requests`, 'info');
                        state.joinRequests.forEach(req => {
                            if (!gameState.players.find(p => p.id === req.id)) {
                                const newPlayer = {
                                    id: req.id,
                                    name: req.name,
                                    score: 0,
                                    correctAnswers: 0,
                                    pointsStolen: 0,
                                    isHost: false,
                                    isOnline: true
                                };
                                gameState.players.push(newPlayer);
                                changed = true;
                                Utils.log(`Added new player: ${req.name} (${req.id})`, 'success');
                            }
                        });
                        // Clear joinRequests
                        state.joinRequests = [];
                    }
                    
                    // Always update players in state
                    state.players = gameState.players;
                    
                    if (changed) {
                        const { error: updateError } = await supabaseClient
                            .from('games')
                            .update({ state: JSON.stringify(state) })
                            .eq('room_code', gameState.room);
                        
                        if (updateError) {
                            Utils.log(`Failed to update game state: ${updateError.message}`, 'warn');
                        } else {
                            Utils.log(`Updated game state with ${gameState.players.length} players`, 'success');
                            
                            // Update UI immediately
                            if (gameState.currentScreen === 'lobbyScreen') {
                                PlayerManager.updatePlayerList();
                                PlayerManager.updateStartButton();
                            }
                        }
                    }
                } catch (gameError) {
                    // Games table doesn't exist or has issues, skip join request processing
                    Utils.log(`Games table not available for join requests: ${gameError.message}`, 'warn');
                }
            } catch (error) {
                Utils.log(`Error merging join requests: ${error.message}`, 'warn');
            }
        }
    }, 1000);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ConnectionManager = ConnectionManager;
    window.MultiplayerManager = MultiplayerManager;
    window.updateGameStateInDB = updateGameStateInDB;
    window.subscribeToGameState = subscribeToGameState;
    window.isHostAndOnline = isHostAndOnline;
    window.startHostPolling = startHostPolling;
}