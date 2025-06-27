/**
 * Trivia Murder Party - Core Game Logic
 * Essential configuration, utilities, and state management
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
        connectionStatus: 'disconnected',
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
    },

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.STATIC_DATA = STATIC_DATA;
    window.gameState = gameState;
    window.Utils = Utils;
    window.DOM = DOM;
    window.ScreenManager = ScreenManager;
    window.TimerManager = TimerManager;
    window.GameStateManager = GameStateManager;
    window.initializeGameState = initializeGameState;
} 