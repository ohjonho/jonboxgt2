// Modular Minigame UI Builder
// Each function builds and updates the UI for a minigame
// Usage: minigamesUI.buildHuntingSeasonUI(gameState, DOM, onSubmit)

const minigamesUI = {
  buildHuntingSeasonUI(gameState, DOM, onSubmit) {
    // Clear and build grid, instructions, player status
    const grid = DOM.get('huntingGrid');
    const status = DOM.get('huntingPlayerStatus');
    const instructions = DOM.get('huntingInstructions');
    if (grid) grid.innerHTML = '';
    if (status) status.innerHTML = '';
    if (instructions) {
      instructions.innerHTML = `<b>${gameState.playerStatus.get(gameState.currentPlayer.id) === 'W' ? 'You are a Hunter! Pick a square to catch losers.' : 'You are Hiding! Pick a square to hide.'}</b>`;
      instructions.style.color = gameState.playerStatus.get(gameState.currentPlayer.id) === 'W' ? '#00b894' : '#e17055';
    }
    // Build grid
    for (let i = 0; i < gameState.minigameGrid.length; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.textContent = i + 1;
      cell.onclick = () => onSubmit(i);
      grid.appendChild(cell);
    }
    // Player status
    if (status) {
      status.innerHTML = `<div><b>Hunters:</b> ${gameState.players.filter(p => gameState.playerStatus.get(p.id) === 'W').map(p => p.name).join(', ')}</div><div><b>Hunted:</b> ${gameState.players.filter(p => gameState.playerStatus.get(p.id) === 'L').map(p => p.name).join(', ')}</div>`;
    }
  },

  buildQuantumLeapUI(gameState, DOM, onSubmit, phase = 1) {
    const positionsDiv = DOM.get('quantumPositions');
    const instructions = DOM.get('quantumInstructions');
    if (positionsDiv) positionsDiv.innerHTML = '';
    if (instructions) {
      instructions.innerHTML = `<b>${phase === 1 ? 'Phase 1: Choose your leap position (1-10)' : 'Phase 2: Place a trap on any position!'}</b><br><span style='color:#ffd700'>You: ${gameState.currentPlayer.name}</span>`;
    }
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.className = 'position-btn';
      btn.textContent = i;
      btn.style.margin = '6px';
      btn.onclick = () => {
        btn.disabled = true;
        btn.classList.add('selected');
        onSubmit(i);
      };
      positionsDiv.appendChild(btn);
    }
  },

  buildResourceRaceUI(gameState, DOM, onSubmit) {
    const controls = DOM.get('resourceControls');
    const instructions = DOM.get('resourceInstructions');
    if (controls) controls.innerHTML = '';
    if (instructions) instructions.innerHTML = `<b>Allocate your 10 resources. Build projects or sabotage others!</b><br><span style='color:#ffd700'>You: ${gameState.currentPlayer.name}</span>`;
    let allocated = 0;
    let allocations = {};
    gameState.players.forEach(player => {
      if (player.id === gameState.currentPlayer.id) return;
      const div = document.createElement('div');
      div.style.margin = '8px 0';
      div.textContent = `Sabotage ${player.name}: `;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 10;
      input.value = 0;
      input.oninput = () => {
        allocations[player.id] = parseInt(input.value) || 0;
        allocated = Object.values(allocations).reduce((a, b) => a + b, 0);
        if (allocated > 10) input.value = 10 - (allocated - allocations[player.id]);
      };
      div.appendChild(input);
      controls.appendChild(div);
    });
    const buildDiv = document.createElement('div');
    buildDiv.style.margin = '8px 0';
    buildDiv.textContent = 'Build Projects: ';
    const buildInput = document.createElement('input');
    buildInput.type = 'number';
    buildInput.min = 0;
    buildInput.max = 10;
    buildInput.value = 10;
    buildInput.oninput = () => {
      allocations['build'] = parseInt(buildInput.value) || 0;
      allocated = Object.values(allocations).reduce((a, b) => a + b, 0);
      if (allocated > 10) buildInput.value = 10 - (allocated - allocations['build']);
    };
    buildDiv.appendChild(buildInput);
    controls.appendChild(buildDiv);
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit Allocation';
    submitBtn.onclick = () => onSubmit(allocations);
    controls.appendChild(submitBtn);
  },

  buildDiceDuelUI(gameState, DOM, onSubmit) {
    const controls = DOM.get('diceControls');
    const instructions = DOM.get('diceInstructions');
    if (controls) controls.innerHTML = '';
    if (instructions) instructions.innerHTML = `<b>Choose your dice and bet!</b><br><span style='color:#ffd700'>You: ${gameState.currentPlayer.name}</span>`;
    let diceCount = 1;
    let bet = 0;
    const diceLabel = document.createElement('label');
    diceLabel.textContent = 'Number of dice (1-3): ';
    const diceInput = document.createElement('input');
    diceInput.type = 'number';
    diceInput.min = 1;
    diceInput.max = 3;
    diceInput.value = 1;
    diceInput.oninput = () => { diceCount = parseInt(diceInput.value) || 1; };
    controls.appendChild(diceLabel);
    controls.appendChild(diceInput);
    controls.appendChild(document.createElement('br'));
    const betLabel = document.createElement('label');
    betLabel.textContent = 'Bet points (optional): ';
    const betInput = document.createElement('input');
    betInput.type = 'number';
    betInput.min = 0;
    betInput.max = 10;
    betInput.value = 0;
    betInput.oninput = () => { bet = parseInt(betInput.value) || 0; };
    controls.appendChild(betLabel);
    controls.appendChild(betInput);
    controls.appendChild(document.createElement('br'));
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Roll Dice!';
    submitBtn.onclick = () => onSubmit({ diceCount, bet });
    controls.appendChild(submitBtn);
  },

  buildCodebreakerUI(gameState, DOM, onSubmit) {
    const controls = DOM.get('codeControls');
    const instructions = DOM.get('codeInstructions');
    if (controls) controls.innerHTML = '';
    if (instructions) instructions.innerHTML = `<b>Crack the 4-symbol code!</b><br><span style='color:#ffd700'>You: ${gameState.currentPlayer.name}</span>`;
    const guess = [];
    const symbols = ['🔴', '🟡', '🟢', '🔵'];
    for (let i = 0; i < 4; i++) {
      const select = document.createElement('select');
      symbols.forEach(sym => {
        const opt = document.createElement('option');
        opt.value = sym;
        opt.textContent = sym;
        select.appendChild(opt);
      });
      select.onchange = () => { guess[i] = select.value; };
      controls.appendChild(select);
    }
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit Guess';
    submitBtn.onclick = () => onSubmit([...guess]);
    controls.appendChild(submitBtn);
  }
};

if (typeof window !== 'undefined') {
  window.minigamesUI = minigamesUI;
}