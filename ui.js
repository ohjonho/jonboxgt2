
// ui.js — handles screen switching, timer rendering, and dynamic DOM updates

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add('active');
}

function updateRoomCode(code) {
  const el = document.getElementById('roomCodeDisplay');
  if (el) el.textContent = code;
}

function updatePlayerList(players) {
  const list = document.getElementById('playerList');
  if (!list) return;
  list.innerHTML = '';
  players.forEach(p => {
    const item = document.createElement('div');
    item.textContent = p.username;
    list.appendChild(item);
  });
}

function startCountdown(duration, displayId, callback) {
  let time = duration;
  const el = document.getElementById(displayId);
  const timer = setInterval(() => {
    if (el) el.textContent = time + 's';
    if (--time < 0) {
      clearInterval(timer);
      if (callback) callback();
    }
  }, 1000);
  return timer;
}
