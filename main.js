window.onload = function () {
  const supabaseUrl = 'https://iftehkxnwnhuugqtatzq.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdGVoa3hud25odXVncXRhdHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTY0MjQsImV4cCI6MjA2NjQ5MjQyNH0.pfEUmJTCd1aNKLplV_qZdQagR1ZlqliCxMamUy6egrg';  const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  const gameState = {
    room: null,
    players: [],
    isHost: false,
    questions: [],
  };

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function updateLobbyUI() {
    const roomCodeEl = document.getElementById('roomCodeDisplay');
    if (roomCodeEl && gameState.room) {
      roomCodeEl.textContent = gameState.room;
    }

    const playerList = document.getElementById('playerList');
    if (playerList) {
      playerList.innerHTML = gameState.players.map(p => `<div>${p.username}</div>`).join('');
    }
  }

  async function createRoom(username) {
    const roomCode = generateRoomCode();
    gameState.room = roomCode;
    gameState.isHost = true;
    gameState.players = [{ username: username, is_host: true }];

    const { error } = await client
      .from('rooms')
      .insert([{ code: roomCode, status: 'waiting' }]);
    if (error) {
      console.error('Error creating room:', error.message);
      return;
    }

    const { error: playerErr } = await client
      .from('players')
      .insert([{ room_code: roomCode, username: username, is_host: true }]);
    if (playerErr) {
      console.error('Error adding host player:', playerErr.message);
      return;
    }

    showScreen('lobbyScreen');
    updateLobbyUI();
    fetchTriviaQuestions();
  }

  async function joinRoom() {
    const roomCodeInput = document.getElementById('roomCodeInput');
    const usernameInput = document.getElementById('usernameInput');
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    const username = usernameInput.value.trim();

    if (!roomCode || !username) {
      alert("Please enter both room code and username.");
      return;
    }

    const { data: room, error } = await client
      .from('rooms')
      .select('*')
      .eq('code', roomCode)
      .single();

    if (error || !room) {
      alert("Room not found.");
      return;
    }

    const { error: playerErr } = await client
      .from('players')
      .insert([{ room_code: roomCode, username: username }]);
    if (playerErr) {
      alert("Error joining room.");
      return;
    }

    gameState.room = roomCode;
    gameState.isHost = false;
    gameState.players.push({ username });

    showScreen('lobbyScreen');
    updateLobbyUI();
  }

  async function fetchTriviaQuestions() {
    try {
      const res = await fetch("https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple");
      const json = await res.json();
      if (json.response_code !== 0) throw new Error("No questions returned");

      gameState.questions = json.results.map(q => {
        const allOptions = [...q.incorrect_answers, q.correct_answer];
        const shuffled = allOptions.sort(() => 0.5 - Math.random());
        return {
          question: decodeHTML(q.question),
          options: shuffled.map(decodeHTML),
          correct: decodeHTML(q.correct_answer)
        };
      });

      console.log("Fetched trivia questions:", gameState.questions);
    } catch (err) {
      console.error("Failed to load trivia:", err);
    }
  }

  function decodeHTML(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function confirmUsername() {
    const username = prompt("Enter your username:");
    if (!username) return;
    createRoom(username);
  }

  // Event Listeners
  document.getElementById('createRoomBtn').addEventListener('click', confirmUsername);
  document.getElementById('joinRoomBtn').addEventListener('click', joinRoom);
};
