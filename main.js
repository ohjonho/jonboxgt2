window.onload = function () {
  // Initialize Supabase
  const supabaseUrl = 'https://iftehkxnwnhuugqtatzq.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // replace with your actual anon key
  const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

  const gameState = {
    room: null,
    players: [],
    isHost: false,
    // ... other game state properties
  };

  function subscribeToGameState(roomCode) {
    supabase.channel('game_state')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_state',
        filter: `room_code=eq.${roomCode}`
      }, payload => {
        console.log('Game state updated:', payload.new);
      })
      .subscribe();
  }

  function confirmUsername() {
    const username = prompt('Enter your username:');
    if (!username) return;
    createRoom(username);
  }

  async function createRoom(username) {
    const roomCode = generateRoomCode();
    gameState.room = roomCode;
    gameState.isHost = true;

    const { error } = await supabase
      .from('rooms')
      .insert([{ code: roomCode, status: 'waiting' }]);

    if (error) {
      console.error('Error creating room:', error.message);
      return;
    }

    console.log('Room created:', roomCode);
    // Go to lobby screen...
  }

  function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Event Listeners
  document.getElementById('createRoomBtn').addEventListener('click', confirmUsername);
  document.getElementById('joinRoomBtn').addEventListener('click', () => {
    alert('Join Room not implemented in this snippet.');
  });
};
