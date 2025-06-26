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
    MAX_RETRY_ATTEMPTS: 3,
    
    // Multiplayer Sync Settings
    SYNC_INTERVAL: 2000, // 2 seconds
    HEARTBEAT_INTERVAL: 5000, // 5 seconds
    CONNECTION_TIMEOUT: 10000, // 10 seconds
    MAX_SYNC_RETRIES: 5
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
        currentCodeGuess: [],
        
        // Multiplayer Sync State
        connectionStatus: 'disconnected', // 'connected', 'connecting', 'disconnected', 'error'
        lastHeartbeat: 0,
        syncRetryCount: 0,
        pendingSyncs: new Map(),
        playerConnections: new Map(),
        hostPollingInterval: null,
        autoReconnectAttempts: 0,
        
        // Game progression tracking
        usedMinigames: [],
        
        // UI state
        currentScreen: 'homeScreen'
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
    status: 'loading', // 'loading', 'online', 'offline', 'connecting'
    message: 'Initializing...',
    
    updateStatus(status, message) {
        this.status = status;
        this.message = message;
        
        const statusEl = DOM.get('connectionStatus');
        if (statusEl) {
            statusEl.textContent = `${status === 'online' ? '🌐' : status === 'offline' ? '📴' : '⏳'} ${message}`;
            statusEl.className = `connection-status ${status}`;
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
            if (!username) { Utils.log('No username provided', 'error'); return; }
            GameStateManager.reset();
            gameState.room = Utils.generateRoomCode();
            gameState.isHost = true;
            gameState.currentPlayer = {
                id: generateUUID(), // Use proper UUID instead of timestamp string
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
                            id: gameState.currentPlayer.id, // Use UUID
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
                            .insert([{ room_code: gameState.room, state: JSON.stringify(gameState) }]);
                        
                        if (gameError) {
                            Utils.log(`Games table not available: ${gameError.message}`, 'warn');
                            // Continue without games table
                        }
                    } catch (gameError) {
                        Utils.log(`Games table does not exist, continuing without it`, 'warn');
                    }
                    
                    // If we get here, Supabase is working
                    subscribeToPlayers(gameState.room);
                    await syncPlayersFromDatabase();
                    
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
            APIManager.fetchQuestionsFromAnyApi().then(success => {
                if (success) updateQuestionStatus();
            });
            showLobby();
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
                id: generateUUID(), // Use proper UUID instead of timestamp string
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
                            id: gameState.currentPlayer.id, // Use UUID
                            score: 0
                        }]);
                    
                    if (playerError) {
                        Utils.log(`Player insert failed: ${playerError.message}`, 'warn');
                        throw new Error('Tables not available');
                    }
                    
                    // Try to subscribe and sync
                    subscribeToPlayers(roomCode);
                    await syncPlayersFromDatabase();
                    
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
            if (gameState.supabaseSubscription) {
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
                    Utils.log(`Player change detected: ${payload.eventType}`, 'info');
                    await syncPlayersFromDatabase();
                    PlayerManager.updatePlayerList();
                })
                .subscribe();
            
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
            // Try to get players from players table with correct schema
            const { data: playersData, error: playersError } = await supabaseClient
                .from('players')
                .select('*')
                .eq('room_code', gameState.room);
            
            if (playersError) {
                Utils.log(`Players table sync failed: ${playersError.message}`, 'warn');
                return;
            }
            
            if (playersData && playersData.length > 0) {
                const onlinePlayers = playersData.map(p => ({
                    id: p.id || p.username, // Use 'id' if it exists, otherwise 'username'
                    name: p.username,
                    score: p.score || 0,
                    correctAnswers: 0,
                    pointsStolen: 0,
                    isHost: p.is_host || false,
                    isOnline: true
                }));
                
                // Merge with existing AI players
                const aiPlayers = gameState.players.filter(p => p.difficulty);
                gameState.players = [...onlinePlayers, ...aiPlayers];
                
                Utils.log(`✅ Synced ${onlinePlayers.length} online players + ${aiPlayers.length} AI players`, 'success');
            } else {
                Utils.log('No players found in database', 'warn');
            }
        } catch (error) {
            Utils.log(`Error syncing players: ${error.message}`, 'warn');
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
    
    // Offline modal functionality with debouncing
    const connectionStatus = DOM.get('connectionStatus');
    const offlineModal = DOM.get('offlineModal');
    
    if (connectionStatus && offlineModal) {
        let modalTimeout;
        let isModalVisible = false;
        
        const showModal = () => {
            if (ConnectionManager.status === 'offline' && !isModalVisible) {
                isModalVisible = true;
                offlineModal.classList.add('active');
                Utils.log('Offline modal shown', 'info');
            }
        };
        
        const hideModal = () => {
            if (isModalVisible) {
                isModalVisible = false;
                offlineModal.classList.remove('active');
                Utils.log('Offline modal hidden', 'info');
            }
        };
        
        const debouncedShowModal = () => {
            clearTimeout(modalTimeout);
            modalTimeout = setTimeout(showModal, 100);
        };
        
        const debouncedHideModal = () => {
            clearTimeout(modalTimeout);
            modalTimeout = setTimeout(hideModal, 200);
        };
        
        connectionStatus.addEventListener('mouseenter', debouncedShowModal);
        connectionStatus.addEventListener('mouseleave', debouncedHideModal);
        
        connectionStatus.addEventListener('click', () => {
            if (ConnectionManager.status === 'offline') {
                if (isModalVisible) {
                    hideModal();
                } else {
                    showModal();
                }
            }
        });
        
        // Close modal when clicking outside
        offlineModal.addEventListener('click', (e) => {
            if (e.target === offlineModal) {
                hideModal();
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
        
        // Initialize all enhancement modules
        MultiplayerSync.initialize();
        GameFlow.initialize();
        Performance.initialize();
        Accessibility.initialize();
        Security.initialize();
        Analytics.initialize();
        DebugTools.initialize();
        TestSuite.initialize();
        
        // Setup event listeners first
        setupEventListeners();
        
        // Initialize Supabase
        await ConnectionManager.initializeSupabase();
        
        // Initialize multiplayer connection
        await MultiplayerSync.initializeConnection();
        
        // Host polling to merge join requests (only if online and host)
        setInterval(async () => {
            if (gameState.isHost && gameState.room && ConnectionManager.status === 'online' && supabaseClient) {
                try {
                    // Try to get joinRequests from DB (only if games table exists)
                    try {
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
                    } catch (gameError) {
                        // Games table doesn't exist, skip join request processing
                        Utils.log(`Games table not available for join requests: ${gameError.message}`, 'warn');
                    }
                } catch (error) {
                    Utils.log(`Error merging join requests: ${error.message}`, 'warn');
                }
            }
        }, 1000);
        
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
        
        // Start continuous testing in development mode
        if (DebugTools.isEnabled) {
            TestSuite.startContinuousTesting();
        }
        
        // Track initial page load
        Analytics.trackEvent('page_load_complete', {
            loadTime: performance.now(),
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        });
        
        Utils.log('🎮 Trivia Murder Party Initialized with all enhancements!', 'success');
        
    } catch (error) {
        Utils.log(`Initialization error: ${error.message}`, 'error');
        ConnectionManager.updateStatus('offline', 'Init Failed');
        
        // Track initialization error
        Analytics.trackError(error, { context: 'initialization' });
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
    if (!gameState.room || !supabaseClient || ConnectionManager.status !== 'online') return;
    
    try {
        const { error } = await supabaseClient
            .from('games')
            .upsert([{ room_code: gameState.room, state: JSON.stringify(newState) }]);
        
        if (error) {
            Utils.log(`Games table update failed: ${error.message}`, 'warn');
        }
    } catch (e) {
        Utils.log(`Games table does not exist, skipping update: ${e.message}`, 'warn');
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
        
        Utils.log('✅ Successfully subscribed to game state updates', 'success');
    } catch (error) {
        Utils.log(`Games table does not exist, skipping subscription: ${error.message}`, 'warn');
    }
}

// Fix the isHostAndOnline function - it was referenced but not defined
function isHostAndOnline() {
    return gameState.isHost && ConnectionManager.status === 'online';
}

// Add UUID generation function
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ========================================
// MULTIPLAYER SYNC ENHANCEMENTS
// ========================================

const MultiplayerSync = {
    async initializeConnection() {
        try {
            gameState.connectionStatus = 'connecting';
            this.updateConnectionIndicator();
            
            await this.testConnection();
            
            if (gameState.room) {
                await this.subscribeToRoom();
                this.startHeartbeat();
                this.startHostPolling();
            }
            
            gameState.connectionStatus = 'connected';
            this.updateConnectionIndicator();
            Utils.log('Multiplayer connection established', 'success');
            
        } catch (error) {
            gameState.connectionStatus = 'error';
            this.updateConnectionIndicator();
            Utils.log(`Connection failed: ${error.message}`, 'error');
            this.scheduleReconnection();
        }
    },

    async testConnection() {
        try {
            const { data, error } = await supabaseClient
                .from('games')
                .select('id')
                .limit(1);
            
            if (error) throw error;
            return true;
        } catch (error) {
            throw new Error(`Database connection test failed: ${error.message}`);
        }
    },

    updateConnectionIndicator() {
        const indicator = document.getElementById('connection-indicator');
        if (!indicator) return;

        const statusClasses = {
            connected: 'status-connected',
            connecting: 'status-connecting', 
            disconnected: 'status-disconnected',
            error: 'status-error'
        };

        // Remove all status classes
        Object.values(statusClasses).forEach(cls => indicator.classList.remove(cls));
        
        // Add current status class
        indicator.classList.add(statusClasses[gameState.connectionStatus]);
        
        // Update text
        const statusText = {
            connected: '🟢 Connected',
            connecting: '🟡 Connecting...',
            disconnected: '🔴 Disconnected',
            error: '🔴 Connection Error'
        };
        
        indicator.textContent = statusText[gameState.connectionStatus];
    },

    startHeartbeat() {
        if (gameState.heartbeatInterval) {
            clearInterval(gameState.heartbeatInterval);
        }
        
        gameState.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, CONFIG.HEARTBEAT_INTERVAL);
    },

    async sendHeartbeat() {
        if (!gameState.room || !gameState.currentPlayer) return;
        
        try {
            const { error } = await supabaseClient
                .from('games')
                .update({ 
                    last_updated: new Date().toISOString(),
                    player_heartbeat: new Date().toISOString()
                })
                .eq('room_code', gameState.room)
                .eq('player_id', gameState.currentPlayer.id);
            
            if (error) throw error;
            gameState.lastHeartbeat = Date.now();
            
        } catch (error) {
            Utils.log(`Heartbeat failed: ${error.message}`, 'warn');
            this.handleConnectionLoss();
        }
    },

    handleConnectionLoss() {
        if (gameState.connectionStatus === 'connected') {
            gameState.connectionStatus = 'disconnected';
            this.updateConnectionIndicator();
            Utils.log('Connection lost, attempting to reconnect...', 'warn');
            this.scheduleReconnection();
        }
    },

    scheduleReconnection() {
        if (gameState.autoReconnectAttempts >= CONFIG.MAX_RETRY_ATTEMPTS) {
            Utils.log('Max reconnection attempts reached', 'error');
            return;
        }
        
        setTimeout(() => {
            gameState.autoReconnectAttempts++;
            this.initializeConnection();
        }, CONFIG.RECONNECT_DELAY * gameState.autoReconnectAttempts);
    },

    async subscribeToRoom() {
        if (!gameState.room) return;
        
        try {
            // Subscribe to game state changes
            const { data, error } = await supabaseClient
                .channel(`game-${gameState.room}`)
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'games' },
                    (payload) => {
                        this.handleGameStateChange(payload);
                    }
                )
                .subscribe();
            
            if (error) throw error;
            gameState.supabaseSubscription = data;
            
        } catch (error) {
            Utils.log(`Subscription failed: ${error.message}`, 'error');
            throw error;
        }
    },

    handleGameStateChange(payload) {
        if (payload.new && payload.new.room_code === gameState.room) {
            // Update local game state
            this.mergeGameState(payload.new);
            
            // Update UI if needed
            if (gameState.currentScreen === 'lobby') {
                updatePlayerList();
            }
        }
    },

    mergeGameState(newState) {
        // Merge player data
        if (newState.players) {
            try {
                const players = JSON.parse(newState.players);
                gameState.players = players;
            } catch (error) {
                Utils.log('Failed to parse players data', 'error');
            }
        }
        
        // Merge other game state properties
        ['current_round', 'current_question', 'game_phase'].forEach(prop => {
            if (newState[prop] !== undefined) {
                gameState[prop.replace(/_([a-z])/g, (g) => g[1].toUpperCase())] = newState[prop];
            }
        });
    },

    startHostPolling() {
        if (!gameState.isHost) return;
        
        if (gameState.hostPollingInterval) {
            clearInterval(gameState.hostPollingInterval);
        }
        
        gameState.hostPollingInterval = setInterval(() => {
            this.pollJoinRequests();
        }, CONFIG.SYNC_INTERVAL);
    },

    async pollJoinRequests() {
        if (!gameState.isHost || !gameState.room) return;
        
        try {
            const { data, error } = await supabaseClient
                .from('joinrequests')
                .select('*')
                .eq('room_code', gameState.room)
                .eq('status', 'pending');
            
            if (error) throw error;
            
            // Process pending join requests
            for (const request of data || []) {
                await this.processJoinRequest(request);
            }
            
        } catch (error) {
            Utils.log(`Host polling failed: ${error.message}`, 'warn');
        }
    },

    async processJoinRequest(request) {
        try {
            // Add player to game
            const newPlayer = {
                id: request.player_id,
                name: request.player_name,
                score: 0,
                isComputer: false,
                isHost: false
            };
            
            gameState.players.push(newPlayer);
            
            // Update database
            await this.updateGameStateInDB({
                players: JSON.stringify(gameState.players)
            });
            
            // Mark request as processed
            await supabaseClient
                .from('joinrequests')
                .update({ status: 'accepted' })
                .eq('id', request.id);
            
            Utils.log(`Player ${newPlayer.name} joined the game`, 'success');
            
        } catch (error) {
            Utils.log(`Failed to process join request: ${error.message}`, 'error');
        }
    },

    async updateGameStateInDB(newState) {
        if (!gameState.room || !gameState.isHost) return;
        
        try {
            const updateData = {
                ...newState,
                last_updated: new Date().toISOString()
            };
            
            const { error } = await supabaseClient
                .from('games')
                .update(updateData)
                .eq('room_code', gameState.room);
            
            if (error) throw error;
            
        } catch (error) {
            Utils.log(`Failed to update game state: ${error.message}`, 'error');
            gameState.syncRetryCount++;
            
            if (gameState.syncRetryCount < CONFIG.MAX_SYNC_RETRIES) {
                setTimeout(() => {
                    this.updateGameStateInDB(newState);
                }, 1000 * gameState.syncRetryCount);
            }
        }
    },

    cleanup() {
        if (gameState.heartbeatInterval) {
            clearInterval(gameState.heartbeatInterval);
        }
        if (gameState.hostPollingInterval) {
            clearInterval(gameState.hostPollingInterval);
        }
        if (gameState.supabaseSubscription) {
            supabaseClient.removeChannel(gameState.supabaseSubscription);
        }
    },

    initialize() {
        Utils.log('MultiplayerSync module initialized', 'success');
        // Initialize connection status
        gameState.connectionStatus = 'disconnected';
        gameState.lastHeartbeat = 0;
        gameState.syncRetryCount = 0;
        gameState.pendingSyncs = new Map();
        gameState.playerConnections = new Map();
        gameState.hostPollingInterval = null;
        gameState.autoReconnectAttempts = 0;
        
        // Create connection indicator if it doesn't exist
        if (!document.getElementById('connection-indicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'connection-indicator';
            indicator.className = 'connection-indicator status-disconnected';
            indicator.textContent = '🔴 Disconnected';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
                z-index: 1000;
                background: rgba(0,0,0,0.8);
                color: white;
            `;
            document.body.appendChild(indicator);
        }
    }
};

// ========================================
// GAME FLOW MANAGEMENT
// ========================================

const GameFlow = {
    currentPhase: 'setup', // setup, lobby, trivia, minigame, results, final
    phaseHistory: [],
    autoAdvanceEnabled: true,
    
    phases: {
        setup: { name: 'Game Setup', duration: 0 },
        lobby: { name: 'Lobby', duration: 0 },
        trivia: { name: 'Trivia Round', duration: CONFIG.TIMER_DURATION.question },
        minigame: { name: 'Minigame', duration: CONFIG.TIMER_DURATION.hunting },
        results: { name: 'Results', duration: 0 },
        final: { name: 'Final Round', duration: CONFIG.TIMER_DURATION.final }
    },
    
    initialize() {
        this.currentPhase = 'setup';
        this.phaseHistory = [];
        this.autoAdvanceEnabled = true;
        this.logPhaseTransition('Game initialized');
    },
    
    logPhaseTransition(phase, reason = '') {
        const timestamp = new Date().toISOString();
        this.phaseHistory.push({
            phase,
            timestamp,
            reason,
            playerCount: gameState.players.length,
            round: gameState.currentRound
        });
        
        Utils.log(`Phase transition: ${phase}${reason ? ` - ${reason}` : ''}`, 'info');
    },
    
    async advancePhase(targetPhase, reason = '') {
        if (this.currentPhase === targetPhase) return;
        
        const previousPhase = this.currentPhase;
        this.currentPhase = targetPhase;
        
        this.logPhaseTransition(targetPhase, reason);
        
        // Update UI
        this.updatePhaseIndicator();
        
        // Handle phase-specific logic
        await this.handlePhaseTransition(previousPhase, targetPhase);
        
        // Sync to database if host
        if (gameState.isHost) {
            await MultiplayerSync.updateGameStateInDB({
                current_phase: targetPhase,
                phase_transition_time: new Date().toISOString()
            });
        }
    },
    
    async handlePhaseTransition(fromPhase, toPhase) {
        switch (toPhase) {
            case 'lobby':
                showLobby();
                break;
            case 'trivia':
                await this.startTriviaRound();
                break;
            case 'minigame':
                await this.startMinigame();
                break;
            case 'results':
                await this.showResults();
                break;
            case 'final':
                await this.startFinalRound();
                break;
        }
    },
    
    async startTriviaRound() {
        gameState.currentQuestion = null;
        gameState.selectedAnswers = [];
        
        // Fetch questions if needed
        if (gameState.apiQuestions.length < 5) {
            await fetchQuestionsFromAnyApi();
        }
        
        showCategorySelection();
    },
    
    async startMinigame() {
        const minigame = this.selectRandomMinigame();
        gameState.currentMinigame = minigame;
        
        // Reset minigame state
        this.resetMinigameState(minigame);
        
        // Show minigame UI
        switch (minigame) {
            case 'hunting':
                showHuntingSeason();
                break;
            case 'quantum':
                showQuantumLeap();
                break;
            case 'resource':
                showResourceRace();
                break;
            case 'dice':
                showDiceDuel();
                break;
            case 'codebreaker':
                showCodebreaker();
                break;
        }
    },
    
    selectRandomMinigame() {
        const availableMinigames = CONFIG.MINIGAMES.filter(mg => 
            !gameState.usedMinigames || !gameState.usedMinigames.includes(mg)
        );
        
        if (availableMinigames.length === 0) {
            // Reset if all minigames used
            gameState.usedMinigames = [];
            return Utils.getRandomElement(CONFIG.MINIGAMES);
        }
        
        const selected = Utils.getRandomElement(availableMinigames);
        if (!gameState.usedMinigames) gameState.usedMinigames = [];
        gameState.usedMinigames.push(selected);
        
        return selected;
    },
    
    resetMinigameState(minigame) {
        switch (minigame) {
            case 'hunting':
                gameState.minigameGrid = new Array(CONFIG.GRID_SIZE).fill(null);
                break;
            case 'quantum':
                gameState.quantumPositions.clear();
                gameState.quantumTraps.clear();
                gameState.currentMinigameTurn = 1;
                break;
            case 'resource':
                gameState.resourceData.clear();
                gameState.currentMinigameRound = 1;
                break;
            case 'dice':
                gameState.diceData.clear();
                gameState.currentDiceCount = 0;
                gameState.currentBet = 0;
                break;
            case 'codebreaker':
                gameState.codeData = {
                    secretCode: this.generateSecretCode(),
                    attempts: [],
                    currentAttempt: 0,
                    guessOrder: []
                };
                break;
        }
    },
    
    generateSecretCode() {
        const symbols = ['🔴', '🟡', '🟢', '🔵'];
        const code = [];
        for (let i = 0; i < 4; i++) {
            code.push(Utils.getRandomElement(symbols));
        }
        return code;
    },
    
    async showResults() {
        // Calculate and display results
        this.calculateRoundResults();
        showMinigameResults();
    },
    
    calculateRoundResults() {
        // Calculate scores, determine winners/losers
        // This will be implemented based on the specific minigame
    },
    
    async startFinalRound() {
        gameState.currentRound = CONFIG.FINAL_ROUND;
        showFinalRound();
    },
    
    updatePhaseIndicator() {
        const indicator = document.getElementById('phase-indicator');
        if (!indicator) return;
        
        const phase = this.phases[this.currentPhase];
        indicator.textContent = `Phase: ${phase.name}`;
        indicator.className = `phase-indicator phase-${this.currentPhase}`;
    },
    
    // Error recovery
    async handlePhaseError(error, currentPhase) {
        Utils.log(`Phase error in ${currentPhase}: ${error.message}`, 'error');
        
        // Attempt to recover based on phase
        switch (currentPhase) {
            case 'trivia':
                await this.recoverTriviaPhase();
                break;
            case 'minigame':
                await this.recoverMinigamePhase();
                break;
            default:
                await this.recoverToLobby();
                break;
        }
    },
    
    async recoverTriviaPhase() {
        Utils.log('Attempting to recover trivia phase', 'warn');
        
        // Reset question state
        gameState.currentQuestion = null;
        gameState.selectedAnswers = [];
        
        // Try to fetch new questions
        try {
            await fetchQuestionsFromAnyApi();
            showCategorySelection();
        } catch (error) {
            Utils.log('Failed to recover trivia phase, returning to lobby', 'error');
            await this.recoverToLobby();
        }
    },
    
    async recoverMinigamePhase() {
        Utils.log('Attempting to recover minigame phase', 'warn');
        
        // Reset minigame state
        this.resetMinigameState(gameState.currentMinigame);
        
        // Restart minigame
        await this.startMinigame();
    },
    
    async recoverToLobby() {
        Utils.log('Recovering to lobby', 'warn');
        
        this.currentPhase = 'lobby';
        showLobby();
        
        // Notify players
        this.showToast('Game recovered to lobby due to an error', 'warn');
    },
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toastContainer');
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },
    
    // Game progression tracking
    getGameProgress() {
        const totalRounds = CONFIG.FINAL_ROUND;
        const currentRound = gameState.currentRound;
        
        return {
            currentRound,
            totalRounds,
            percentage: Math.round((currentRound / totalRounds) * 100),
            phase: this.currentPhase,
            estimatedTimeRemaining: this.estimateTimeRemaining()
        };
    },
    
    estimateTimeRemaining() {
        const phasesRemaining = this.getPhasesRemaining();
        let estimatedMinutes = 0;
        
        phasesRemaining.forEach(phase => {
            const phaseConfig = this.phases[phase];
            estimatedMinutes += phaseConfig.duration / 60;
        });
        
        return Math.round(estimatedMinutes);
    },
    
    getPhasesRemaining() {
        const phaseOrder = ['trivia', 'minigame', 'results'];
        const currentIndex = phaseOrder.indexOf(this.currentPhase);
        
        if (currentIndex === -1) return [];
        
        return phaseOrder.slice(currentIndex);
    }
};

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

const Performance = {
    domCache: new Map(),
    cacheExpiry: new Map(),
    updateQueue: new Set(),
    lastFrameTime: 0,
    frameCount: 0,
    
    // DOM caching with expiry
    getCachedElement(id) {
        const cached = this.domCache.get(id);
        const expiry = this.cacheExpiry.get(id);
        
        if (cached && expiry && Date.now() < expiry) {
            return cached;
        }
        
        const element = document.getElementById(id);
        if (element) {
            this.domCache.set(id, element);
            this.cacheExpiry.set(id, Date.now() + CONFIG.DOM_CACHE_DURATION);
        }
        
        return element;
    },
    
    clearExpiredCache() {
        const now = Date.now();
        for (const [id, expiry] of this.cacheExpiry.entries()) {
            if (now > expiry) {
                this.domCache.delete(id);
                this.cacheExpiry.delete(id);
            }
        }
    },
    
    // Debounced updates
    scheduleUpdate(updateFunction, delay = 16) {
        const key = updateFunction.toString();
        this.updateQueue.add(key);
        
        setTimeout(() => {
            if (this.updateQueue.has(key)) {
                updateFunction();
                this.updateQueue.delete(key);
            }
        }, delay);
    },
    
    // Batch DOM updates
    batchUpdates(updates) {
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            updates.forEach(update => update());
        });
    },
    
    // Memory management
    cleanup() {
        // Clear expired cache
        this.clearExpiredCache();
        
        // Clear update queue
        this.updateQueue.clear();
        
        // Clear event listeners if needed
        this.removeEventListeners();
    },
    
    removeEventListeners() {
        // Remove any stored event listeners to prevent memory leaks
        // This would be implemented based on how events are stored
    },
    
    // Performance monitoring
    startFrame() {
        this.lastFrameTime = performance.now();
    },
    
    endFrame() {
        const frameTime = performance.now() - this.lastFrameTime;
        this.frameCount++;
        
        // Log performance issues
        if (frameTime > 16.67) { // 60fps threshold
            Utils.log(`Frame ${this.frameCount} took ${frameTime.toFixed(2)}ms`, 'warn');
        }
        
        // Reset frame count every 1000 frames
        if (this.frameCount % 1000 === 0) {
            Utils.log(`Performance: ${this.frameCount} frames processed`, 'info');
        }
    },
    
    // Lazy loading for large components
    lazyLoad(componentId, loadFunction) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadFunction();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        const element = this.getCachedElement(componentId);
        if (element) {
            observer.observe(element);
        }
    },
    
    // Optimized rendering
    renderList(containerId, items, renderFunction, keyFunction = null) {
        const container = this.getCachedElement(containerId);
        if (!container) return;
        
        // Use DocumentFragment for batch DOM updates
        const fragment = document.createDocumentFragment();
        
        items.forEach((item, index) => {
            const element = renderFunction(item, index);
            if (element) {
                fragment.appendChild(element);
            }
        });
        
        // Clear and append in one operation
        container.innerHTML = '';
        container.appendChild(fragment);
    },
    
    // Virtual scrolling for large lists
    createVirtualList(containerId, items, itemHeight, visibleCount) {
        const container = this.getCachedElement(containerId);
        if (!container) return;
        
        const totalHeight = items.length * itemHeight;
        const scrollContainer = document.createElement('div');
        scrollContainer.style.height = `${totalHeight}px`;
        scrollContainer.style.position = 'relative';
        
        const visibleContainer = document.createElement('div');
        visibleContainer.style.position = 'absolute';
        visibleContainer.style.top = '0';
        visibleContainer.style.left = '0';
        visibleContainer.style.right = '0';
        visibleContainer.style.height = `${visibleCount * itemHeight}px`;
        
        scrollContainer.appendChild(visibleContainer);
        container.appendChild(scrollContainer);
        
        // Handle scroll events
        let scrollTimeout;
        scrollContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateVirtualList(visibleContainer, items, itemHeight, visibleCount, scrollContainer.scrollTop);
            }, 16);
        });
        
        return scrollContainer;
    },
    
    updateVirtualList(container, items, itemHeight, visibleCount, scrollTop) {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount, items.length);
        
        // Only render visible items
        const visibleItems = items.slice(startIndex, endIndex);
        container.style.transform = `translateY(${startIndex * itemHeight}px)`;
        
        // Render visible items
        this.renderList(container.id, visibleItems, (item, index) => {
            const element = document.createElement('div');
            element.style.height = `${itemHeight}px`;
            element.textContent = item.name || item;
            return element;
        });
    },

    initialize() {
        Utils.log('Performance module initialized', 'success');
        
        // Initialize performance monitoring
        this.domCache = new Map();
        this.cacheExpiry = new Map();
        this.updateQueue = new Set();
        this.lastFrameTime = 0;
        this.frameCount = 0;
        
        // Start performance monitoring
        this.startPerformanceMonitoring();
        
        // Set up periodic cache cleanup
        setInterval(() => {
            this.clearExpiredCache();
        }, 30000); // Every 30 seconds
    },

    startPerformanceMonitoring() {
        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Log performance issues
                if (fps < 30) {
                    Utils.log(`Low FPS detected: ${fps}`, 'warn');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
};

// ========================================
// MOBILE AND ACCESSIBILITY IMPROVEMENTS
// ========================================

const Accessibility = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
    
    initialize() {
        this.setupTouchSupport();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupResponsiveDesign();
        this.announcePageChange('Game loaded');
    },
    
    // Touch support
    setupTouchSupport() {
        if (!this.isTouchDevice) return;
        
        // Add touch-specific event listeners
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
            return false;
        }, false);
    },
    
    handleTouchStart(event) {
        // Add visual feedback for touch
        const target = event.target;
        if (target.classList.contains('option') || target.classList.contains('grid-cell')) {
            target.style.transform = 'scale(0.95)';
        }
    },
    
    handleTouchEnd(event) {
        // Remove visual feedback
        const target = event.target;
        if (target.classList.contains('option') || target.classList.contains('grid-cell')) {
            target.style.transform = '';
        }
    },
    
    // Keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Add tabindex to interactive elements
        this.addTabIndexToElements();
    },
    
    handleKeyDown(event) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                if (event.target.classList.contains('option') || event.target.classList.contains('grid-cell')) {
                    event.preventDefault();
                    event.target.click();
                }
                break;
            case 'Escape':
                this.handleEscapeKey();
                break;
            case 'Tab':
                this.handleTabNavigation(event);
                break;
        }
    },
    
    handleEscapeKey() {
        // Close modals or return to previous screen
        const modals = document.querySelectorAll('.modal.active');
        if (modals.length > 0) {
            modals[modals.length - 1].classList.remove('active');
            return;
        }
        
        // Return to home screen if not already there
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen && currentScreen.id !== 'homeScreen') {
            showHomeScreen();
        }
    },
    
    handleTabNavigation(event) {
        // Ensure focus stays within the game container
        const gameContainer = document.querySelector('.game-container');
        const focusableElements = gameContainer.querySelectorAll(
            'button, input, .option, .grid-cell, [tabindex]'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    },
    
    addTabIndexToElements() {
        // Add tabindex to interactive elements
        const interactiveElements = document.querySelectorAll('.option, .grid-cell, .position-btn, .code-symbol-btn');
        interactiveElements.forEach((element, index) => {
            element.setAttribute('tabindex', '0');
            element.setAttribute('role', 'button');
        });
    },
    
    // Screen reader support
    setupScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'screen-reader-announcements';
        document.body.appendChild(liveRegion);
        
        // Add ARIA labels to elements
        this.addAriaLabels();
    },
    
    announcePageChange(message) {
        const liveRegion = document.getElementById('screen-reader-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    },
    
    addAriaLabels() {
        // Add descriptive labels to interactive elements
        const elements = {
            'createRoomBtn': 'Create a new game room',
            'joinRoomBtn': 'Join an existing game room',
            'startGameBtn': 'Start the trivia game',
            'shareRoomBtn': 'Share room code with other players',
            'addEasyAIBtn': 'Add easy computer player',
            'addMediumAIBtn': 'Add medium computer player',
            'addHardAIBtn': 'Add hard computer player'
        };
        
        Object.entries(elements).forEach(([id, label]) => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('aria-label', label);
            }
        });
    },
    
    // Responsive design
    setupResponsiveDesign() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Handle resize events
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Set initial responsive state
        this.updateResponsiveState();
    },
    
    handleOrientationChange() {
        // Adjust layout for orientation change
        this.updateResponsiveState();
        this.announcePageChange('Orientation changed');
    },
    
    handleResize() {
        // Adjust layout for window resize
        this.updateResponsiveState();
    },
    
    updateResponsiveState() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isSmallScreen = window.innerWidth < 480;
        
        document.body.classList.toggle('landscape', isLandscape);
        document.body.classList.toggle('small-screen', isSmallScreen);
        
        // Adjust font sizes for small screens
        if (isSmallScreen) {
            document.documentElement.style.fontSize = '14px';
        } else {
            document.documentElement.style.fontSize = '16px';
        }
    },
    
    // High contrast mode
    setupHighContrastMode() {
        if (this.prefersHighContrast) {
            document.body.classList.add('high-contrast');
        }
        
        // Listen for changes
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            document.body.classList.toggle('high-contrast', e.matches);
        });
    },
    
    // Reduced motion support
    setupReducedMotion() {
        if (this.prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
        }
        
        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            document.body.classList.toggle('reduced-motion', e.matches);
        });
    },
    
    // Focus management
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, input, .option, .grid-cell, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        if (firstElement) {
            firstElement.focus();
        }
        
        // Trap focus within element
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });
    },
    
    // Announce game events
    announceGameEvent(event, data = {}) {
        const announcements = {
            'player-joined': `Player ${data.playerName} joined the game`,
            'player-left': `Player ${data.playerName} left the game`,
            'round-start': `Round ${data.round} starting`,
            'question-display': `Question: ${data.question}`,
            'timer-warning': `Time running out`,
            'minigame-start': `${data.minigame} minigame starting`,
            'game-over': `Game over. ${data.winner} wins!`
        };
        
        const message = announcements[event];
        if (message) {
            this.announcePageChange(message);
        }
    },
    
    // Mobile-specific optimizations
    optimizeForMobile() {
        if (!this.isMobile) return;
        
        // Increase touch targets
        const touchTargets = document.querySelectorAll('button, .option, .grid-cell');
        touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                target.style.minHeight = '44px';
                target.style.minWidth = '44px';
            }
        });
        
        // Disable hover effects on touch devices
        document.body.classList.add('touch-device');
    }
};

// ========================================
// SECURITY AND VALIDATION
// ========================================

const Security = {
    rateLimitMap: new Map(),
    inputHistory: new Map(),
    maxRequestsPerMinute: 60,
    maxInputLength: 100,
    allowedCharacters: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
    
    initialize() {
        this.setupInputValidation();
        this.setupRateLimiting();
        this.setupDataSanitization();
    },
    
    // Input validation
    setupInputValidation() {
        // Validate username input
        const usernameInputs = document.querySelectorAll('input[placeholder*="username"], input[placeholder*="Username"]');
        usernameInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateUsername(e.target.value, e.target);
            });
            
            input.addEventListener('blur', (e) => {
                this.sanitizeInput(e.target);
            });
        });
        
        // Validate room code input
        const roomCodeInputs = document.querySelectorAll('input[placeholder*="room code"], input[placeholder*="Room code"]');
        roomCodeInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateRoomCode(e.target.value, e.target);
            });
        });
    },
    
    validateUsername(username, inputElement) {
        const errors = [];
        
        // Check length
        if (username.length < 2) {
            errors.push('Username must be at least 2 characters');
        }
        
        if (username.length > 20) {
            errors.push('Username must be 20 characters or less');
        }
        
        // Check for allowed characters
        if (username && !this.allowedCharacters.test(username)) {
            errors.push('Username contains invalid characters');
        }
        
        // Check for profanity (basic check)
        if (this.containsProfanity(username)) {
            errors.push('Username contains inappropriate content');
        }
        
        // Update UI
        this.updateValidationUI(inputElement, errors);
        
        return errors.length === 0;
    },
    
    validateRoomCode(roomCode, inputElement) {
        const errors = [];
        
        // Check format (6 alphanumeric characters)
        if (roomCode && !/^[A-Z0-9]{6}$/.test(roomCode)) {
            errors.push('Room code must be 6 uppercase letters or numbers');
        }
        
        // Update UI
        this.updateValidationUI(inputElement, errors);
        
        return errors.length === 0;
    },
    
    updateValidationUI(inputElement, errors) {
        // Remove existing error styling
        inputElement.classList.remove('error');
        inputElement.classList.remove('valid');
        
        // Remove existing error messages
        const existingError = inputElement.parentNode.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        if (errors.length > 0) {
            // Add error styling
            inputElement.classList.add('error');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'validation-error';
            errorDiv.textContent = errors[0];
            errorDiv.style.color = '#e17055';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '5px';
            
            inputElement.parentNode.appendChild(errorDiv);
        } else if (inputElement.value.length > 0) {
            // Add valid styling
            inputElement.classList.add('valid');
        }
    },
    
    // Rate limiting
    setupRateLimiting() {
        // Track requests by IP/identifier
        this.rateLimitMap = new Map();
    },
    
    checkRateLimit(identifier, action = 'general') {
        const now = Date.now();
        const key = `${identifier}-${action}`;
        
        if (!this.rateLimitMap.has(key)) {
            this.rateLimitMap.set(key, []);
        }
        
        const requests = this.rateLimitMap.get(key);
        
        // Remove requests older than 1 minute
        const oneMinuteAgo = now - 60000;
        const recentRequests = requests.filter(timestamp => timestamp > oneMinuteAgo);
        
        // Check if limit exceeded
        if (recentRequests.length >= this.maxRequestsPerMinute) {
            Utils.log(`Rate limit exceeded for ${identifier}`, 'warn');
            return false;
        }
        
        // Add current request
        recentRequests.push(now);
        this.rateLimitMap.set(key, recentRequests);
        
        return true;
    },
    
    // Data sanitization
    setupDataSanitization() {
        // Sanitize all user inputs before processing
        document.addEventListener('submit', (e) => {
            const inputs = e.target.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.value = this.sanitizeInput(input.value);
            });
        });
    },
    
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Remove HTML tags
        let sanitized = input.replace(/<[^>]*>/g, '');
        
        // Remove script tags and event handlers
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');
        
        // Trim whitespace
        sanitized = sanitized.trim();
        
        // Limit length
        if (sanitized.length > this.maxInputLength) {
            sanitized = sanitized.substring(0, this.maxInputLength);
        }
        
        return sanitized;
    },
    
    // Content filtering
    containsProfanity(text) {
        if (!text) return false;
        
        const profanityList = [
            // Add common profanity words here (keeping this clean for the example)
            'badword1', 'badword2'
        ];
        
        const lowerText = text.toLowerCase();
        return profanityList.some(word => lowerText.includes(word));
    },
    
    // Data validation for game state
    validateGameState(gameState) {
        const errors = [];
        
        // Validate player data
        if (!Array.isArray(gameState.players)) {
            errors.push('Players must be an array');
        } else {
            gameState.players.forEach((player, index) => {
                if (!player.id || !player.name) {
                    errors.push(`Player ${index} missing required fields`);
                }
                
                if (player.name && player.name.length > 20) {
                    errors.push(`Player ${index} name too long`);
                }
            });
        }
        
        // Validate room code
        if (gameState.room && !/^[A-Z0-9]{6}$/.test(gameState.room)) {
            errors.push('Invalid room code format');
        }
        
        // Validate round number
        if (gameState.currentRound && (gameState.currentRound < 1 || gameState.currentRound > 10)) {
            errors.push('Invalid round number');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    
    // Secure random generation
    generateSecureId() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    // Input history tracking (for detecting patterns)
    trackInput(input, userId) {
        if (!this.inputHistory.has(userId)) {
            this.inputHistory.set(userId, []);
        }
        
        const history = this.inputHistory.get(userId);
        history.push({
            input: input,
            timestamp: Date.now()
        });
        
        // Keep only last 100 inputs
        if (history.length > 100) {
            history.shift();
        }
        
        // Check for suspicious patterns
        this.detectSuspiciousActivity(userId, history);
    },
    
    detectSuspiciousActivity(userId, history) {
        const recentInputs = history.filter(h => 
            Date.now() - h.timestamp < 60000 // Last minute
        );
        
        // Check for rapid input
        if (recentInputs.length > 20) {
            Utils.log(`Suspicious activity detected for user ${userId}: rapid input`, 'warn');
        }
        
        // Check for repeated inputs
        const inputCounts = {};
        recentInputs.forEach(h => {
            inputCounts[h.input] = (inputCounts[h.input] || 0) + 1;
        });
        
        Object.entries(inputCounts).forEach(([input, count]) => {
            if (count > 10) {
                Utils.log(`Suspicious activity detected for user ${userId}: repeated input`, 'warn');
            }
        });
    },
    
    // CSRF protection
    generateCSRFToken() {
        return this.generateSecureId();
    },
    
    validateCSRFToken(token, expectedToken) {
        return token === expectedToken;
    },
    
    // XSS prevention
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Secure storage
    secureStore(key, value) {
        try {
            // Encrypt sensitive data before storing
            const encrypted = this.encryptData(JSON.stringify(value));
            localStorage.setItem(key, encrypted);
        } catch (error) {
            Utils.log(`Failed to store data securely: ${error.message}`, 'error');
        }
    },
    
    secureRetrieve(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            
            const decrypted = this.decryptData(encrypted);
            return JSON.parse(decrypted);
        } catch (error) {
            Utils.log(`Failed to retrieve data securely: ${error.message}`, 'error');
            return null;
        }
    },
    
    // Simple encryption (for demo purposes - use proper encryption in production)
    encryptData(data) {
        // This is a simple obfuscation - use proper encryption in production
        return btoa(data);
    },
    
    decryptData(encryptedData) {
        // This is a simple deobfuscation - use proper decryption in production
        return atob(encryptedData);
    }
};

// ========================================
// ANALYTICS AND METRICS
// ========================================

const Analytics = {
    sessionId: null,
    startTime: null,
    events: [],
    metrics: {
        gameStarts: 0,
        gameCompletions: 0,
        averageGameDuration: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        minigamePlays: 0,
        playerConnections: 0,
        disconnections: 0,
        errors: 0,
        performanceIssues: 0
    },
    userBehavior: {
        screenTime: {},
        buttonClicks: {},
        navigationPatterns: [],
        responseTimes: []
    },
    
    initialize() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.trackEvent('session_start', { sessionId: this.sessionId });
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', { 
                visible: !document.hidden,
                timestamp: Date.now()
            });
        });
        
        // Track performance metrics
        this.setupPerformanceTracking();
        
        // Track user interactions
        this.setupInteractionTracking();
        
        // Periodic metrics reporting
        setInterval(() => {
            this.reportMetrics();
        }, 60000); // Every minute
    },
    
    generateSessionId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Event tracking
    trackEvent(eventName, data = {}) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            data: data
        };
        
        this.events.push(event);
        
        // Keep only last 1000 events
        if (this.events.length > 1000) {
            this.events.shift();
        }
        
        // Update metrics based on event
        this.updateMetrics(eventName, data);
        
        Utils.log(`Analytics: ${eventName}`, 'info');
    },
    
    updateMetrics(eventName, data) {
        switch (eventName) {
            case 'game_start':
                this.metrics.gameStarts++;
                break;
            case 'game_complete':
                this.metrics.gameCompletions++;
                this.metrics.averageGameDuration = this.calculateAverageGameDuration();
                break;
            case 'question_answered':
                this.metrics.totalQuestionsAnswered++;
                if (data.correct) this.metrics.correctAnswers++;
                break;
            case 'minigame_play':
                this.metrics.minigamePlays++;
                break;
            case 'player_connect':
                this.metrics.playerConnections++;
                break;
            case 'player_disconnect':
                this.metrics.disconnections++;
                break;
            case 'error':
                this.metrics.errors++;
                break;
            case 'performance_issue':
                this.metrics.performanceIssues++;
                break;
        }
    },
    
    // Performance tracking
    setupPerformanceTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.trackEvent('page_load', { loadTime });
        });
        
        // Track navigation timing
        if ('navigation' in performance) {
            const nav = performance.getEntriesByType('navigation')[0];
            this.trackEvent('navigation_timing', {
                domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
                loadComplete: nav.loadEventEnd - nav.loadEventStart,
                domInteractive: nav.domInteractive,
                domComplete: nav.domComplete
            });
        }
        
        // Track resource loading
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'resource') {
                    this.trackEvent('resource_load', {
                        name: entry.name,
                        duration: entry.duration,
                        size: entry.transferSize
                    });
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    },
    
    // Interaction tracking
    setupInteractionTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.trackButtonClick(e.target);
            }
        });
        
        // Track screen time
        this.trackScreenTime();
        
        // Track response times
        this.trackResponseTimes();
    },
    
    trackButtonClick(button) {
        const buttonId = button.id || button.textContent || 'unknown';
        this.userBehavior.buttonClicks[buttonId] = (this.userBehavior.buttonClicks[buttonId] || 0) + 1;
        
        this.trackEvent('button_click', {
            buttonId,
            screen: this.getCurrentScreen()
        });
    },
    
    trackScreenTime() {
        let screenStartTime = Date.now();
        let currentScreen = this.getCurrentScreen();
        
        setInterval(() => {
            const newScreen = this.getCurrentScreen();
            if (newScreen !== currentScreen) {
                // Record time spent on previous screen
                const timeSpent = Date.now() - screenStartTime;
                this.userBehavior.screenTime[currentScreen] = (this.userBehavior.screenTime[currentScreen] || 0) + timeSpent;
                
                // Track navigation
                this.userBehavior.navigationPatterns.push({
                    from: currentScreen,
                    to: newScreen,
                    timeSpent
                });
                
                // Update for new screen
                currentScreen = newScreen;
                screenStartTime = Date.now();
                
                this.trackEvent('screen_change', {
                    from: currentScreen,
                    to: newScreen,
                    timeSpent
                });
            }
        }, 1000);
    },
    
    trackResponseTimes() {
        // Track how long users take to answer questions
        const originalSelectAnswer = window.selectAnswer;
        window.selectAnswer = function(index) {
            const responseTime = Date.now() - (gameState.questionStartTime || Date.now());
            Analytics.trackEvent('question_response', {
                responseTime,
                answerIndex: index,
                questionId: gameState.currentQuestion?.id
            });
            
            return originalSelectAnswer(index);
        };
    },
    
    getCurrentScreen() {
        const activeScreen = document.querySelector('.screen.active');
        return activeScreen ? activeScreen.id : 'unknown';
    },
    
    // Game-specific analytics
    trackGameProgress() {
        const progress = GameFlow.getGameProgress();
        this.trackEvent('game_progress', progress);
    },
    
    trackMinigamePerformance(minigameName, performance) {
        this.trackEvent('minigame_performance', {
            minigame: minigameName,
            score: performance.score,
            timeSpent: performance.timeSpent,
            accuracy: performance.accuracy
        });
    },
    
    trackPlayerBehavior(playerId, action, data = {}) {
        this.trackEvent('player_behavior', {
            playerId,
            action,
            ...data
        });
    },
    
    // Error tracking
    trackError(error, context = {}) {
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            context
        });
    },
    
    // Performance monitoring
    trackPerformanceIssue(issue) {
        this.trackEvent('performance_issue', issue);
    },
    
    // Metrics calculation
    calculateAverageGameDuration() {
        const completedGames = this.events.filter(e => e.event === 'game_complete');
        if (completedGames.length === 0) return 0;
        
        const totalDuration = completedGames.reduce((sum, game) => {
            return sum + (game.data.duration || 0);
        }, 0);
        
        return totalDuration / completedGames.length;
    },
    
    calculateAccuracyRate() {
        if (this.metrics.totalQuestionsAnswered === 0) return 0;
        return (this.metrics.correctAnswers / this.metrics.totalQuestionsAnswered) * 100;
    },
    
    calculateEngagementScore() {
        const sessionDuration = Date.now() - this.startTime;
        const eventCount = this.events.length;
        const screenChanges = this.userBehavior.navigationPatterns.length;
        
        return {
            eventsPerMinute: (eventCount / (sessionDuration / 60000)),
            screenChangesPerMinute: (screenChanges / (sessionDuration / 60000)),
            averageScreenTime: this.calculateAverageScreenTime()
        };
    },
    
    calculateAverageScreenTime() {
        const screenTimes = Object.values(this.userBehavior.screenTime);
        if (screenTimes.length === 0) return 0;
        
        return screenTimes.reduce((sum, time) => sum + time, 0) / screenTimes.length;
    },
    
    // Reporting
    reportMetrics() {
        const report = {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.startTime,
            metrics: this.metrics,
            userBehavior: {
                screenTime: this.userBehavior.screenTime,
                buttonClicks: this.userBehavior.buttonClicks,
                engagementScore: this.calculateEngagementScore()
            },
            performance: {
                accuracyRate: this.calculateAccuracyRate(),
                averageGameDuration: this.calculateAverageGameDuration()
            }
        };
        
        // Send to analytics service (or log for now)
        this.sendAnalyticsReport(report);
        
        Utils.log('Analytics report generated', 'info');
    },
    
    sendAnalyticsReport(report) {
        // In a real implementation, this would send to an analytics service
        // For now, we'll store in localStorage and log
        try {
            const reports = JSON.parse(localStorage.getItem('analytics_reports') || '[]');
            reports.push(report);
            
            // Keep only last 10 reports
            if (reports.length > 10) {
                reports.shift();
            }
            
            localStorage.setItem('analytics_reports', JSON.stringify(reports));
            
            // Log summary
            console.log('Analytics Report:', {
                sessionDuration: Math.round(report.sessionDuration / 1000) + 's',
                events: this.events.length,
                accuracy: report.performance.accuracyRate.toFixed(1) + '%',
                engagement: report.userBehavior.engagementScore.eventsPerMinute.toFixed(2) + ' events/min'
            });
            
        } catch (error) {
            Utils.log(`Failed to save analytics report: ${error.message}`, 'error');
        }
    },
    
    // Export analytics data
    exportAnalytics() {
        const data = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            endTime: Date.now(),
            events: this.events,
            metrics: this.metrics,
            userBehavior: this.userBehavior
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${this.sessionId}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    },
    
    // Get analytics summary
    getAnalyticsSummary() {
        return {
            sessionDuration: Math.round((Date.now() - this.startTime) / 1000),
            totalEvents: this.events.length,
            accuracyRate: this.calculateAccuracyRate(),
            engagementScore: this.calculateEngagementScore(),
            topButtons: this.getTopButtons(),
            mostVisitedScreens: this.getMostVisitedScreens()
        };
    },
    
    getTopButtons() {
        return Object.entries(this.userBehavior.buttonClicks)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([button, clicks]) => ({ button, clicks }));
    },
    
    getMostVisitedScreens() {
        return Object.entries(this.userBehavior.screenTime)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([screen, time]) => ({ screen, time: Math.round(time / 1000) }));
    }
};

// ========================================
// DEBUGGING TOOLS
// ========================================

const DebugTools = {
    isEnabled: false,
    debugPanel: null,
    logHistory: [],
    errorHistory: [],
    performanceHistory: [],
    stateSnapshots: [],
    
    initialize() {
        // Enable debug mode in development
        this.isEnabled = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.search.includes('debug=true');
        
        if (this.isEnabled) {
            this.createDebugPanel();
            this.setupDebugShortcuts();
            this.setupErrorTracking();
            this.setupPerformanceMonitoring();
            this.setupStateTracking();
            
            Utils.log('Debug tools enabled', 'info');
        }
    },
    
    // Debug panel
    createDebugPanel() {
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'debug-panel';
        this.debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 300px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            overflow-y: auto;
            display: none;
        `;
        
        this.debugPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>Debug Panel</strong>
                <button onclick="DebugTools.togglePanel()" style="background: #333; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer;">Toggle</button>
            </div>
            <div id="debug-content"></div>
        `;
        
        document.body.appendChild(this.debugPanel);
        
        // Show panel with Ctrl+Shift+D
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.togglePanel();
            }
        });
    },
    
    togglePanel() {
        if (this.debugPanel) {
            this.debugPanel.style.display = this.debugPanel.style.display === 'none' ? 'block' : 'none';
            if (this.debugPanel.style.display === 'block') {
                this.updateDebugContent();
            }
        }
    },
    
    updateDebugContent() {
        if (!this.debugPanel) return;
        
        const content = document.getElementById('debug-content');
        if (!content) return;
        
        const gameState = this.getGameStateSummary();
        const performance = this.getPerformanceSummary();
        const errors = this.getErrorSummary();
        
        content.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>Game State:</strong><br>
                Room: ${gameState.room || 'None'}<br>
                Players: ${gameState.playerCount}<br>
                Round: ${gameState.currentRound}<br>
                Phase: ${gameState.currentPhase}<br>
                Connection: ${gameState.connectionStatus}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Performance:</strong><br>
                FPS: ${performance.fps}<br>
                Memory: ${performance.memory}<br>
                Load Time: ${performance.loadTime}ms
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Errors:</strong><br>
                Total: ${errors.total}<br>
                Recent: ${errors.recent}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Actions:</strong><br>
                <button onclick="DebugTools.exportState()" style="background: #333; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; margin: 2px;">Export State</button>
                <button onclick="DebugTools.clearLogs()" style="background: #333; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; margin: 2px;">Clear Logs</button>
                <button onclick="DebugTools.testConnection()" style="background: #333; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; margin: 2px;">Test DB</button>
            </div>
        `;
    },
    
    // Debug shortcuts
    setupDebugShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!e.ctrlKey) return;
            
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.logGameState();
                    break;
                case '2':
                    e.preventDefault();
                    this.logPerformance();
                    break;
                case '3':
                    e.preventDefault();
                    this.logErrors();
                    break;
                case '4':
                    e.preventDefault();
                    this.exportState();
                    break;
                case '5':
                    e.preventDefault();
                    this.testConnection();
                    break;
            }
        });
    },
    
    // Error tracking
    setupErrorTracking() {
        // Override console.error
        const originalError = console.error;
        console.error = (...args) => {
            this.logError(args.join(' '));
            originalError.apply(console, args);
        };
        
        // Override console.warn
        const originalWarn = console.warn;
        console.warn = (...args) => {
            this.logWarning(args.join(' '));
            originalWarn.apply(console, args);
        };
        
        // Global error handler
        window.addEventListener('error', (e) => {
            this.logError(`Global error: ${e.message} at ${e.filename}:${e.lineno}`);
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (e) => {
            this.logError(`Unhandled promise rejection: ${e.reason}`);
        });
    },
    
    logError(message) {
        const error = {
            message,
            timestamp: Date.now(),
            stack: new Error().stack
        };
        
        this.errorHistory.push(error);
        
        // Keep only last 100 errors
        if (this.errorHistory.length > 100) {
            this.errorHistory.shift();
        }
        
        // Update debug panel if visible
        if (this.debugPanel && this.debugPanel.style.display === 'block') {
            this.updateDebugContent();
        }
    },
    
    logWarning(message) {
        const warning = {
            message,
            timestamp: Date.now()
        };
        
        this.logHistory.push({
            type: 'warning',
            ...warning
        });
    },
    
    // Performance monitoring
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                this.performanceHistory.push({
                    fps,
                    timestamp: currentTime,
                    memory: performance.memory ? {
                        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
                    } : null
                });
                
                // Keep only last 60 measurements
                if (this.performanceHistory.length > 60) {
                    this.performanceHistory.shift();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    },
    
    // State tracking
    setupStateTracking() {
        // Take state snapshots periodically
        setInterval(() => {
            this.takeStateSnapshot();
        }, 5000); // Every 5 seconds
    },
    
    takeStateSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            gameState: JSON.parse(JSON.stringify(gameState)),
            performance: this.getPerformanceSummary(),
            errors: this.errorHistory.length
        };
        
        this.stateSnapshots.push(snapshot);
        
        // Keep only last 20 snapshots
        if (this.stateSnapshots.length > 20) {
            this.stateSnapshots.shift();
        }
    },
    
    // Debug actions
    logGameState() {
        console.group('Game State Debug');
        console.log('Current Game State:', gameState);
        console.log('Connection Status:', gameState.connectionStatus);
        console.log('Players:', gameState.players);
        console.log('Current Round:', gameState.currentRound);
        console.log('Current Phase:', GameFlow.currentPhase);
        console.groupEnd();
    },
    
    logPerformance() {
        console.group('Performance Debug');
        console.log('Performance History:', this.performanceHistory);
        console.log('Current FPS:', this.getPerformanceSummary().fps);
        console.log('Memory Usage:', this.getPerformanceSummary().memory);
        console.groupEnd();
    },
    
    logErrors() {
        console.group('Error Debug');
        console.log('Error History:', this.errorHistory);
        console.log('Total Errors:', this.errorHistory.length);
        console.log('Recent Errors:', this.errorHistory.slice(-5));
        console.groupEnd();
    },
    
    exportState() {
        const exportData = {
            timestamp: Date.now(),
            gameState: gameState,
            debugInfo: {
                errors: this.errorHistory,
                performance: this.performanceHistory,
                stateSnapshots: this.stateSnapshots
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-export-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        Utils.log('Debug state exported', 'success');
    },
    
    clearLogs() {
        this.logHistory = [];
        this.errorHistory = [];
        this.performanceHistory = [];
        this.stateSnapshots = [];
        
        Utils.log('Debug logs cleared', 'success');
    },
    
    async testConnection() {
        try {
            Utils.log('Testing database connection...', 'info');
            
            const { data, error } = await supabaseClient
                .from('games')
                .select('id')
                .limit(1);
            
            if (error) {
                Utils.log(`Database test failed: ${error.message}`, 'error');
            } else {
                Utils.log('Database connection successful', 'success');
            }
            
        } catch (error) {
            Utils.log(`Database test error: ${error.message}`, 'error');
        }
    },
    
    // Utility methods
    getGameStateSummary() {
        return {
            room: gameState.room,
            playerCount: gameState.players.length,
            currentRound: gameState.currentRound,
            currentPhase: GameFlow.currentPhase,
            connectionStatus: gameState.connectionStatus
        };
    },
    
    getPerformanceSummary() {
        const recent = this.performanceHistory.slice(-5);
        const avgFPS = recent.length > 0 ? 
            Math.round(recent.reduce((sum, p) => sum + p.fps, 0) / recent.length) : 0;
        
        const latest = this.performanceHistory[this.performanceHistory.length - 1];
        const memory = latest ? latest.memory : null;
        
        return {
            fps: avgFPS,
            memory: memory ? `${memory.used}MB / ${memory.total}MB` : 'N/A',
            loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 'N/A'
        };
    },
    
    getErrorSummary() {
        const recent = this.errorHistory.filter(e => 
            Date.now() - e.timestamp < 60000 // Last minute
        );
        
        return {
            total: this.errorHistory.length,
            recent: recent.length
        };
    },
    
    // Network debugging
    logNetworkActivity() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = Date.now();
            try {
                const response = await originalFetch(...args);
                const duration = Date.now() - startTime;
                
                this.logHistory.push({
                    type: 'network',
                    url: args[0],
                    duration,
                    status: response.status,
                    timestamp: Date.now()
                });
                
                return response;
            } catch (error) {
                const duration = Date.now() - startTime;
                this.logError(`Network error: ${error.message} (${duration}ms)`);
                throw error;
            }
        };
    },
    
    // Memory debugging
    logMemoryUsage() {
        if (performance.memory) {
            const memory = performance.memory;
            const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
            const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
            
            Utils.log(`Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`, 'info');
            
            if (used / limit > 0.8) {
                Utils.log('Memory usage is high!', 'warn');
            }
        }
    }
};

// ========================================
// TESTING AND QUALITY ASSURANCE
// ========================================

const TestSuite = {
    tests: [],
    testResults: [],
    isRunning: false,
    
    initialize() {
        this.registerTests();
        
        // Run tests in development mode
        if (DebugTools.isEnabled) {
            this.runAllTests();
        }
    },
    
    // Test registration
    registerTests() {
        // Core functionality tests
        this.registerTest('Game State Initialization', this.testGameStateInitialization);
        this.registerTest('Player Management', this.testPlayerManagement);
        this.registerTest('Room Code Generation', this.testRoomCodeGeneration);
        this.registerTest('Question Management', this.testQuestionManagement);
        this.registerTest('Timer Functionality', this.testTimerFunctionality);
        this.registerTest('Minigame Logic', this.testMinigameLogic);
        this.registerTest('Multiplayer Sync', this.testMultiplayerSync);
        this.registerTest('Input Validation', this.testInputValidation);
        this.registerTest('Performance Benchmarks', this.testPerformanceBenchmarks);
        this.registerTest('Error Handling', this.testErrorHandling);
    },
    
    registerTest(name, testFunction) {
        this.tests.push({
            name,
            function: testFunction,
            category: 'core'
        });
    },
    
    // Test execution
    async runAllTests() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.testResults = [];
        
        Utils.log('Starting test suite...', 'info');
        
        for (const test of this.tests) {
            try {
                Utils.log(`Running test: ${test.name}`, 'info');
                const result = await test.function();
                
                this.testResults.push({
                    name: test.name,
                    passed: result.passed,
                    message: result.message,
                    duration: result.duration,
                    timestamp: Date.now()
                });
                
                if (result.passed) {
                    Utils.log(`✅ ${test.name}: PASSED`, 'success');
                } else {
                    Utils.log(`❌ ${test.name}: FAILED - ${result.message}`, 'error');
                }
                
            } catch (error) {
                this.testResults.push({
                    name: test.name,
                    passed: false,
                    message: `Test error: ${error.message}`,
                    duration: 0,
                    timestamp: Date.now()
                });
                
                Utils.log(`❌ ${test.name}: ERROR - ${error.message}`, 'error');
            }
        }
        
        this.isRunning = false;
        this.generateTestReport();
    },
    
    async runTest(testName) {
        const test = this.tests.find(t => t.name === testName);
        if (!test) {
            throw new Error(`Test not found: ${testName}`);
        }
        
        const startTime = Date.now();
        const result = await test.function();
        const duration = Date.now() - startTime;
        
        return {
            ...result,
            duration
        };
    },
    
    // Individual tests
    async testGameStateInitialization() {
        const startTime = Date.now();
        
        // Test game state initialization
        initializeGameState();
        
        // Verify required properties exist
        const requiredProperties = [
            'room', 'players', 'currentPlayer', 'currentRound',
            'currentQuestion', 'selectedAnswers', 'minigameGrid',
            'isHost', 'backupQuestions', 'apiQuestions'
        ];
        
        for (const prop of requiredProperties) {
            if (!(prop in gameState)) {
                return {
                    passed: false,
                    message: `Missing required property: ${prop}`,
                    duration: Date.now() - startTime
                };
            }
        }
        
        // Verify initial values
        if (gameState.players.length !== 0) {
            return {
                passed: false,
                message: 'Players array should be empty on initialization',
                duration: Date.now() - startTime
            };
        }
        
        if (gameState.currentRound !== 1) {
            return {
                passed: false,
                message: 'Current round should be 1 on initialization',
                duration: Date.now() - startTime
            };
        }
        
        return {
            passed: true,
            message: 'Game state initialized correctly',
            duration: Date.now() - startTime
        };
    },
    
    async testPlayerManagement() {
        const startTime = Date.now();
        
        // Test adding players
        const testPlayer = {
            id: 'test-player-1',
            name: 'Test Player',
            score: 0,
            isComputer: false,
            isHost: false
        };
        
        gameState.players.push(testPlayer);
        
        if (gameState.players.length !== 1) {
            return {
                passed: false,
                message: 'Player not added correctly',
                duration: Date.now() - startTime
            };
        }
        
        // Test player validation
        const validation = Security.validateGameState(gameState);
        if (!validation.isValid) {
            return {
                passed: false,
                message: `Player validation failed: ${validation.errors.join(', ')}`,
                duration: Date.now() - startTime
            };
        }
        
        // Test removing players
        gameState.players = gameState.players.filter(p => p.id !== 'test-player-1');
        
        if (gameState.players.length !== 0) {
            return {
                passed: false,
                message: 'Player not removed correctly',
                duration: Date.now() - startTime
            };
        }
        
        return {
            passed: true,
            message: 'Player management working correctly',
            duration: Date.now() - startTime
        };
    },
    
    async testRoomCodeGeneration() {
        const startTime = Date.now();
        
        // Test room code generation
        const roomCode = Utils.generateRoomCode();
        
        if (!roomCode || typeof roomCode !== 'string') {
            return {
                passed: false,
                message: 'Room code generation failed',
                duration: Date.now() - startTime
            };
        }
        
        if (roomCode.length !== 6) {
            return {
                passed: false,
                message: 'Room code should be 6 characters long',
                duration: Date.now() - startTime
            };
        }
        
        if (!/^[A-Z0-9]{6}$/.test(roomCode)) {
            return {
                passed: false,
                message: 'Room code should contain only uppercase letters and numbers',
                duration: Date.now() - startTime
            };
        }
        
        return {
            passed: true,
            message: 'Room code generation working correctly',
            duration: Date.now() - startTime
        };
    },
    
    async testQuestionManagement() {
        const startTime = Date.now();
        
        // Test backup questions
        if (gameState.backupQuestions.length === 0) {
            return {
                passed: false,
                message: 'No backup questions available',
                duration: Date.now() - startTime
            };
        }
        
        // Test question structure
        const testQuestion = gameState.backupQuestions[0];
        const requiredFields = ['question', 'options', 'correct', 'category'];
        
        for (const field of requiredFields) {
            if (!(field in testQuestion)) {
                return {
                    passed: false,
                    message: `Question missing required field: ${field}`,
                    duration: Date.now() - startTime
                };
            }
        }
        
        // Test question validation
        if (testQuestion.options.length !== 4) {
            return {
                passed: false,
                message: 'Question should have exactly 4 options',
                duration: Date.now() - startTime
            };
        }
        
        if (testQuestion.correct < 0 || testQuestion.correct > 3) {
            return {
                passed: false,
                message: 'Correct answer index should be between 0 and 3',
                duration: Date.now() - startTime
            };
        }
        
        return {
            passed: true,
            message: 'Question management working correctly',
            duration: Date.now() - startTime
        };
    },
    
    async testTimerFunctionality() {
        const startTime = Date.now();
        
        return new Promise((resolve) => {
            let timerCompleted = false;
            
            // Test timer countdown
            const testTimer = Timer.start('test', 3, () => {
                timerCompleted = true;
            });
            
            // Check initial value
            if (testTimer.value !== 3) {
                resolve({
                    passed: false,
                    message: 'Timer should start with correct value',
                    duration: Date.now() - startTime
                });
                return;
            }
            
            // Wait for timer to complete
            setTimeout(() => {
                if (!timerCompleted) {
                    resolve({
                        passed: false,
                        message: 'Timer callback not executed',
                        duration: Date.now() - startTime
                    });
                } else {
                    resolve({
                        passed: true,
                        message: 'Timer functionality working correctly',
                        duration: Date.now() - startTime
                    });
                }
            }, 3500); // Wait slightly longer than timer duration
        });
    },
    
    async testMinigameLogic() {
        const startTime = Date.now();
        
        // Test minigame selection
        const minigame = GameFlow.selectRandomMinigame();
        
        if (!CONFIG.MINIGAMES.includes(minigame)) {
            return {
                passed: false,
                message: `Invalid minigame selected: ${minigame}`,
                duration: Date.now() - startTime
            };
        }
        
        // Test minigame state reset
        GameFlow.resetMinigameState(minigame);
        
        // Verify state was reset based on minigame type
        switch (minigame) {
            case 'hunting':
                if (gameState.minigameGrid.some(cell => cell !== null)) {
                    return {
                        passed: false,
                        message: 'Hunting grid not reset properly',
                        duration: Date.now() - startTime
                    };
                }
                break;
            case 'quantum':
                if (gameState.quantumPositions.size !== 0 || gameState.quantumTraps.size !== 0) {
                    return {
                        passed: false,
                        message: 'Quantum state not reset properly',
                        duration: Date.now() - startTime
                    };
                }
                break;
        }
        
        return {
            passed: true,
            message: 'Minigame logic working correctly',
            duration: Date.now() - startTime
        };
    },
    
    async testMultiplayerSync() {
        const startTime = Date.now();
        
        // Test connection status
        if (typeof gameState.connectionStatus !== 'string') {
            return {
                passed: false,
                message: 'Connection status not initialized',
                duration: Date.now() - startTime
            };
        }
        
        // Test valid connection status values
        const validStatuses = ['connected', 'connecting', 'disconnected', 'error'];
        if (!validStatuses.includes(gameState.connectionStatus)) {
            return {
                passed: false,
                message: `Invalid connection status: ${gameState.connectionStatus}`,
                duration: Date.now() - startTime
            };
        }
        
        // Test game state validation
        const validation = Security.validateGameState(gameState);
        if (!validation.isValid) {
            return {
                passed: false,
                message: `Game state validation failed: ${validation.errors.join(', ')}`,
                duration: Date.now() - startTime
            };
        }
        
        return {
            passed: true,
            message: 'Multiplayer sync components working correctly',
            duration: Date.now() - startTime
        };
    },
    
    async testInputValidation() {
        const startTime = Date.now();
        
        // Test username validation
        const validUsername = Security.validateUsername('TestUser', document.createElement('input'));
        if (!validUsername) {
            return {
                passed: false,
                message: 'Valid username rejected',
                duration: Date.now() - startTime
            };
        }
        
        const invalidUsername = Security.validateUsername('A', document.createElement('input'));
        if (invalidUsername) {
            return {
                passed: false,
                message: 'Invalid username accepted',
                duration: Date.now() - startTime
            };
        }
        
        // Test room code validation
        const validRoomCode = Security.validateRoomCode('ABC123', document.createElement('input'));
        if (!validRoomCode) {
            return {
                passed: false,
                message: 'Valid room code rejected',
                duration: Date.now() - startTime
            };
        }
        
        const invalidRoomCode = Security.validateRoomCode('abc123', document.createElement('input'));
        if (invalidRoomCode) {
            return {
                passed: false,
                message: 'Invalid room code accepted',
                duration: Date.now() - startTime
            };
        }
        
        return {
            passed: true,
            message: 'Input validation working correctly',
            duration: Date.now() - startTime
        };
    },
    
    async testPerformanceBenchmarks() {
        const startTime = Date.now();
        
        // Test DOM manipulation performance
        const testElement = document.createElement('div');
        testElement.id = 'test-performance';
        document.body.appendChild(testElement);
        
        const domStart = performance.now();
        for (let i = 0; i < 100; i++) {
            testElement.textContent = `Test ${i}`;
        }
        const domTime = performance.now() - domStart;
        
        // Test array operations performance
        const arrayStart = performance.now();
        const testArray = [];
        for (let i = 0; i < 1000; i++) {
            testArray.push(i);
        }
        const arrayTime = performance.now() - arrayStart;
        
        // Clean up
        document.body.removeChild(testElement);
        
        // Performance thresholds
        if (domTime > 100) {
            return {
                passed: false,
                message: `DOM manipulation too slow: ${domTime.toFixed(2)}ms`,
                duration: Date.now() - startTime
            };
        }
        
        if (arrayTime > 10) {
            return {
                passed: false,
                message: `Array operations too slow: ${arrayTime.toFixed(2)}ms`,
                duration: Date.now() - startTime
            };
        }
        
        return {
            passed: true,
            message: `Performance benchmarks passed (DOM: ${domTime.toFixed(2)}ms, Array: ${arrayTime.toFixed(2)}ms)`,
            duration: Date.now() - startTime
        };
    },
    
    async testErrorHandling() {
        const startTime = Date.now();
        
        // Test error logging
        const originalErrorCount = DebugTools.errorHistory.length;
        
        try {
            throw new Error('Test error');
        } catch (error) {
            // Error should be logged
        }
        
        if (DebugTools.errorHistory.length <= originalErrorCount) {
            return {
                passed: false,
                message: 'Error not logged properly',
                duration: Date.now() - startTime
            };
        }
        
        // Test graceful degradation
        const testFunction = () => {
            throw new Error('Test function error');
        };
        
        try {
            testFunction();
        } catch (error) {
            // Should not crash the application
            if (error.message !== 'Test function error') {
                return {
                    passed: false,
                    message: 'Error handling not working correctly',
                    duration: Date.now() - startTime
                };
            }
        }
        
        return {
            passed: true,
            message: 'Error handling working correctly',
            duration: Date.now() - startTime
        };
    },
    
    // Test reporting
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = (passedTests / totalTests) * 100;
        
        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: successRate.toFixed(1)
            },
            results: this.testResults,
            timestamp: Date.now()
        };
        
        console.group('Test Suite Results');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success Rate: ${successRate.toFixed(1)}%`);
        
        if (failedTests > 0) {
            console.group('Failed Tests');
            this.testResults.filter(r => !r.passed).forEach(result => {
                console.log(`❌ ${result.name}: ${result.message}`);
            });
            console.groupEnd();
        }
        
        console.groupEnd();
        
        // Store report
        localStorage.setItem('test_report', JSON.stringify(report));
        
        return report;
    },
    
    // Continuous testing
    startContinuousTesting() {
        setInterval(() => {
            this.runCriticalTests();
        }, 30000); // Every 30 seconds
    },
    
    async runCriticalTests() {
        const criticalTests = [
            'Game State Initialization',
            'Player Management',
            'Input Validation'
        ];
        
        for (const testName of criticalTests) {
            try {
                await this.runTest(testName);
            } catch (error) {
                Utils.log(`Critical test failed: ${testName} - ${error.message}`, 'error');
            }
        }
    },
    
    // Test utilities
    createMockPlayer(name = 'Test Player') {
        return {
            id: Security.generateSecureId(),
            name: name,
            score: 0,
            isComputer: false,
            isHost: false
        };
    },
    
    createMockGameState() {
        return {
            room: Utils.generateRoomCode(),
            players: [this.createMockPlayer()],
            currentRound: 1,
            currentQuestion: null,
            selectedAnswers: [],
            isHost: true
        };
    },
    
    // Performance testing
    async benchmarkFunction(func, iterations = 1000) {
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            func();
        }
        
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const averageTime = totalTime / iterations;
        
        return {
            totalTime,
            averageTime,
            iterations
        };
    }
};