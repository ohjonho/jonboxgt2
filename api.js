/**
 * Trivia Murder Party - API Management
 * Handles all API-related functionality, question fetching, and processing
 */

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

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.APIManager = APIManager;
    window.processTheTriviaApi = processTheTriviaApi;
    window.processOpenTriviaApi = processOpenTriviaApi;
} 