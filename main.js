
// main.js — Full Game Logic for Trivia Murder Party

const SUPABASE_URL = 'https://iftehkxnwnhuugqtatzq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdGVoa3hud25odXVncXRhdHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTY0MjQsImV4cCI6MjA2NjQ5MjQyNH0.pfEUmJTCd1aNKLplV_qZdQagR1ZlqliCxMamUy6egrg';  const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let gameState = {
  userId: null,
  username: null,
  roomCode: null,
  isHost: false,
  players: [],
  currentQuestion: null,
  phase: 'lobby',
  minigame: null,
  score: {},
  winners: [],
  losers: [],
  round: 1,
  totalRounds: 5,
  backupQuestions: [],
};

// === Utility ===
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

// === Room Management ===
document.getElementById('createRoomBtn').onclick = async () => {
  gameState.username = prompt('Enter a username');
  gameState.roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  gameState.isHost = true;
  const { data: room, error: roomError } = await supabase.from('rooms').insert([{ code: gameState.roomCode }]);
  const { data: player, error: playerError } = await supabase.from('players').insert([
    { room_code: gameState.roomCode, username: gameState.username, is_host: true }
  ]);
  subscribeToGame();
  showScreen('lobbyScreen');
  document.getElementById('roomCodeDisplay').textContent = gameState.roomCode;
};

document.getElementById('joinRoomBtn').onclick = () => showScreen('joinRoomScreen');
document.getElementById('joinRoomSubmit').onclick = async () => {
  gameState.roomCode = document.getElementById('roomCodeInput').value.toUpperCase();
  gameState.username = document.getElementById('usernameInput').value;
  const { data: player, error } = await supabase.from('players').insert([
    { room_code: gameState.roomCode, username: gameState.username }
  ]);
  subscribeToGame();
  showScreen('lobbyScreen');
  document.getElementById('roomCodeDisplay').textContent = gameState.roomCode;
};

async function subscribeToGame() {
  supabase.channel(`room:${gameState.roomCode}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state', filter: `room_code=eq.${gameState.roomCode}` },
      payload => {
        handleGameState(payload.new);
      })
    .subscribe();
}

// === Host Starts Game ===
document.getElementById('startGameBtn').onclick = async () => {
  if (!gameState.isHost) return;
  await loadBackupQuestions();
  await startTriviaRound();
};

async function loadBackupQuestions() {
  const res = await fetch("https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple");
  const json = await res.json();
  gameState.backupQuestions = json.results || [];
}

// === Trivia Round Logic ===
async function startTriviaRound() {
  const question = gameState.backupQuestions.pop();
  gameState.currentQuestion = question;
  const payload = {
    room_code: gameState.roomCode,
    phase: 'question',
    question_data: question,
  };
  await supabase.from('game_state').upsert([payload]);
}

function handleGameState(state) {
  gameState.phase = state.phase;
  if (state.phase === 'question') {
    renderQuestion(state.question_data);
  } else if (state.phase === 'minigame') {
    startMinigame(state.minigame_name);
  }
}

function renderQuestion(q) {
  showScreen('questionScreen');
  document.getElementById('questionText').textContent = decodeHTML(q.question);
  const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
  const container = document.getElementById('answerButtons');
  container.innerHTML = '';
  answers.forEach(a => {
    const btn = document.createElement('button');
    btn.textContent = decodeHTML(a);
    btn.onclick = () => submitAnswer(a === q.correct_answer);
    container.appendChild(btn);
  });
  startQuestionTimer();
}

function decodeHTML(html) {
  const el = document.createElement("textarea");
  el.innerHTML = html;
  return el.value;
}

function startQuestionTimer() {
  let time = 10;
  const timer = setInterval(() => {
    document.getElementById('questionTimer').textContent = time + 's';
    if (--time < 0) {
      clearInterval(timer);
      submitAnswer(false);
    }
  }, 1000);
}

async function submitAnswer(correct) {
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('room_code', gameState.roomCode)
    .eq('username', gameState.username)
    .single();
  await supabase.from('player_actions').insert([
    {
      player_id: player.id,
      room_code: gameState.roomCode,
      round_number: gameState.round,
      action_type: 'answer',
      payload: { correct }
    }
  ]);
  showScreen('scoreboardScreen');
}

// === Minigame Manager ===
function startMinigame(name) {
  showScreen('minigameScreen');
  const container = document.getElementById('minigameScreen');
  container.innerHTML = `<h2>Minigame: ${name}</h2><p>Starting...</p>`;
  // Load correct minigame function
}

// === Scoreboard Update ===
document.getElementById('nextRoundBtn').onclick = async () => {
  gameState.round++;
  if (gameState.round > gameState.totalRounds) {
    startFinalRound();
  } else {
    await startTriviaRound();
  }
};

// === Final Round ===
function startFinalRound() {
  showScreen('finalRoundScreen');
  // Load and render a special 2-answer question
}
