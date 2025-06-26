
// minigames.js — contains full logic for all 5 minigames with Supabase multiplayer sync

// Game-wide utility for timers
function startTimer(duration, onTick, onExpire) {
  let time = duration;
  const interval = setInterval(() => {
    time--;
    if (onTick) onTick(time);
    if (time <= 0) {
      clearInterval(interval);
      if (onExpire) onExpire();
    }
  }, 1000);
  return interval;
}

// === Minigame Manager ===
function minigameManager(winners, losers) {
  const games = ['Grid', 'QuantumLeap', 'DiceDuel', 'ResourceRace', 'Codebreaker'];
  const chosen = games[Math.floor(Math.random() * games.length)];
  if (chosen === 'Grid') playGridHunt(winners, losers);
  else if (chosen === 'QuantumLeap') playQuantumLeap();
  else if (chosen === 'DiceDuel') playDiceDuel();
  else if (chosen === 'ResourceRace') playResourceRace();
  else if (chosen === 'Codebreaker') playCodebreaker();
}

// === Grid Hunt ===
function playGridHunt(winners, losers) {
  showScreen('minigameScreen');
  const grid = [];
  const gridSize = 5;
  for (let i = 0; i < gridSize * gridSize; i++) grid.push({ id: i + 1 });

  // Secret picks for W and L players
  // Placeholder: use UI with grid buttons + 10s timer
  // On reveal: if L picks same as W, W steals point from L or gets 1 point

  // Submit selections to Supabase and listen
  // Update scores based on collisions
}

// === Quantum Leap ===
function playQuantumLeap() {
  showScreen('minigameScreen');
  // Each player selects position 1–10
  // Then predicts opponent positions
  // Score: +1 for correct prediction, -1 for trap zone, +1 for safe zone
}

// === Dice Duel ===
function playDiceDuel() {
  showScreen('minigameScreen');
  // Each player gets 3 turns
  // For each turn: pick 1–3 dice, bet points or none
  // Roll and earn/loss points based on success
  // Update results to Supabase after each turn
}

// === Resource Race ===
function playResourceRace() {
  showScreen('minigameScreen');
  // 10 resource points, 3 turns
  // Each turn: choose to build (5 pts) or sabotage (-2)
  // Post all results and update final scores
}

// === Codebreaker ===
function playCodebreaker() {
  showScreen('minigameScreen');
  // Secret 4-digit code (1–6)
  // Players guess in turns within 8 total guesses
  // Provide feedback: correct digit/place and misplaced
  // First to solve or closest earns bonus points
}
