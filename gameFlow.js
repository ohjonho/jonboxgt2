
// gameFlow.js — manages game states, phases, transitions, and integrates with minigames.js

let gameState = {
  roomCode: null,
  username: null,
  userId: null,
  isHost: false,
  phase: 'lobby',
  round: 1,
  totalRounds: 5,
  currentQuestion: null,
  winners: [],
  losers: [],
  score: {},
  backupQuestions: [],
  playerList: []
};

// Show UI screen by ID
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

// === Game Flow ===
async function startGame() {
  gameState.round = 1;
  await fetchBackupQuestions();
  await startTriviaRound();
}

async function fetchBackupQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple');
  const json = await res.json();
  gameState.backupQuestions = json.results || [];
}

async function startTriviaRound() {
  gameState.phase = 'trivia';
  const q = gameState.backupQuestions.pop();
  gameState.currentQuestion = q;
  showTriviaQuestion(q);
  // Supabase: update game_state with trivia question and phase
}

function handleAnswerResult(correctPlayers, incorrectPlayers) {
  gameState.winners = correctPlayers;
  gameState.losers = incorrectPlayers;
  gameState.round++;
  if (gameState.round > gameState.totalRounds) {
    startFinalRound();
  } else {
    startMinigamePhase();
  }
}

function startMinigamePhase() {
  gameState.phase = 'minigame';
  minigameManager(gameState.winners, gameState.losers);
}

function startFinalRound() {
  gameState.phase = 'final';
  showScreen('finalRoundScreen');
  // Present 2-of-5-answer question and evaluate
}

function endGame() {
  gameState.phase = 'end';
  showScreen('finalScoreboardScreen');
  // Display total scores, wins, stats
}
