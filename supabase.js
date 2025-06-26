
// supabase.js — handles Supabase setup, game state sync, and multiplayer data flow

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Subscribe to game_state updates
function subscribeToGameState(roomCode, onChange) {
  supabase.channel('game_state_channel_' + roomCode)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state', filter: `room_code=eq.${roomCode}` },
      payload => onChange(payload.new))
    .subscribe();
}

// Submit player move or action
async function submitPlayerAction(roomCode, playerId, round, type, payload) {
  await supabase.from('player_actions').insert([{
    player_id: playerId,
    room_code: roomCode,
    round_number: round,
    action_type: type,
    payload: payload
  }]);
}

// Update phase or state for room
async function updateGameState(roomCode, updates) {
  await supabase.from('game_state').upsert([{
    room_code: roomCode,
    ...updates,
    updated_at: new Date().toISOString()
  }]);
}

// Get all players in a room
async function fetchPlayers(roomCode) {
  const { data, error } = await supabase.from('players').select('*').eq('room_code', roomCode);
  return data || [];
}

// Get current player's ID from Supabase based on name and room
async function getPlayerId(roomCode, username) {
  const { data, error } = await supabase.from('players')
    .select('id').eq('room_code', roomCode).eq('username', username).single();
  return data?.id || null;
}
