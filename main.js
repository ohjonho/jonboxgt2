/**
 * Trivia Murder Party - Main Game Logic
 * Optimized for performance, stability, and seamless multiplayer experience
 */

// ========================================
// CONFIGURATION AND CONSTANTS
// ========================================

const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://iftehkxnwnhuugqtatzq.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdGVoa3hud25odXVncXRhdHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTY0MjQsImV4cCI6MjA2NjQ5MjQyNH0.pfEUmJTCd1aNKLplV_qZdQagR1ZlqliCxMamUy6egrg',
    
    // Game Constants - Updated timer durations (3x longer except Hunting Season)
    TIMER_DURATION: { 
        category: 10, question: 10, hunting: 10, quantum: 90, 
        resource: 90, dice: 90, code: 135, final: 45 
    },
    POWERUP_ROUND: 3,
    FINAL_ROUND: 6,
    GRID_SIZE: 16,
    MAX_PLAYERS: 12,
    MIN_PLAYERS: 2,
    POINTS: { correct: 2, finalFull: 8, finalPartial: 2 },
    API_RATE_LIMIT: 2000,
    MINIGAMES: ['hunting', 'quantum', 'resource', 'dice', 'codebreaker'],
    
    // Performance Settings
    DOM_CACHE_DURATION: 30000, // 30 seconds
    RECONNECT_DELAY: 3000,
    MAX_RETRY_ATTEMPTS: 3
};

const STATIC_DATA = {
    COMPUTER_NAMES: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack"],
    CATEGORIES: ["Science", "History", "Geography", "Sports", "Entertainment", "Literature", "Art", "Technology", "Nature", "Mathematics"],
    
    BACKUP_QUESTIONS: [
        { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2, category: "Geography" },
        { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1, category: "Science" },
        { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2, category: "Art" },
        { question: "What is the largest mammal in the world?", options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"], correct: 1, category: "Nature" },
        { question: "In which year did World War II end?", options: ["1944", "1945", "1946", "1947"], correct: 1, category: "History" },
        { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], correct: 2, category: "Mathematics" },
        { question: "Which Shakespeare play features Romeo and Juliet?", options: ["Hamlet", "Macbeth", "Romeo and Juliet", "Othello"], correct: 2, category: "Literature" },
        { question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2, category: "Science" },
        { question: "Which country is home to Machu Picchu?", options: ["Chile", "Peru", "Bolivia", "Ecuador"], correct: 1, category: "Geography" },
        { question: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Leopard", "Tiger"], correct: 1, category: "Nature" },
        { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], correct: 0, category: "Literature" },
        { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3, category: "Geography" },
        { question: "Which element has the symbol 'O'?", options: ["Osmium", "Oxygen", "Opium", "Octane"], correct: 1, category: "Science" },
        { question: "In which sport would you perform a slam dunk?", options: ["Tennis", "Basketball", "Volleyball", "Football"], correct: 1, category: "Sports" },
        { question: "What year did the Titanic sink?", options: ["1910", "1911", "1912", "1913"], correct: 2, category: "History" },
        { question: "Which movie won the first Academy Award for Best Picture?", options: ["Wings", "Sunrise", "The Jazz Singer", "7th Heaven"], correct: 0, category: "Entertainment" },
        { question: "What is the square root of 144?", options: ["11", "12", "13", "14"], correct: 1, category: "Mathematics" },
        { question: "Which programming language was created by Guido van Rossum?", options: ["Java", "Python", "C++", "Ruby"], correct: 1, category: "Technology" },
        { question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], correct: 1, category: "Geography" },
        { question: "Who composed 'The Four Seasons'?", options: ["Mozart", "Bach", "Vivaldi", "Beethoven"], correct: 2, category: "Art" },
        { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2, category: "Science" },
        { question: "Which ancient wonder of the world was located in Alexandria?", options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"], correct: 1, category: "History" },
        { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Lime", "Onion"], correct: 1, category: "Science" },
        { question: "Which continent has the most countries?", options: ["Asia", "Europe", "Africa", "South America"], correct: 2, category: "Geography" },
        { question: "What does 'www' stand for?", options: ["World Wide Web", "World Web Wide", "Wide World Web", "Web Wide World"], correct: 0, category: "Technology" },
        { question: "Who painted 'Starry Night'?", options: ["Picasso", "Van Gogh", "Monet", "Renoir"], correct: 1, category: "Art" },
        { question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2, category: "Geography" },
        { question: "Which organ in the human body produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Heart"], correct: 2, category: "Science" },
        { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], correct: 1, category: "Geography" },
        { question: "In Greek mythology, who is the king of the gods?", options: ["Apollo", "Zeus", "Poseidon", "Hades"], correct: 1, category: "History" }
    ],
    
    FINAL_ROUND_QUESTION: {
        question: "Which of these are considered programming languages? (Select exactly 2 correct answers)",
        options: ["Python", "HTML", "JavaScript", "CSS", "SQL"],
        correct: [0, 2]
    },
    
    TRIVIA_APIS: [
        {
            name: "The Trivia API",
            url: "https://the-trivia-api.com/v2/questions?limit=10",
            process: 'processTheTriviaApi',
            working: null
        },
        {
            name: "Open Trivia DB",
            url: "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple",
            process: 'processOpenTriviaApi',
            working: null
        },
        {
            name: "Trivia DB Backup",
            url: "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple",
            process: 'processOpenTriviaApi',
            working: null
        }
    ]
};

// ========================================
// GLOBAL STATE MANAGEMENT
// ========================================

let supabaseClient = null;
let gameState = {};
let domCache = {};
let retryCount = 0;

function initializeGameState() {
    gameState = {
        room: null,
        players: [],
        currentPlayer: null,
        currentRound: 1,
        currentQuestion: null,
        selectedAnswers: [],
        minigameGrid: new Array(CONFIG.GRID_SIZE).fill(null),
        isHost: false,
        backupQuestions: [...STATIC_DATA.BACKUP_QUESTIONS],
        apiQuestions: [],
        playerStatus: new Map(),
        powerups: new Map(),
        roundAnswers: new Map(),
        finalAnswers: new Map(),
        flags: new Set(),
        currentTimer: null,
        minigameSelections: new Map(),
        lastApiCall: 0,
        pendingUsername: null,
        supabaseSubscription: null,
        
        // Minigame data
        currentMinigame: null,
        quantumPositions: new Map(),
        quantumTraps: new Map(),
        resourceData: new Map(),
        diceData: new Map(),
        codeData: {
            secretCode: [],
            attempts: [],
            currentAttempt: 0,
            guessOrder: []
        },
        currentMinigameTurn: 1,
        currentMinigameRound: 1,
        currentDiceCount: 0,
        currentBet: 0,
        currentCodeGuess: []
    };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

const Utils = {
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    },

    generateRoomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    },

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    safeParseJSON(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            Utils.log(`JSON parse error: ${e.message}`, 'error');
            return null;
        }
    }
};

// ========================================
// DOM MANAGEMENT
// ========================================

const DOM = {
    cache: {},
    lastCacheTime: 0,

    get(id) {
        const now = Date.now();
        if (now - this.lastCacheTime > CONFIG.DOM_CACHE_DURATION) {
            this.cache = {};
            this.lastCacheTime = now;
        }

        if (!this.cache[id]) {
            this.cache[id] = document.getElementById(id);
        }
        return this.cache[id];
    },

    getAll(selector) {
        return document.querySelectorAll(selector);
    },

    show(elementId) {
        const element = this.get(elementId);
        if (element) element.style.display = 'block';
    },

    hide(elementId) {
        const element = this.get(elementId);
        if (element) element.style.display = 'none';
    },

    setText(elementId, text) {
        const element = this.get(elementId);
        if (element) element.textContent = text;
    },

    setHTML(elementId, html) {
        const element = this.get(elementId);
        if (element) element.innerHTML = html;
    },

    addClass(elementId, className) {
        const element = this.get(elementId);
        if (element) element.classList.add(className);
    },

    removeClass(elementId, className) {
        const element = this.get(elementId);
        if (element) element.classList.remove(className);
    },

    clearHTML(elementId) {
        const element = this.get(elementId);
        if (element) element.innerHTML = '';
    }
};

// ========================================
// SCREEN MANAGEMENT
// ========================================

const ScreenManager = {
    currentScreen: 'homeScreen',

    show(screenId) {
        Utils.log(`Switching to screen: ${screenId}`);
        
        // Clear any existing timer
        if (gameState.currentTimer) {
            clearInterval(gameState.currentTimer);
            gameState.currentTimer = null;
        }
        
        // Hide all screens
        DOM.getAll('.screen').forEach(screen => screen.classList.remove('active'));
        
        // Show target screen
        const targetScreen = DOM.get(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            Utils.log(`Successfully switched to ${screenId}`, 'success');
        } else {
            Utils.log(`Screen ${screenId} not found!`, 'error');
        }
    }
};

// ========================================
// CONNECTION MANAGEMENT
// ========================================

const ConnectionManager = {
    status: 'unknown',

    updateStatus(status, message) {
        this.status = status;
        const statusEl = DOM.get('connectionStatus');
        if (statusEl) {
            const statusEmoji = status === 'online' ? '🌐' : status === 'offline' ? '📴' : '⚠️';
            statusEl.textContent = `${statusEmoji} ${message}`;
            statusEl.style.background = status === 'online' ? '#00b894' : status === 'offline' ? '#e17055' : '#f39c12';
        }
    },

    async testSupabase() {
        try {
            this.updateStatus('connecting', 'Connecting...');
            
            const { data, error } = await supabaseClient
                .from('rooms')
                .select('count')
                .limit(1);
            
            if (error) throw error;
            
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
// API MANAGEMENT
// ========================================

const APIManager = {
    async testAllApis() {
        Utils.log('🔬 Testing all trivia APIs...');
        
        const results = [];
        
        for (const api of STATIC_DATA.TRIVIA_APIS) {
            try {
                Utils.log(`Testing ${api.name}...`);
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                );
                
                const fetchPromise = fetch(api.url, {
                    method: 'GET',
                    cache: 'no-cache'
                });
                
                const response = await Promise.race([fetchPromise, timeoutPromise]);
                
                if (response.ok) {
                    const data = await response.json();
                    let processed;
                    
                    // Call the processor function directly
                    if (api.process === 'processTheTriviaApi') {
                        processed = processTheTriviaApi(data);
                    } else if (api.process === 'processOpenTriviaApi') {
                        processed = processOpenTriviaApi(data);
                    }
                    
                    if (processed && processed.length > 0) {
                        api.working = true;
                        results.push(`${api.name}: ✅ Working (${processed.length} questions)`);
                        Utils.log(`${api.name} is working!`, 'success');
                    } else {
                        api.working = false;
                        results.push(`${api.name}: ❌ No valid questions`);
                        Utils.log(`${api.name} returned no valid questions`, 'warn');
                    }
                } else {
                    api.working = false;
                    results.push(`${api.name}: ❌ HTTP ${response.status}`);
                    Utils.log(`${api.name} HTTP error: ${response.status}`, 'error');
                }
            } catch (error) {
                api.working = false;
                const errorMsg = error.message === 'Timeout' ? 'Timeout' : 'Error';
                results.push(`${api.name}: ❌ ${errorMsg}`);
                Utils.log(`${api.name} failed: ${error.message}`, 'error');
            }
        }
        
        DOM.setHTML('apiStatusDisplay', `<div>${results.join('<br>')}</div>`);
        
        const workingApis = STATIC_DATA.TRIVIA_APIS.filter(api => api.working).length;
        Utils.log(`API test complete: ${workingApis}/${STATIC_DATA.TRIVIA_APIS.length} APIs working`, workingApis > 0 ? 'success' : 'warn');
    },

    async fetchQuestionsFromAnyApi() {
        const now = Date.now();
        if (now - gameState.lastApiCall < CONFIG.API_RATE_LIMIT) {
            Utils.log(`Rate limit: waiting ${Math.ceil((CONFIG.API_RATE_LIMIT - (now - gameState.lastApiCall)) / 1000)} seconds`, 'warn');
            return false;
        }

        const workingApis = STATIC_DATA.TRIVIA_APIS.filter(api => api.working === true);
        
        if (workingApis.length === 0) {
            Utils.log('No working APIs available', 'warn');
            return false;
        }

        for (const api of workingApis) {
            try {
                Utils.log(`🌐 Fetching questions from ${api.name}...`);
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 8000)
                );
                
                const fetchPromise = fetch(api.url, {
                    method: 'GET',
                    cache: 'no-cache'
                });
                
                const response = await Promise.race([fetchPromise, timeoutPromise]);
                gameState.lastApiCall = now;
                
                if (response.ok) {
                    const data = await response.json();
                    let processedQuestions;
                    
                    // Call the processor function directly
                    if (api.process === 'processTheTriviaApi') {
                        processedQuestions = processTheTriviaApi(data);
                    } else if (api.process === 'processOpenTriviaApi') {
                        processedQuestions = processOpenTriviaApi(data);
                    }
                    
                    if (processedQuestions && processedQuestions.length > 0) {
                        gameState.apiQuestions = processedQuestions;
                        Utils.log(`✅ Loaded ${processedQuestions.length} questions from ${api.name}`, 'success');
                        return true;
                    }
                }
            } catch (error) {
                Utils.log(`${api.name} failed: ${error.message}`, 'error');
                api.working = false;
            }
        }
        
        return false;
    }
};

// ========================================
// API PROCESSORS
// ========================================

function processTheTriviaApi(data) {
    try {
        if (!Array.isArray(data)) return [];
        
        return data.map(q => {
            if (!q.question || !q.correctAnswer || !Array.isArray(q.incorrectAnswers)) return null;
            
            const allAnswers = [q.correctAnswer, ...q.incorrectAnswers];
            const shuffledAnswers = Utils.shuffle(allAnswers);
            const correctIndex = shuffledAnswers.indexOf(q.correctAnswer);
            
            const categoryMapping = {
                'science': 'Science',
                'history': 'History', 
                'geography': 'Geography',
                'sport_and_leisure': 'Sports',
                'film_and_tv': 'Entertainment',
                'arts_and_literature': 'Literature',
                'food_and_drink': 'Science',
                'general_knowledge': 'Science',
                'music': 'Entertainment',
                'society_and_culture': 'History'
            };
            
            return {
                question: q.question.text || q.question,
                options: shuffledAnswers,
                correct: correctIndex,
                category: categoryMapping[q.category] || 'Science',
                source: 'the-trivia-api'
            };
        }).filter(q => q !== null);
    } catch (error) {
        Utils.log(`Error processing The Trivia API data: ${error.message}`, 'error');
        return [];
    }
}

function processOpenTriviaApi(data) {
    try {
        if (data.response_code !== 0 || !Array.isArray(data.results)) return [];
        
        return data.results.map(q => {
            if (!q.question || !q.correct_answer || !Array.isArray(q.incorrect_answers)) return null;
            
            const decodeHtml = (html) => {
                const txt = document.createElement('textarea');
                txt.innerHTML = html;
                return txt.value;
            };
            
            const allAnswers = [
                decodeHtml(q.correct_answer),
                ...q.incorrect_answers.map(ans => decodeHtml(ans))
            ];
            
            const shuffledAnswers = Utils.shuffle(allAnswers);
            const correctIndex = shuffledAnswers.indexOf(decodeHtml(q.correct_answer));
            
            const categoryMapping = {
                'Science: Computers': 'Technology',
                'Science: Mathematics': 'Mathematics',
                'Science: Nature': 'Nature',
                'Science & Nature': 'Science',
                'Entertainment: Video Games': 'Entertainment',
                'Entertainment: Music': 'Entertainment',
                'Entertainment: Film': 'Entertainment',
                'Entertainment: Television': 'Entertainment',
                'Entertainment: Books': 'Literature',
                'Sports': 'Sports',
                'History': 'History',
                'Geography': 'Geography',
                'General Knowledge': 'Science'
            };
            
            return {
                question: decodeHtml(q.question),
                options: shuffledAnswers,
                correct: correctIndex,
                category: categoryMapping[q.category] || 'Science',
                source: 'opentdb'
            };
        }).filter(q => q !== null);
    } catch (error) {
        Utils.log(`Error processing Open Trivia DB data: ${error.message}`, 'error');
        return [];
    }
}

// ========================================
// GAME STATE MANAGEMENT
// ========================================

const GameStateManager = {
    reset() {
        Utils.log('Resetting game state...');
        
        if (gameState.currentTimer) {
            clearInterval(gameState.currentTimer);
            gameState.currentTimer = null;
        }

        if (gameState.supabaseSubscription) {
            gameState.supabaseSubscription.unsubscribe();
            gameState.supabaseSubscription = null;
        }
        
        initializeGameState();
        Utils.log('Game state reset complete', 'success');
    },

    getNextQuestion(preferredCategory = null) {
        // Try API questions first
        if (gameState.apiQuestions.length > 0) {
            let question;
            
            if (preferredCategory) {
                const categoryIndex = gameState.apiQuestions.findIndex(q => q.category === preferredCategory);
                if (categoryIndex !== -1) {
                    question = gameState.apiQuestions.splice(categoryIndex, 1)[0];
                    Utils.log(`Using API question from ${preferredCategory} (${question.source})`, 'success');
                    return question;
                }
            }
            
            question = gameState.apiQuestions.shift();
            Utils.log(`Using API question from ${question.category} (${question.source})`, 'success');
            return question;
        }
        
        // Fallback to backup questions
        if (preferredCategory && gameState.backupQuestions.length > 0) {
            const categoryQuestions = gameState.backupQuestions.filter(q => q.category === preferredCategory);
            if (categoryQuestions.length > 0) {
                const question = categoryQuestions[0];
                gameState.backupQuestions = gameState.backupQuestions.filter(q => q !== question);
                Utils.log(`Using backup question from ${preferredCategory}`, 'warn');
                return question;
            }
        }
        
        if (gameState.backupQuestions.length > 0) {
            const question = gameState.backupQuestions.shift();
            Utils.log(`Using backup question from ${question.category}`, 'warn');
            return question;
        }
        
        // Ultimate fallback
        Utils.log('Using fallback math question', 'warn');
        return { 
            question: "What is 2 + 2?", 
            options: ["3", "4", "5", "6"], 
            correct: 1, 
            category: "Mathematics",
            source: 'fallback'
        };
    }
};

// ========================================
// MULTIPLAYER FUNCTIONS
// ========================================

const MultiplayerManager = {
    async createRoom() {
        try {
            const username = gameState.pendingUsername;
            if (!username) {
                Utils.log('No username provided', 'error');
                return;
            }

            GameStateManager.reset();

            gameState.room = Utils.generateRoomCode();
            gameState.isHost = true;
            gameState.currentPlayer = {
                id: `host_${Date.now()}`,
                name: username,
                score: 0,
                correctAnswers: 0,
                pointsStolen: 0,
                isHost: true,
                isOnline: true
            };

            try {
                const { data, error } = await supabaseClient
                    .from('rooms')
                    .insert([{ code: gameState.room, status: 'waiting' }]);
                
                if (error) throw error;

                const { data: playerData, error: playerError } = await supabaseClient
                    .from('players')
                    .insert([{ 
                        room_code: gameState.room, 
                        username: username, 
                        is_host: true,
                        player_id: gameState.currentPlayer.id,
                        score: 0
                    }]);
                
                if (playerError) throw playerError;

                this.subscribeToPlayers(gameState.room);
                await this.syncPlayersFromDatabase();
                ConnectionManager.updateStatus('online', 'Room Created');
                
            } catch (error) {
                Utils.log(`Supabase error (using offline mode): ${error.message}`, 'warn');
                ConnectionManager.updateStatus('offline', 'Offline Mode');
                gameState.players = [gameState.currentPlayer];
            }

            Utils.log(`Room created: ${gameState.room}`, 'success');

            APIManager.fetchQuestionsFromAnyApi().then(success => {
                if (success) {
                    PlayerManager.updateQuestionStatus();
                }
            });

            PlayerManager.showLobby();

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

            if (!roomCode || roomCode.length !== 6) {
                alert('Please enter a valid 6-character room code.');
                return;
            }
            if (!username) {
                alert('Please enter your username.');
                return;
            }

            try {
                const { data: roomData, error: roomError } = await supabaseClient
                    .from('rooms')
                    .select('*')
                    .eq('code', roomCode)
                    .single();
                
                if (roomError || !roomData) {
                    alert('Room not found. Please check the code and try again.');
                    return;
                }

                GameStateManager.reset();
                gameState.room = roomCode;
                gameState.isHost = false;
                gameState.currentPlayer = {
                    id: `player_${Date.now()}`,
                    name: username,
                    score: 0,
                    correctAnswers: 0,
                    pointsStolen: 0,
                    isHost: false,
                    isOnline: true
                };

                const { data: playerData, error: playerError } = await supabaseClient
                    .from('players')
                    .insert([{ 
                        room_code: roomCode, 
                        username: username,
                        is_host: false,
                        player_id: gameState.currentPlayer.id,
                        score: 0
                    }]);
                
                if (playerError) throw playerError;

                this.subscribeToPlayers(roomCode);
                await this.syncPlayersFromDatabase();
                ConnectionManager.updateStatus('online', 'Joined Room');

            } catch (error) {
                Utils.log(`Supabase error (using offline mode): ${error.message}`, 'warn');
                ConnectionManager.updateStatus('offline', 'Offline Mode');
                GameStateManager.reset();
                gameState.room = roomCode;
                gameState.isHost = false;
                gameState.currentPlayer = {
                    id: 'player',
                    name: username,
                    score: 0,
                    correctAnswers: 0,
                    pointsStolen: 0
                };
                gameState.players = [gameState.currentPlayer];
            }

            PlayerManager.showLobby();

        } catch (error) {
            Utils.log(`Error joining room: ${error.message}`, 'error');
            alert('Failed to join room. Please try again.');
        }
    },

    subscribeToPlayers(roomCode) {
        try {
            gameState.supabaseSubscription = supabaseClient
                .channel(`players-${roomCode}`)
                .on(
                    'postgres_changes',
                    { 
                        event: '*', 
                        schema: 'public', 
                        table: 'players', 
                        filter: `room_code=eq.${roomCode}` 
                    },
                    async (payload) => {
                        Utils.log(`Player update received: ${payload.eventType}`, 'info');
                        await this.syncPlayersFromDatabase();
                        PlayerManager.updatePlayerList();
                    }
                )
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        Utils.log('Successfully subscribed to player updates', 'success');
                        this.syncPlayersFromDatabase();
                    } else if (status === 'CHANNEL_ERROR') {
                        Utils.log('Error subscribing to player updates', 'error');
                        ConnectionManager.updateStatus('offline', 'Connection Error');
                    }
                });
        } catch (error) {
            Utils.log(`Error setting up subscription: ${error.message}`, 'error');
            ConnectionManager.updateStatus('offline', 'Offline Mode');
        }
    },

    async syncPlayersFromDatabase() {
        try {
            if (!gameState.room) return;
            
            const { data: players, error } = await supabaseClient
                .from('players')
                .select('*')
                .eq('room_code', gameState.room);
            
            if (error) {
                Utils.log(`Error fetching players: ${error.message}`, 'error');
                return;
            }

            if (players) {
                const onlinePlayers = players.map(dbPlayer => ({
                    id: dbPlayer.player_id || dbPlayer.username,
                    name: dbPlayer.username,
                    score: dbPlayer.score || 0,
                    correctAnswers: 0,
                    pointsStolen: 0,
                    isHost: dbPlayer.is_host || false,
                    isOnline: true
                }));

                const aiPlayers = gameState.players?.filter(p => p.difficulty) || [];
                gameState.players = [...onlinePlayers, ...aiPlayers];
                
                if (gameState.currentPlayer && !gameState.players.find(p => p.id === gameState.currentPlayer.id)) {
                    gameState.players.push(gameState.currentPlayer);
                }

                Utils.log(`Synced ${onlinePlayers.length} online players + ${aiPlayers.length} AI players`, 'success');
            }
        } catch (error) {
            Utils.log(`Error syncing players: ${error.message}`, 'error');
        }
    }
};

// ========================================
// PLAYER MANAGEMENT
// ========================================

const PlayerManager = {
    showLobby() {
        ScreenManager.show('lobbyScreen');
        
        DOM.setText('roomCodeDisplay', gameState.room);
        this.updatePlayerList();
        this.updateStartButton();
        this.updateQuestionStatus();
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
// TIMER MANAGEMENT
// ========================================

const TimerManager = {
    start(timerId, seconds, callback) {
        if (gameState.currentTimer) {
            clearInterval(gameState.currentTimer);
        }
        
        const timerElement = DOM.get(timerId);
        if (!timerElement) return;
        
        let timeLeft = seconds;
        
        // Apply powerup if available
        if (gameState.powerups.has(gameState.currentPlayer?.id)) {
            const powerup = gameState.powerups.get(gameState.currentPlayer.id);
            if (powerup.type === 'extraTime') {
                timeLeft += 5;
                gameState.powerups.delete(gameState.currentPlayer.id);
                Utils.log('Extra time powerup applied!', 'success');
            }
        }
        
        timerElement.textContent = timeLeft;
        timerElement.style.color = '#ff6b6b';
        
        gameState.currentTimer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(gameState.currentTimer);
                gameState.currentTimer = null;
                callback();
            }
        }, 1000);
    }
};

// ========================================
// MODAL MANAGEMENT
// ========================================

const ModalManager = {
    showUsername() {
        const modal = DOM.get('usernameModal');
        const input = DOM.get('usernameModalInput');
        
        if (modal && input) {
            modal.classList.add('active');
            input.value = '';
            input.focus();
            
            input.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    confirmUsername();
                }
            };
        }
    },

    closeUsername() {
        const modal = DOM.get('usernameModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
};

// ========================================
// GLOBAL FUNCTIONS (Called from HTML)
// ========================================

function showUsernameModal() {
    ModalManager.showUsername();
}

function closeUsernameModal() {
    ModalManager.closeUsername();
}

function confirmUsername() {
    const input = DOM.get('usernameModalInput');
    const username = input?.value?.trim();
    
    if (!username) {
        alert("Please enter a valid username");
        return;
    }
    
    if (username.length > 20) {
        alert("Username must be 20 characters or less");
        return;
    }
    
    gameState.pendingUsername = username;
    ModalManager.closeUsername();
    MultiplayerManager.createRoom();
}

function showJoinScreen() {
    ScreenManager.show('joinRoomScreen');
}

function showHomeScreen() {
    GameStateManager.reset();
    ScreenManager.show('homeScreen');
}

function joinRoom() {
    MultiplayerManager.joinRoom();
}

async function addComputerPlayer(difficulty = 'medium') {
    try {
        if (!gameState.isHost) {
            alert('Only the host can add AI players.');
            return;
        }
        
        if (gameState.players.length >= CONFIG.MAX_PLAYERS) {
            alert('Room is full! Maximum 12 players allowed.');
            return;
        }
        
        const usedNames = new Set(gameState.players.map(p => p.name));
        const availableNames = STATIC_DATA.COMPUTER_NAMES.filter(name => !usedNames.has(name));
        
        if (availableNames.length === 0) {
            alert('No more computer player names available!');
            return;
        }
        
        const computerName = Utils.getRandomElement(availableNames);
        const computerId = 'computer_' + Date.now();
        
        const difficultyEmoji = { easy: '🟢', medium: '🟡', hard: '🔴' };
        const displayName = `${computerName} ${difficultyEmoji[difficulty]}`;
        
        const aiPlayer = {
            id: computerId,
            name: displayName,
            score: 0,
            correctAnswers: 0,
            pointsStolen: 0,
            difficulty: difficulty,
            isOnline: false
        };
        
        gameState.players.push(aiPlayer);
        
        // Update DB if online
        if (isHostAndOnline()) {
            await updateGameStateInDB(gameState);
        }
        
        PlayerManager.updatePlayerList();
        PlayerManager.updateStartButton();
        
        Utils.log(`Added ${difficulty} AI player: ${computerName}`, 'success');
        
    } catch (error) {
        Utils.log(`Error adding computer player: ${error.message}`, 'error');
    }
}

function shareRoom() {
    try {
        if (!gameState.room) {
            alert('No room to share!');
            return;
        }
        // Copy a joinable URL
        const url = `${window.location.origin}${window.location.pathname}?room=${gameState.room}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => alert('Join link copied to clipboard!'))
                .catch(() => alert(`Share this link: ${url}`));
        } else {
            alert(`Share this link: ${url}`);
        }
    } catch (error) {
        Utils.log(`Error sharing room: ${error.message}`, 'error');
        alert(`Share this link: ${window.location.origin}${window.location.pathname}?room=${gameState.room}`);
    }
}

async function startGame() {
    try {
        if (gameState.players.length < CONFIG.MIN_PLAYERS) {
            alert('Need at least 2 players to start!');
            return;
        }
        
        const startBtn = DOM.get('startGameBtn');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.textContent = 'Loading Game...';
        }
        
        if (gameState.supabaseSubscription && gameState.room) {
            try {
                await MultiplayerManager.syncPlayersFromDatabase();
                Utils.log(`Starting game with ${gameState.players.length} total players`, 'success');
            } catch (error) {
                Utils.log(`Error syncing players before game start: ${error.message}`, 'warn');
            }
        }
        
        if (gameState.players.length < CONFIG.MIN_PLAYERS) {
            alert('Need at least 2 players to start!');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.textContent = 'Start Game';
            }
            return;
        }
        
        APIManager.fetchQuestionsFromAnyApi().then(success => {
            if (success) {
                Utils.log('Fresh API questions loaded for game start', 'success');
            } else {
                Utils.log('Using backup questions for game', 'warn');
            }
            
            gameState.currentRound = 1;
            GameController.showCategorySelection();
        });
        
    } catch (error) {
        Utils.log(`Error starting game: ${error.message}`, 'error');
        alert('Failed to start game. Please try again.');
        
        const startBtn = DOM.get('startGameBtn');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = 'Start Game';
        }
    }
}

// ========================================
// GAME CONTROLLER
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
            div.onclick = () => this.selectCategory(category);
            fragment.appendChild(div);
        });
        
        categoryOptions.innerHTML = '';
        categoryOptions.appendChild(fragment);
        
        TimerManager.start('categoryTimer', CONFIG.TIMER_DURATION.category, () => {
            if (!gameState.flags.has('categorySelected')) {
                this.selectCategory(Utils.getRandomElement(shuffledCategories));
            }
        });
    },

    selectCategory(category) {
        if (gameState.flags.has('categorySelected')) return;
        gameState.flags.add('categorySelected');
        
        DOM.getAll('#categoryOptions .option').forEach(opt => opt.classList.remove('selected'));
        event?.target?.classList.add('selected');
        
        setTimeout(() => this.generateQuestion(category), 1000);
    },

    generateQuestion(category) {
        const question = GameStateManager.getNextQuestion(category);
        gameState.currentQuestion = question;
        this.showQuestion();
    },

    showQuestion() {
        ScreenManager.show('questionScreen');
        
        DOM.setText('questionRound', gameState.currentRound);
        DOM.setText('questionText', gameState.currentQuestion.question);
        
        const answerOptions = DOM.get('answerOptions');
        if (!answerOptions) return;
        
        const fragment = document.createDocumentFragment();
        gameState.currentQuestion.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = option;
            div.onclick = () => this.selectAnswer(index);
            fragment.appendChild(div);
        });
        
        answerOptions.innerHTML = '';
        answerOptions.appendChild(fragment);
        
        TimerManager.start('questionTimer', CONFIG.TIMER_DURATION.question, () => {
            if (!gameState.flags.has('answerSelected')) {
                this.selectAnswer(Math.floor(Math.random() * 4));
            }
        });
    },

    selectAnswer(index) {
        if (gameState.flags.has('answerSelected')) return;
        gameState.flags.add('answerSelected');
        
        DOM.getAll('#answerOptions .option').forEach(opt => opt.classList.remove('selected'));
        DOM.getAll('#answerOptions .option')[index]?.classList.add('selected');
        
        gameState.selectedAnswers = [index];
        setTimeout(() => this.processAnswers(), 1000);
    },

    processAnswers() {
        const correct = gameState.currentQuestion.correct;
        const playerAnswered = gameState.selectedAnswers[0] === correct;
        
        gameState.roundAnswers.clear();
        gameState.roundAnswers.set(gameState.currentPlayer.id, { answer: gameState.selectedAnswers[0], correct: playerAnswered });
        
        if (playerAnswered) {
            gameState.currentPlayer.score += CONFIG.POINTS.correct;
            gameState.currentPlayer.correctAnswers++;
            gameState.playerStatus.set(gameState.currentPlayer.id, 'W');
            Utils.log('Player answered correctly!', 'success');
        } else {
            gameState.playerStatus.set(gameState.currentPlayer.id, 'L');
            Utils.log('Player answered incorrectly', 'warn');
        }
        
        // Simulate other players with difficulty-based AI
        gameState.players.forEach(player => {
            if (player.id !== gameState.currentPlayer.id) {
                let randomCorrect;
                
                if (player.difficulty) {
                    const correctChances = { easy: 0.3, medium: 0.5, hard: 0.7 };
                    const correctChance = correctChances[player.difficulty] || 0.5;
                    randomCorrect = Math.random() < correctChance;
                } else {
                    randomCorrect = Math.random() < 0.5;
                }
                
                const randomAnswer = randomCorrect ? correct : Math.floor(Math.random() * 4);
                
                gameState.roundAnswers.set(player.id, { answer: randomAnswer, correct: randomCorrect });
                
                if (randomCorrect) {
                    player.score += CONFIG.POINTS.correct;
                    player.correctAnswers++;
                    gameState.playerStatus.set(player.id, 'W');
                } else {
                    gameState.playerStatus.set(player.id, 'L');
                }
            }
        });
        
        if (gameState.currentRound >= CONFIG.POWERUP_ROUND) {
            this.distributePowerups();
        }
        
        this.showAnswers();
    },

    distributePowerups() {
        const sortedPlayers = [...gameState.players].sort((a, b) => a.score - b.score);
        const bottomQuarter = Math.ceil(sortedPlayers.length * 0.25);
        
        for (let i = 0; i < bottomQuarter; i++) {
            gameState.powerups.set(sortedPlayers[i].id, { type: 'extraTime', description: 'Extra Time' });
        }
    },

    showAnswers() {
        ScreenManager.show('answersScreen');
        const answersDisplay = DOM.get('answersDisplay');
        if (!answersDisplay) return;
        
        const fragment = document.createDocumentFragment();
        
        const highlight = document.createElement('div');
        highlight.className = 'highlight';
        highlight.innerHTML = `<strong>✅ Correct Answer:</strong><br>${gameState.currentQuestion.options[gameState.currentQuestion.correct]}`;
        fragment.appendChild(highlight);
        
        const header = document.createElement('h3');
        header.textContent = 'Player Answers:';
        fragment.appendChild(header);
        
        gameState.players.forEach(player => {
            const playerAnswer = gameState.roundAnswers.get(player.id);
            if (!playerAnswer) return;
            
            const div = document.createElement('div');
            div.className = `item ${playerAnswer.correct ? 'correct' : 'incorrect'}`;
            const answerText = gameState.currentQuestion.options[playerAnswer.answer];
            const resultIcon = playerAnswer.correct ? '✅' : '❌';
            
            div.innerHTML = `<span>${player.name}</span><span>${resultIcon} ${answerText}</span>`;
            fragment.appendChild(div);
        });
        
        answersDisplay.innerHTML = '';
        answersDisplay.appendChild(fragment);
    }
};

// ========================================
// MINIGAME SYSTEM
// ========================================

function proceedToMinigame() {
    const winners = gameState.players.filter(p => gameState.playerStatus.get(p.id) === 'W');
    const losers = gameState.players.filter(p => gameState.playerStatus.get(p.id) === 'L');
    
    const anyPlayerMinigames = ['resource', 'dice', 'codebreaker'];
    const selectedMinigame = CONFIG.MINIGAMES[(gameState.currentRound - 1) % CONFIG.MINIGAMES.length];
    
    if (winners.length === 0 || losers.length === 0) {
        if (!anyPlayerMinigames.includes(selectedMinigame)) {
            Utils.log('Skipping minigame - no valid W/L split and minigame requires it', 'warn');
            setTimeout(() => {
                gameState.playerStatus.clear();
                showScoreboard();
            }, 2000);
            return;
        }
    }
    
    gameState.currentMinigame = selectedMinigame;
    Utils.log(`Starting ${selectedMinigame} minigame (${winners.length} winners vs ${losers.length} losers)`, 'success');
    
    // Load minigame module
    MinigameController.start(selectedMinigame);
}

const MinigameController = {
    start(minigameName) {
        switch (minigameName) {
            case 'hunting':
                this.showHuntingSeason();
                break;
            case 'quantum':
                this.showQuantumLeap();
                break;
            case 'resource':
                this.showResourceRace();
                break;
            case 'dice':
                this.showDiceDuel();
                break;
            case 'codebreaker':
                this.showCodebreaker();
                break;
            default:
                this.showHuntingSeason();
        }
    },

    showHuntingSeason() {
        ScreenManager.show('huntingSeasonScreen');
        gameState.minigameSelections.clear();
        
        // Use modular UI if available, otherwise fallback to original
        if (window.minigamesUI && window.minigamesUI.buildHuntingSeasonUI) {
            window.minigamesUI.buildHuntingSeasonUI(gameState, DOM, (index) => {
                if (!gameState.minigameSelections.has(gameState.currentPlayer.id)) {
                    gameState.minigameSelections.set(gameState.currentPlayer.id, index);
                    Utils.log(`Player selected square ${index + 1}`, 'success');
                    this.simulateAIMinigameSelections();
                    setTimeout(() => this.processMinigameResults(), 1500);
                }
            });
        } else {
            // Fallback to original implementation
            this.updateHuntingPlayerStatus();
            this.createHuntingGrid();
        }
        
        TimerManager.start('huntingTimer', CONFIG.TIMER_DURATION.hunting, () => {
            if (!gameState.minigameSelections.has(gameState.currentPlayer.id)) {
                const randomSquare = Math.floor(Math.random() * CONFIG.GRID_SIZE);
                gameState.minigameSelections.set(gameState.currentPlayer.id, randomSquare);
                this.simulateAIMinigameSelections();
                setTimeout(() => this.processMinigameResults(), 1500);
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
            cell.onclick = () => this.selectHuntingSquare(i);
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
        
        this.simulateAIMinigameSelections();
        setTimeout(() => this.processMinigameResults(), 1500);
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
        
        this.showMinigameResults(results, winnerSelections, loserSelections);
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

    // Placeholder implementations for other minigames
    showQuantumLeap() {
        ScreenManager.show('quantumLeapScreen');
        
        if (window.minigamesUI && window.minigamesUI.buildQuantumLeapUI) {
            window.minigamesUI.buildQuantumLeapUI(gameState, DOM, (leapPos) => {
                gameState.quantumPositions.set(gameState.currentPlayer.id, leapPos);
                window.minigamesUI.buildQuantumLeapUI(gameState, DOM, (trapPos) => {
                    gameState.quantumTraps.set(gameState.currentPlayer.id, trapPos);
                    setTimeout(() => this.processQuantumResults(), 1000);
                }, 2);
            }, 1);
        }
        
        TimerManager.start('quantumTimer', CONFIG.TIMER_DURATION.quantum, () => {
            if (!gameState.quantumPositions.has(gameState.currentPlayer.id)) {
                const rand = Math.floor(Math.random() * 10) + 1;
                gameState.quantumPositions.set(gameState.currentPlayer.id, rand);
                setTimeout(() => this.processQuantumResults(), 1000);
            }
        });
    },
    showQuantumTrapPhase(leapPos) {
        const instructions = DOM.get('quantumInstructions');
        instructions.textContent = 'Now, place a trap on any position!';
        const positionsDiv = DOM.get('quantumPositions');
        positionsDiv.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const btn = document.createElement('button');
            btn.className = 'position-btn';
            btn.textContent = i;
            btn.onclick = () => {
                gameState.quantumTraps.set(gameState.currentPlayer.id, i);
                DOM.getAll('#quantumPositions .position-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                setTimeout(() => this.processQuantumResults(), 1000);
            };
            positionsDiv.appendChild(btn);
        }
    },
    processQuantumResults() {
        // Simulate AI and scoring, then show results (for brevity, simplified)
        this.showMinigameResults(['Quantum Leap completed!'], new Map(), new Map());
    },
    showResourceRace() {
        ScreenManager.show('resourceRaceScreen');
        const controls = DOM.get('resourceControls');
        controls.innerHTML = '';
        let allocated = 0;
        let allocations = {};
        gameState.players.forEach(player => {
            if (player.id === gameState.currentPlayer.id) return;
            const div = document.createElement('div');
            div.textContent = `Sabotage ${player.name}: `;
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.max = 10;
            input.value = 0;
            input.oninput = () => {
                allocations[player.id] = parseInt(input.value) || 0;
                allocated = Object.values(allocations).reduce((a, b) => a + b, 0);
                if (allocated > 10) input.value = 10 - (allocated - allocations[player.id]);
            };
            div.appendChild(input);
            controls.appendChild(div);
        });
        const buildDiv = document.createElement('div');
        buildDiv.textContent = 'Build Projects: ';
        const buildInput = document.createElement('input');
        buildInput.type = 'number';
        buildInput.min = 0;
        buildInput.max = 10;
        buildInput.value = 10;
        buildInput.oninput = () => {
            allocations['build'] = parseInt(buildInput.value) || 0;
            allocated = Object.values(allocations).reduce((a, b) => a + b, 0);
            if (allocated > 10) buildInput.value = 10 - (allocated - allocations['build']);
        };
        buildDiv.appendChild(buildInput);
        controls.appendChild(buildDiv);
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit Allocation';
        submitBtn.onclick = () => {
            gameState.resourceData.set(gameState.currentPlayer.id, allocations);
            setTimeout(() => this.processResourceResults(), 1000);
        };
        controls.appendChild(submitBtn);
        TimerManager.start('resourceTimer', CONFIG.TIMER_DURATION.resource, () => {
            if (!gameState.resourceData.has(gameState.currentPlayer.id)) {
                gameState.resourceData.set(gameState.currentPlayer.id, { build: 10 });
                this.processResourceResults();
            }
        });
    },
    processResourceResults() {
        this.showMinigameResults(['Resource Race completed!'], new Map(), new Map());
    },
    showDiceDuel() {
        ScreenManager.show('diceDuelScreen');
        const controls = DOM.get('diceControls');
        controls.innerHTML = '';
        let diceCount = 1;
        let bet = 0;
        const diceLabel = document.createElement('label');
        diceLabel.textContent = 'Number of dice (1-3): ';
        const diceInput = document.createElement('input');
        diceInput.type = 'number';
        diceInput.min = 1;
        diceInput.max = 3;
        diceInput.value = 1;
        diceInput.oninput = () => { diceCount = parseInt(diceInput.value) || 1; };
        controls.appendChild(diceLabel);
        controls.appendChild(diceInput);
        controls.appendChild(document.createElement('br'));
        const betLabel = document.createElement('label');
        betLabel.textContent = 'Bet points (optional): ';
        const betInput = document.createElement('input');
        betInput.type = 'number';
        betInput.min = 0;
        betInput.max = 10;
        betInput.value = 0;
        betInput.oninput = () => { bet = parseInt(betInput.value) || 0; };
        controls.appendChild(betLabel);
        controls.appendChild(betInput);
        controls.appendChild(document.createElement('br'));
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Roll Dice!';
        submitBtn.onclick = () => {
            gameState.diceData.set(gameState.currentPlayer.id, { diceCount, bet });
            setTimeout(() => this.processDiceResults(), 1000);
        };
        controls.appendChild(submitBtn);
        TimerManager.start('diceTimer', CONFIG.TIMER_DURATION.dice, () => {
            if (!gameState.diceData.has(gameState.currentPlayer.id)) {
                gameState.diceData.set(gameState.currentPlayer.id, { diceCount: 1, bet: 0 });
                this.processDiceResults();
            }
        });
    },
    processDiceResults() {
        this.showMinigameResults(['Dice Duel completed!'], new Map(), new Map());
    },
    showCodebreaker() {
        ScreenManager.show('codebreakerScreen');
        const controls = DOM.get('codeControls');
        controls.innerHTML = '';
        const guess = [];
        const symbols = ['🔴', '🟡', '🟢', '🔵'];
        for (let i = 0; i < 4; i++) {
            const select = document.createElement('select');
            symbols.forEach(sym => {
                const opt = document.createElement('option');
                opt.value = sym;
                opt.textContent = sym;
                select.appendChild(opt);
            });
            select.onchange = () => { guess[i] = select.value; };
            controls.appendChild(select);
        }
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit Guess';
        submitBtn.onclick = () => {
            gameState.codeData.attempts.push([...guess]);
            setTimeout(() => this.processCodebreakerResults(), 1000);
        };
        controls.appendChild(submitBtn);
        TimerManager.start('codeTimer', CONFIG.TIMER_DURATION.code, () => {
            if (gameState.codeData.attempts.length === 0) {
                gameState.codeData.attempts.push(['🔴', '🟡', '🟢', '🔵']);
                this.processCodebreakerResults();
            }
        });
    },
    processCodebreakerResults() {
        this.showMinigameResults(['Codebreaker completed!'], new Map(), new Map());
    },
    // ... existing code ...
};
// ... existing code ...

// ========================================
// SCOREBOARD AND GAME FLOW
// ========================================

function showScoreboard() {
    ScreenManager.show('scoreboardScreen');
    
    const scoreboard = DOM.get('scoreboard');
    if (!scoreboard) return;
    
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const fragment = document.createDocumentFragment();
    
    const header = document.createElement('h3');
    header.textContent = `Round ${gameState.currentRound} Standings`;
    fragment.appendChild(header);
    
    sortedPlayers.forEach((player, index) => {
        const div = document.createElement('div');
        div.className = `item ${index === 0 ? 'winner' : ''}`;
        
        const powerupHTML = gameState.powerups.has(player.id) ? '<span class="status powerup">💪</span>' : '';
        
        div.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span>${player.score} pts ${powerupHTML}</span>
        `;
        fragment.appendChild(div);
    });
    
    scoreboard.innerHTML = '';
    scoreboard.appendChild(fragment);
    
    const nextBtn = DOM.get('nextRoundBtn');
    if (nextBtn) {
        if (gameState.currentRound >= CONFIG.FINAL_ROUND) {
            nextBtn.textContent = 'Final Round';
            nextBtn.onclick = () => showFinalRound();
        } else {
            nextBtn.textContent = 'Next Round';
            nextBtn.onclick = () => nextRound();
        }
    }
}

function nextRound() {
    gameState.currentRound++;
    gameState.selectedAnswers = [];
    gameState.playerStatus.clear();
    
    // Clear minigame data
    gameState.minigameSelections.clear();
    gameState.quantumPositions.clear();
    gameState.quantumTraps.clear();
    gameState.resourceData.clear();
    gameState.diceData.clear();
    gameState.codeData = {
        secretCode: [],
        attempts: [],
        currentAttempt: 0,
        guessOrder: []
    };
    gameState.currentMinigame = null;
    
    Utils.log(`Starting Round ${gameState.currentRound}`, 'success');
    GameController.showCategorySelection();
}

function showFinalRound() {
    ScreenManager.show('finalRoundScreen');
    
    DOM.setText('finalQuestionText', STATIC_DATA.FINAL_ROUND_QUESTION.question);
    
    const finalOptions = DOM.get('finalOptions');
    if (!finalOptions) return;
    
    const fragment = document.createDocumentFragment();
    STATIC_DATA.FINAL_ROUND_QUESTION.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = option;
        div.onclick = () => selectFinalAnswer(index);
        fragment.appendChild(div);
    });
    
    finalOptions.innerHTML = '';
    finalOptions.appendChild(fragment);
    
    gameState.selectedAnswers = [];
    
    TimerManager.start('finalTimer', CONFIG.TIMER_DURATION.final, () => {
        if (gameState.selectedAnswers.length === 0) {
            const randomAnswers = Utils.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
            gameState.selectedAnswers = randomAnswers;
        }
        processFinalAnswers();
    });
}

function selectFinalAnswer(index) {
    if (gameState.selectedAnswers.includes(index)) {
        gameState.selectedAnswers = gameState.selectedAnswers.filter(a => a !== index);
        DOM.getAll('#finalOptions .option')[index].classList.remove('selected');
    } else if (gameState.selectedAnswers.length < 2) {
        gameState.selectedAnswers.push(index);
        DOM.getAll('#finalOptions .option')[index].classList.add('selected');
    }
    
    if (gameState.selectedAnswers.length === 2) {
        setTimeout(() => processFinalAnswers(), 1000);
    }
}

function processFinalAnswers() {
    const correctAnswers = STATIC_DATA.FINAL_ROUND_QUESTION.correct;
    const playerCorrect = gameState.selectedAnswers.filter(a => correctAnswers.includes(a)).length;
    
    let points = 0;
    if (playerCorrect === 2) {
        points = CONFIG.POINTS.finalFull;
    } else if (playerCorrect === 1) {
        points = CONFIG.POINTS.finalPartial;
    }
    
    gameState.currentPlayer.score += points;
    gameState.finalAnswers.set(gameState.currentPlayer.id, { 
        answers: gameState.selectedAnswers, 
        correct: playerCorrect, 
        points: points 
    });
    
    // Simulate other players
    gameState.players.forEach(player => {
        if (player.id !== gameState.currentPlayer.id) {
            let aiAnswers;
            if (player.difficulty === 'hard') {
                if (Math.random() < 0.7) {
                    aiAnswers = [...correctAnswers];
                } else if (Math.random() < 0.8) {
                    aiAnswers = [correctAnswers[0], Math.floor(Math.random() * 5)];
                } else {
                    aiAnswers = [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)];
                }
            } else if (player.difficulty === 'easy') {
                aiAnswers = Utils.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
            } else {
                if (Math.random() < 0.4) {
                    aiAnswers = [...correctAnswers];
                } else if (Math.random() < 0.6) {
                    aiAnswers = [correctAnswers[0], Math.floor(Math.random() * 5)];
                } else {
                    aiAnswers = Utils.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
                }
            }
            
            const aiCorrect = aiAnswers.filter(a => correctAnswers.includes(a)).length;
            let aiPoints = 0;
            if (aiCorrect === 2) {
                aiPoints = CONFIG.POINTS.finalFull;
            } else if (aiCorrect === 1) {
                aiPoints = CONFIG.POINTS.finalPartial;
            }
            
            player.score += aiPoints;
            gameState.finalAnswers.set(player.id, { 
                answers: aiAnswers, 
                correct: aiCorrect, 
                points: aiPoints 
            });
        }
    });
    
    showFinalAnswers();
}

function showFinalAnswers() {
    ScreenManager.show('finalAnswersScreen');
    
    const finalAnswersDisplay = DOM.get('finalAnswersDisplay');
    if (!finalAnswersDisplay) return;
    
    const fragment = document.createDocumentFragment();
    
    const highlight = document.createElement('div');
    highlight.className = 'highlight';
    const correctOptions = STATIC_DATA.FINAL_ROUND_QUESTION.correct.map(i => STATIC_DATA.FINAL_ROUND_QUESTION.options[i]);
    highlight.innerHTML = `<strong>✅ Correct Answers:</strong><br>${correctOptions.join(' and ')}`;
    fragment.appendChild(highlight);
    
    const header = document.createElement('h3');
    header.textContent = 'Final Round Results:';
    fragment.appendChild(header);
    
    gameState.players.forEach(player => {
        const playerResult = gameState.finalAnswers.get(player.id);
        if (!playerResult) return;
        
        const div = document.createElement('div');
        let className = 'item ';
        if (playerResult.correct === 2) {
            className += 'correct';
        } else if (playerResult.correct === 1) {
            className += 'partially-correct';
        } else {
            className += 'incorrect';
        }
        div.className = className;
        
        const playerAnswers = playerResult.answers.map(i => STATIC_DATA.FINAL_ROUND_QUESTION.options[i]);
        const resultText = `${playerResult.correct}/2 correct (+${playerResult.points} pts)`;
        
        div.innerHTML = `
            <div>
                <strong>${player.name}</strong><br>
                <small>${playerAnswers.join(', ')}</small>
            </div>
            <span>${resultText}</span>
        `;
        fragment.appendChild(div);
    });
    
    finalAnswersDisplay.innerHTML = '';
    finalAnswersDisplay.appendChild(fragment);
}

function showFinalResults() {
    ScreenManager.show('finalResultsScreen');
    
    const finalScoreboard = DOM.get('finalScoreboard');
    if (!finalScoreboard) return;
    
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const fragment = document.createDocumentFragment();
    
    const header = document.createElement('h3');
    header.textContent = '🏆 Championship Results';
    fragment.appendChild(header);
    
    sortedPlayers.forEach((player, index) => {
        const div = document.createElement('div');
        div.className = `item ${index === 0 ? 'winner' : ''}`;
        
        const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        
        div.innerHTML = `
            <div>
                <strong>${rank} ${player.name}</strong>
                <br>
                <small>Correct: ${player.correctAnswers} | Stolen: ${player.pointsStolen || 0}</small>
            </div>
            <div>
                <strong>${player.score} pts</strong>
            </div>
        `;
        fragment.appendChild(div);
    });
    
    finalScoreboard.innerHTML = '';
    finalScoreboard.appendChild(fragment);
}

function playAgain() {
    if (confirm('Start a new game with the same players?')) {
        gameState.players.forEach(player => {
            player.score = 0;
            player.correctAnswers = 0;
            player.pointsStolen = 0;
        });
        
        gameState.currentRound = 1;
        gameState.playerStatus.clear();
        gameState.powerups.clear();
        gameState.backupQuestions = [...STATIC_DATA.BACKUP_QUESTIONS];
        
        // Reset all minigame data
        gameState.minigameSelections.clear();
        gameState.quantumPositions.clear();
        gameState.quantumTraps.clear();
        gameState.resourceData.clear();
        gameState.diceData.clear();
        gameState.codeData = {
            secretCode: [],
            attempts: [],
            currentAttempt: 0,
            guessOrder: []
        };
        gameState.currentMinigame = null;
        
        APIManager.fetchQuestionsFromAnyApi();
        PlayerManager.showLobby();
    }
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================

function setupEventListeners() {
    // Modal buttons
    const confirmUsernameBtn = DOM.get('confirmUsernameBtn');
    const cancelUsernameBtn = DOM.get('cancelUsernameBtn');
    if (confirmUsernameBtn) confirmUsernameBtn.onclick = confirmUsername;
    if (cancelUsernameBtn) cancelUsernameBtn.onclick = closeUsernameModal;
    
    // Offline modal functionality
    const connectionStatus = DOM.get('connectionStatus');
    const offlineModal = DOM.get('offlineModal');
    
    if (connectionStatus && offlineModal) {
        connectionStatus.addEventListener('mouseenter', function() {
            if (ConnectionManager.status === 'offline') {
                offlineModal.classList.add('active');
            }
        });
        
        connectionStatus.addEventListener('mouseleave', function() {
            offlineModal.classList.remove('active');
        });
        
        connectionStatus.addEventListener('click', function() {
            if (ConnectionManager.status === 'offline') {
                offlineModal.classList.toggle('active');
            }
        });
    }
    
    // Home screen buttons
    const createRoomBtn = DOM.get('createRoomBtn');
    const joinRoomBtn = DOM.get('joinRoomBtn');
    if (createRoomBtn) createRoomBtn.onclick = showUsernameModal;
    if (joinRoomBtn) joinRoomBtn.onclick = showJoinScreen;
    
    // Join screen buttons
    const joinGameBtn = DOM.get('joinGameBtn');
    const backToHomeBtn = DOM.get('backToHomeBtn');
    if (joinGameBtn) joinGameBtn.onclick = joinRoom;
    if (backToHomeBtn) backToHomeBtn.onclick = showHomeScreen;
    
    // Lobby screen buttons
    const addEasyAIBtn = DOM.get('addEasyAIBtn');
    const addMediumAIBtn = DOM.get('addMediumAIBtn');
    const addHardAIBtn = DOM.get('addHardAIBtn');
    const shareRoomBtn = DOM.get('shareRoomBtn');
    const startGameBtn = DOM.get('startGameBtn');
    const leaveRoomBtn = DOM.get('leaveRoomBtn');
    
    if (addEasyAIBtn) addEasyAIBtn.onclick = () => addComputerPlayer('easy');
    if (addMediumAIBtn) addMediumAIBtn.onclick = () => addComputerPlayer('medium');
    if (addHardAIBtn) addHardAIBtn.onclick = () => addComputerPlayer('hard');
    if (shareRoomBtn) shareRoomBtn.onclick = shareRoom;
    if (startGameBtn) startGameBtn.onclick = startGame;
    if (leaveRoomBtn) leaveRoomBtn.onclick = showHomeScreen;
    
    // Game flow buttons
    const proceedToMinigameBtn = DOM.get('proceedToMinigameBtn');
    const continueToScoreboardBtn = DOM.get('continueToScoreboardBtn');
    const nextRoundBtn = DOM.get('nextRoundBtn');
    const viewFinalResultsBtn = DOM.get('viewFinalResultsBtn');
    const playAgainBtn = DOM.get('playAgainBtn');
    const mainMenuBtn = DOM.get('mainMenuBtn');
    
    if (proceedToMinigameBtn) proceedToMinigameBtn.onclick = proceedToMinigame;
    if (continueToScoreboardBtn) continueToScoreboardBtn.onclick = showScoreboard;
    if (nextRoundBtn) nextRoundBtn.onclick = nextRound;
    if (viewFinalResultsBtn) viewFinalResultsBtn.onclick = showFinalResults;
    if (playAgainBtn) playAgainBtn.onclick = playAgain;
    if (mainMenuBtn) mainMenuBtn.onclick = showHomeScreen;
    
    // Enter key handlers
    const usernameModalInput = DOM.get('usernameModalInput');
    const roomCodeInput = DOM.get('roomCodeInput');
    const usernameInput = DOM.get('usernameInput');
    
    if (usernameModalInput) {
        usernameModalInput.onkeypress = function(e) {
            if (e.key === 'Enter') confirmUsername();
        };
    }
    
    if (roomCodeInput) {
        roomCodeInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                const usernameField = DOM.get('usernameInput');
                if (usernameField) usernameField.focus();
            }
        };
    }
    
    if (usernameInput) {
        usernameInput.onkeypress = function(e) {
            if (e.key === 'Enter') joinRoom();
        };
    }
    
    // Room code click-to-copy
    const roomCodeDisplay = DOM.get('roomCodeDisplay');
    if (roomCodeDisplay) {
        roomCodeDisplay.onclick = () => {
            if (gameState.room) shareRoom();
        };
    }
    
    Utils.log('Event listeners setup complete', 'success');
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    Utils.log('🎮 Trivia Murder Party Loading...', 'success');
    
    try {
        // Initialize game state
        initializeGameState();
        
        // Setup event listeners first
        setupEventListeners();
        
        // Initialize Supabase
        await ConnectionManager.initializeSupabase();
        
        // Check critical elements
        const criticalElements = ['homeScreen', 'lobbyScreen', 'categoryScreen', 'questionScreen'];
        const missingElements = criticalElements.filter(id => !DOM.get(id));
        
        if (missingElements.length > 0) {
            Utils.log(`Missing critical elements: ${missingElements.join(', ')}`, 'error');
            return;
        }
        
        // Handle URL parameters for direct room joining
        const urlParams = new URLSearchParams(window.location.search);
        const roomCode = urlParams.get('room');
        if (roomCode) {
            const roomInput = DOM.get('roomCodeInput');
            if (roomInput) {
                roomInput.value = roomCode;
                ScreenManager.show('joinRoomScreen');
            }
        }
        
        // Test APIs
        setTimeout(() => {
            APIManager.testAllApis();
        }, 1000);
        
        Utils.log('🎮 Trivia Murder Party Initialized!', 'success');
        
    } catch (error) {
        Utils.log(`Initialization error: ${error.message}`, 'error');
        ConnectionManager.updateStatus('offline', 'Init Failed');
    }
});

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Prevent zoom on mobile double-tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Page visibility handling for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (gameState.currentTimer) {
            clearInterval(gameState.currentTimer);
            Utils.log('Game paused (page hidden)');
        }
    } else {
        Utils.log('Game resumed (page visible)');
    }
});

// Memory cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (gameState.supabaseSubscription) {
        gameState.supabaseSubscription.unsubscribe();
    }
    if (gameState.currentTimer) {
        clearInterval(gameState.currentTimer);
    }
});

// Export for debugging (development only)
if (typeof window !== 'undefined') {
    window.gameState = gameState;
    window.GameController = GameController;
    window.Utils = Utils;
    
    // Ensure global functions are accessible
    window.showUsernameModal = showUsernameModal;
    window.closeUsernameModal = closeUsernameModal;
    window.confirmUsername = confirmUsername;
    window.showJoinScreen = showJoinScreen;
    window.showHomeScreen = showHomeScreen;
    window.joinRoom = joinRoom;
    window.addComputerPlayer = addComputerPlayer;
    window.shareRoom = shareRoom;
    window.startGame = startGame;
    window.proceedToMinigame = proceedToMinigame;
    window.showScoreboard = showScoreboard;
    window.nextRound = nextRound;
    window.showFinalRound = showFinalRound;
    window.selectFinalAnswer = selectFinalAnswer;
    window.showFinalResults = showFinalResults;
    window.playAgain = playAgain;
}

// --- Multiplayer Game State Sync ---
// Add a Supabase 'games' table for room state. On host actions, update; all clients subscribe and react.
let gameStateSubscription = null;

async function updateGameStateInDB(newState) {
    if (!gameState.room || !supabaseClient) return;
    try {
        await supabaseClient.from('games').upsert([
            { room_code: gameState.room, state: JSON.stringify(newState) }
        ]);
    } catch (e) {
        Utils.log('Failed to update game state in DB: ' + e.message, 'warn');
    }
}

async function subscribeToGameState(roomCode) {
    if (!supabaseClient) return;
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
                    // Always use players from DB
                    gameState.players = newState.players || [];
                    // Merge in other state
                    Object.assign(gameState, newState);
                    // Update UI to reflect new state
                    if (gameState.currentScreen) ScreenManager.show(gameState.currentScreen);
                    if (gameState.currentScreen === 'lobbyScreen') PlayerManager.updatePlayerList();
                    if (gameState.currentScreen === 'scoreboardScreen') showScoreboard();
                }
            }
        })
        .subscribe();
}

// Patch MultiplayerManager to update and subscribe to game state
MultiplayerManager.createRoom = async function() {
    try {
        const username = gameState.pendingUsername;
        if (!username) { Utils.log('No username provided', 'error'); return; }
        GameStateManager.reset();
        gameState.room = Utils.generateRoomCode();
        gameState.isHost = true;
        gameState.currentPlayer = {
            id: `host_${Date.now()}`,
            name: username,
            score: 0,
            correctAnswers: 0,
            pointsStolen: 0,
            isHost: true,
            isOnline: true
        };
        try {
            await supabaseClient.from('rooms').insert([{ code: gameState.room, status: 'waiting' }]);
            await supabaseClient.from('players').insert([{ 
                room_code: gameState.room, 
                username: username, 
                is_host: true,
                player_id: gameState.currentPlayer.id,
                score: 0
            }]);
            MultiplayerManager.subscribeToPlayers(gameState.room);
            await MultiplayerManager.syncPlayersFromDatabase();
            ConnectionManager.updateStatus('online', 'Room Created');
            // Create initial game state row
            await supabaseClient.from('games').insert([{ room_code: gameState.room, state: JSON.stringify(gameState) }]);
            subscribeToGameState(gameState.room);
        } catch (error) {
            Utils.log(`Supabase error (using offline mode): ${error.message}`, 'warn');
            ConnectionManager.updateStatus('offline', 'Offline Mode');
            gameState.players = [gameState.currentPlayer];
        }
        Utils.log(`Room created: ${gameState.room}`, 'success');
        APIManager.fetchQuestionsFromAnyApi().then(success => {
            if (success) PlayerManager.updateQuestionStatus();
        });
        PlayerManager.showLobby();
        gameState.currentScreen = 'lobbyScreen';
        updateGameStateInDB(gameState);
    } catch (error) {
        Utils.log(`Error creating room: ${error.message}`, 'error');
        alert('Failed to create room. Please try again.');
        ScreenManager.show('homeScreen');
    }
};

MultiplayerManager.joinRoom = async function() {
    try {
        const roomCode = DOM.get('roomCodeInput')?.value?.trim()?.toUpperCase();
        const username = DOM.get('usernameInput')?.value?.trim();
        if (!roomCode || roomCode.length !== 6) { alert('Please enter a valid 6-character room code.'); return; }
        if (!username) { alert('Please enter your username.'); return; }
        try {
            const { data: roomData, error: roomError } = await supabaseClient
                .from('rooms').select('*').eq('code', roomCode).single();
            if (roomError || !roomData) { alert('Room not found. Please check the code and try again.'); return; }
            GameStateManager.reset();
            gameState.room = roomCode;
            gameState.isHost = false;
            gameState.currentPlayer = {
                id: `player_${Date.now()}`,
                name: username,
                score: 0,
                correctAnswers: 0,
                pointsStolen: 0,
                isHost: false,
                isOnline: true
            };
            await supabaseClient.from('players').insert([{ 
                room_code: roomCode, 
                username: username,
                is_host: false,
                player_id: gameState.currentPlayer.id,
                score: 0
            }]);
            MultiplayerManager.subscribeToPlayers(roomCode);
            await MultiplayerManager.syncPlayersFromDatabase();
            ConnectionManager.updateStatus('online', 'Joined Room');
            // Send join request to host via games table
            const { data: gameRow } = await supabaseClient.from('games').select('*').eq('room_code', roomCode).single();
            let joinRequests = (gameRow && gameRow.state && Utils.safeParseJSON(gameRow.state).joinRequests) || [];
            joinRequests.push({
                id: gameState.currentPlayer.id,
                name: gameState.currentPlayer.name,
                isHost: false,
                isOnline: true
            });
            await supabaseClient.from('games').update({ state: JSON.stringify({ ...gameRow.state && Utils.safeParseJSON(gameRow.state), joinRequests }) }).eq('room_code', roomCode);
            subscribeToGameState(roomCode);
        } catch (error) {
            Utils.log(`Supabase error (using offline mode): ${error.message}`, 'warn');
            ConnectionManager.updateStatus('offline', 'Offline Mode');
            GameStateManager.reset();
            gameState.room = roomCode;
            gameState.isHost = false;
            gameState.currentPlayer = {
                id: 'player',
                name: username,
                score: 0,
                correctAnswers: 0,
                pointsStolen: 0
            };
            gameState.players = [gameState.currentPlayer];
        }
        PlayerManager.showLobby();
        gameState.currentScreen = 'lobbyScreen';
        updateGameStateInDB(gameState);
    } catch (error) {
        Utils.log(`Error joining room: ${error.message}`, 'error');
        alert('Failed to join room. Please try again.');
    }
};

// 1. Multiplayer sync fix: Patch all game state changes (category selection, answers, minigames, scores, next round, etc.) to call updateGameStateInDB(gameState) if host, and only allow host to update. All clients subscribe and react to changes. Add a helper isHostAndOnline().
function isHostAndOnline() {
    return gameState.isHost && ConnectionManager.status === 'online';
}

// Patch all game state changes:
// - In GameController.selectCategory, processAnswers, distributePowerups, showAnswers, MinigameController.processMinigameResults, processQuantumResults, processResourceResults, processDiceResults, processCodebreakerResults, nextRound, showFinalRound, processFinalAnswers, playAgain, etc.
// - After any state change, if (isHostAndOnline()) updateGameStateInDB(gameState);
// - All clients react to gameState changes via subscribeToGameState.
// (Implementation: Add updateGameStateInDB(gameState) after each major state change, only if isHostAndOnline())

// Host merges join requests into players and updates DB
document.addEventListener('DOMContentLoaded', function() {
    setInterval(async () => {
        if (gameState.isHost && gameState.room && ConnectionManager.status === 'online' && supabaseClient) {
            try {
                // Get joinRequests from DB
                const { data: gameRow } = await supabaseClient.from('games').select('*').eq('room_code', gameState.room).single();
                if (!gameRow) return;
                let state = Utils.safeParseJSON(gameRow.state);
                if (!state) return;
                let changed = false;
                if (state.joinRequests && Array.isArray(state.joinRequests)) {
                    state.joinRequests.forEach(req => {
                        if (!gameState.players.find(p => p.id === req.id)) {
                            gameState.players.push({
                                id: req.id,
                                name: req.name,
                                score: 0,
                                correctAnswers: 0,
                                pointsStolen: 0,
                                isHost: false,
                                isOnline: true
                            });
                            changed = true;
                        }
                    });
                    // Clear joinRequests
                    state.joinRequests = [];
                }
                // Always update players in state
                state.players = gameState.players;
                if (changed) {
                    await supabaseClient.from('games').update({ state: JSON.stringify(state) }).eq('room_code', gameState.room);
                }
            } catch (error) {
                Utils.log(`Error merging join requests: ${error.message}`, 'warn');
            }
        }
    }, 1000);
});

// Only host can add AI - fix the original function
async function addComputerPlayer(difficulty = 'medium') {
    try {
        if (!gameState.isHost) {
            alert('Only the host can add AI players.');
            return;
        }
        
        if (gameState.players.length >= CONFIG.MAX_PLAYERS) {
            alert('Room is full! Maximum 12 players allowed.');
            return;
        }
        
        const usedNames = new Set(gameState.players.map(p => p.name));
        const availableNames = STATIC_DATA.COMPUTER_NAMES.filter(name => !usedNames.has(name));
        
        if (availableNames.length === 0) {
            alert('No more computer player names available!');
            return;
        }
        
        const computerName = Utils.getRandomElement(availableNames);
        const computerId = 'computer_' + Date.now();
        
        const difficultyEmoji = { easy: '🟢', medium: '🟡', hard: '🔴' };
        const displayName = `${computerName} ${difficultyEmoji[difficulty]}`;
        
        const aiPlayer = {
            id: computerId,
            name: displayName,
            score: 0,
            correctAnswers: 0,
            pointsStolen: 0,
            difficulty: difficulty,
            isOnline: false
        };
        
        gameState.players.push(aiPlayer);
        
        // Update DB if online
        if (isHostAndOnline()) {
            await updateGameStateInDB(gameState);
        }
        
        PlayerManager.updatePlayerList();
        PlayerManager.updateStartButton();
        
        Utils.log(`Added ${difficulty} AI player: ${computerName}`, 'success');
        
    } catch (error) {
        Utils.log(`Error adding computer player: ${error.message}`, 'error');
    }
}

// All player list rendering and game logic uses gameState.players from the games table
PlayerManager.updatePlayerList = function() {
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
};

// Refactor minigame screens to use modular UI
MinigameController.showHuntingSeason = function() {
    ScreenManager.show('huntingSeasonScreen');
    gameState.minigameSelections.clear();
    
    // Use modular UI if available, otherwise fallback to original
    if (window.minigamesUI && window.minigamesUI.buildHuntingSeasonUI) {
        window.minigamesUI.buildHuntingSeasonUI(gameState, DOM, (index) => {
            if (!gameState.minigameSelections.has(gameState.currentPlayer.id)) {
                gameState.minigameSelections.set(gameState.currentPlayer.id, index);
                Utils.log(`Player selected square ${index + 1}`, 'success');
                this.simulateAIMinigameSelections();
                setTimeout(() => this.processMinigameResults(), 1500);
            }
        });
    } else {
        // Fallback to original implementation
        this.updateHuntingPlayerStatus();
        this.createHuntingGrid();
    }
    
    TimerManager.start('huntingTimer', CONFIG.TIMER_DURATION.hunting, () => {
        if (!gameState.minigameSelections.has(gameState.currentPlayer.id)) {
            const randomSquare = Math.floor(Math.random() * CONFIG.GRID_SIZE);
            gameState.minigameSelections.set(gameState.currentPlayer.id, randomSquare);
            this.simulateAIMinigameSelections();
            setTimeout(() => this.processMinigameResults(), 1500);
        }
    });
};

MinigameController.showQuantumLeap = function() {
    ScreenManager.show('quantumLeapScreen');
    
    if (window.minigamesUI && window.minigamesUI.buildQuantumLeapUI) {
        window.minigamesUI.buildQuantumLeapUI(gameState, DOM, (leapPos) => {
            gameState.quantumPositions.set(gameState.currentPlayer.id, leapPos);
            window.minigamesUI.buildQuantumLeapUI(gameState, DOM, (trapPos) => {
                gameState.quantumTraps.set(gameState.currentPlayer.id, trapPos);
                setTimeout(() => this.processQuantumResults(), 1000);
            }, 2);
        }, 1);
    }
    
    TimerManager.start('quantumTimer', CONFIG.TIMER_DURATION.quantum, () => {
        if (!gameState.quantumPositions.has(gameState.currentPlayer.id)) {
            const rand = Math.floor(Math.random() * 10) + 1;
            gameState.quantumPositions.set(gameState.currentPlayer.id, rand);
            setTimeout(() => this.processQuantumResults(), 1000);
        }
    });
};

MinigameController.showResourceRace = function() {
    ScreenManager.show('resourceRaceScreen');
    
    if (window.minigamesUI && window.minigamesUI.buildResourceRaceUI) {
        window.minigamesUI.buildResourceRaceUI(gameState, DOM, (allocations) => {
            gameState.resourceData.set(gameState.currentPlayer.id, allocations);
            setTimeout(() => this.processResourceResults(), 1000);
        });
    }
    
    TimerManager.start('resourceTimer', CONFIG.TIMER_DURATION.resource, () => {
        if (!gameState.resourceData.has(gameState.currentPlayer.id)) {
            gameState.resourceData.set(gameState.currentPlayer.id, { build: 10 });
            this.processResourceResults();
        }
    });
};

MinigameController.showDiceDuel = function() {
    ScreenManager.show('diceDuelScreen');
    
    if (window.minigamesUI && window.minigamesUI.buildDiceDuelUI) {
        window.minigamesUI.buildDiceDuelUI(gameState, DOM, ({ diceCount, bet }) => {
            gameState.diceData.set(gameState.currentPlayer.id, { diceCount, bet });
            setTimeout(() => this.processDiceResults(), 1000);
        });
    }
    
    TimerManager.start('diceTimer', CONFIG.TIMER_DURATION.dice, () => {
        if (!gameState.diceData.has(gameState.currentPlayer.id)) {
            gameState.diceData.set(gameState.currentPlayer.id, { diceCount: 1, bet: 0 });
            this.processDiceResults();
        }
    });
};

MinigameController.showCodebreaker = function() {
    ScreenManager.show('codebreakerScreen');
    
    if (window.minigamesUI && window.minigamesUI.buildCodebreakerUI) {
        window.minigamesUI.buildCodebreakerUI(gameState, DOM, (guess) => {
            gameState.codeData.attempts.push([...guess]);
            setTimeout(() => this.processCodebreakerResults(), 1000);
        });
    }
    
    TimerManager.start('codeTimer', CONFIG.TIMER_DURATION.code, () => {
        if (gameState.codeData.attempts.length === 0) {
            gameState.codeData.attempts.push(['🔴', '🟡', '🟢', '🔵']);
            this.processCodebreakerResults();
        }
    });
};