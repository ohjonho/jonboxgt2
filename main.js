window.onload = function () {
  const supabaseUrl = 'https://iftehkxnwnhuugqtatzq.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdGVoa3hud25odXVncXRhdHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTY0MjQsImV4cCI6MjA2NjQ5MjQyNH0.pfEUmJTCd1aNKLplV_qZdQagR1ZlqliCxMamUy6egrg';  const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  const gameState = {
    room: null,
    players: [],
    isHost: false,
    questions: [],
    currentMinigame: null,
  };

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async function createRoom(username) {
    const roomCode = generateRoomCode();
    gameState.room = roomCode;
    gameState.isHost = true;
    gameState.players = [{ username: username, is_host: true }];

    const { error } = await client.from('rooms').insert([{ code: roomCode, status: 'waiting' }]);
    if (error) return console.error(error.message);

    const { error: playerErr } = await client
      .from('players')
      .insert([{ room_code: roomCode, username: username, is_host: true }]);
    if (playerErr) return console.error(playerErr.message);

    showScreen('lobbyScreen');
    document.getElementById('roomCodeDisplay').textContent = gameState.room;
  }

  function confirmUsername() {
    const username = prompt("Enter your username:");
    if (!username) return;
    createRoom(username);
  }

  document.getElementById('createRoomBtn').addEventListener('click', confirmUsername);

  // ======== Minigame Manager ========
  const minigames = ["QuantumLeap", "ResourceRace", "DiceDuel", "Codebreaker"];
  function selectRandomMinigame() {
    const pick = minigames[Math.floor(Math.random() * minigames.length)];
    gameState.currentMinigame = pick;
    console.log("Selected minigame:", pick);
    if (pick === "QuantumLeap") playQuantumLeapMinigame(gameState.players);
    // Add more if-blocks as others are implemented
  }

  // ======== Quantum Leap Minigame ========
  function playQuantumLeapMinigame(players) {
    gameState.currentMinigame = "QuantumLeap";
    showScreen("quantumLeapScreen");

    const choiceInput = document.getElementById("quantumChoice");
    const predictionInput = document.getElementById("quantumPrediction");
    const submitBtn = document.getElementById("quantumSubmit");
    const timerDisplay = document.getElementById("quantumTimer");
    const messageBox = document.getElementById("quantumMessage");

    let timer = 10;
    let timerInterval;

    function countdown() {
      timerDisplay.textContent = timer + "s";
      if (timer <= 0) {
        clearInterval(timerInterval);
        messageBox.textContent = "Time's up! Submitting choices...";
        submitChoices();
      } else {
        timer--;
      }
    }

    function submitChoices() {
      const position = parseInt(choiceInput.value);
      const prediction = parseInt(predictionInput.value);
      console.log("Player selected position:", position, "and predicted:", prediction);
      messageBox.textContent = "Waiting for other players...";
      // Here you'd sync results via Supabase
    }

    submitBtn.onclick = () => {
      clearInterval(timerInterval);
      submitChoices();
    };

    timer = 10;
    timerInterval = setInterval(countdown, 1000);
  }
};
