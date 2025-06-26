window.onload = function () {
  const supabaseUrl = 'https://iftehkxnwnhuugqtatzq.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdGVoa3hud25odXVncXRhdHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTY0MjQsImV4cCI6MjA2NjQ5MjQyNH0.pfEUmJTCd1aNKLplV_qZdQagR1ZlqliCxMamUy6egrg';
  const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  const gameState = {
    room: null,
    players: [],
    isHost: false,
  };

  async function createRoom(username) {
    const roomCode = generateRoomCode();
    gameState.room = roomCode;
    gameState.isHost = true;

    const { error } = await client
      .from('rooms')
      .insert([{ code: roomCode, status: 'waiting' }]);

    if (error) {
      console.error('Error creating room:', error.message);
      return;
    }

    console.log('Room created:', roomCode);
  }

  function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function confirmUsername() {
    const username = prompt('Enter your username:');
    if (!username) return;
    createRoom(username);
  }

  document.getElementById('createRoomBtn').addEventListener('click', confirmUsername);
  document.getElementById('joinRoomBtn').addEventListener('click', () => {
    alert('Join Room not implemented.');
  });
};
