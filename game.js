let gameActive = false;
if(!gameActive){
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "Select the Game To Play";
}
// Utility for delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function startGame(gameType) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";
  clearAllTimers();
  
  // Get user name before starting the game
  let name = localStorage.getItem("userName");
  if (!name) {
    name = await getUserName();
    localStorage.setItem("userName", name);
  }
  
  gameActive = true;

  // Remove active class from all game buttons
  document.querySelectorAll('.game-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active class to the selected game button
  const selectedBtn = document.querySelector(`.game-btn[onclick="startGame('${gameType}')"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }

  if (gameType === "circle") {
    startCircleGame(gameArea);
  } else if (gameType === "clicker") {
    startClickerGame(gameArea);
  } else if (gameType === "memory") {
    startMemoryGame(gameArea);
  } else if (gameType === "guess") {
    startGuessGame(gameArea);
  } else if (gameType === "whack") {
    startWhackGame(gameArea);
  }
}

function clearAllTimers() {
  clearTimeout(window.circleTimeout);
  clearInterval(window.clickerInterval);
  clearTimeout(window.whackTimeout);
  clearInterval(window.whackInterval);
}

/* ================= Circle Reaction Game ================= */

function startCircleGame(container) {
  let reactionTimes = [];
  let startTime;
  container.innerHTML = `
    <p id="message">Click the circle as fast as you can!</p>
    <div id="circle"></div>
  `;
  const circle = container.querySelector("#circle");
  const message = container.querySelector("#message");

  function getAverageTime(times) {
    const validTimes = times.filter((t) => typeof t === "number" && !isNaN(t));
    return validTimes.length
      ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
      : 0;
  }

  function positionCircle() {
    const size = 80;
    const padding = 20;
    const x = Math.random() * (container.clientWidth - size - padding);
    const y =
      Math.random() * (container.clientHeight - size - padding - 30) + 30;

    circle.style.top = `${y}px`;
    circle.style.left = `${x}px`;
    circle.textContent = "click me";
    circle.style.display = "flex";
    circle.style.backgroundColor = "var(--accent)";
    startTime = performance.now();
    circle.setAttribute("data-ready", "true");
  }

  positionCircle();

  circle.onclick = () => {
    if (!gameActive) return;
    // Only allow click if circle is visible and ready
    if (
      circle.style.display !== "flex" ||
      circle.getAttribute("data-ready") !== "true"
    )
      return;
    if (typeof startTime !== "number") return;
    const reaction = (performance.now() - startTime) / 1000;
    reactionTimes.push(reaction);
    message.textContent = `Reaction: ${reaction.toFixed(
      2
    )}s | Avg: ${getAverageTime(reactionTimes).toFixed(2)}s`;
    circle.style.display = "none";
    circle.setAttribute("data-ready", "false");
    window.circleTimeout = setTimeout(
      positionCircle,
      Math.random() * 1500 + 1000
    );

    if (reactionTimes.length === 5) {
      gameActive = false;
      saveScore("circle", Number(getAverageTime(reactionTimes).toFixed(2)));
      message.textContent += " | Game Over!";
      return;
    }
  };

  // Ensure the first circle is ready and has text
  window.circleTimeout = setTimeout(positionCircle, 1000);
}

/* ================= Speed Clicker Game ================= */

function startClickerGame(container) {
  let score = 0;
  let timeLeft = 10;

  container.innerHTML = `
    <h3 class="game_rule">Click as many times as you can ${gameInfoIcon('clicker')}</h3>
    <p>Time Left: <span id="timeLeft">10</span>s</p>
    <p class="score">Score: <span id="clickScore">0</span></p>
    <button id="clickMeBtn">Click Me!</button>
  `;

  const timeLeftSpan = container.querySelector("#timeLeft");
  const scoreSpan = container.querySelector("#clickScore");
  const clickMeBtn = container.querySelector("#clickMeBtn");

  clickMeBtn.onclick = () => {
    if (!gameActive) return;
    score++;
    scoreSpan.textContent = score;
  };

  window.clickerInterval = setInterval(() => {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(window.clickerInterval);
      clickMeBtn.disabled = true;
      clickMeBtn.textContent = "Time's Up!";
      gameActive = false;
      saveScore("clicker", score);
    }
  }, 1000);
}

/* ================= Memory Card Match Game ================= */

function startMemoryGame(container) {
  const cards = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥝", "🍍"];
  let gameCards = [...cards, ...cards]; // duplicate pairs
  gameCards = shuffleArray(gameCards);

  container.innerHTML = `
    <h3 class="game_rule">Match all the pairs! ${gameInfoIcon('memory')}</h3>
    <div id="memoryGrid"></div>
    <p id="memoryMessage"></p>
  `;

  const grid = container.querySelector("#memoryGrid");
  const message = container.querySelector("#memoryMessage");
  let flipped = [];
  let matched = [];
  let startTime = Date.now(); // Start timer

  gameCards.forEach((emoji, idx) => {
    const card = document.createElement("div");
    card.className = "memoryCard";
    card.dataset.index = idx;
    card.dataset.emoji = emoji;
    card.textContent = emoji;
    grid.appendChild(card);
  });

  grid.addEventListener("click", (e) => {
    if (!gameActive) return;
    const target = e.target;
    if (!target.classList.contains("memoryCard")) return;
    const idx = Number(target.dataset.index);
    if (matched.includes(idx) || flipped.includes(idx)) return;
    if (flipped.length >= 2) return;

    flipCard(target);

    flipped.push(idx);

    if (flipped.length === 2) {
      const first = gameCards[flipped[0]];
      const second = gameCards[flipped[1]];

      if (first === second) {
        matched.push(...flipped);
        flipped = [];
        message.textContent = "🎉 Matched!";
        matched.forEach((i) => {
          grid.children[i].classList.add("matched");
          grid.children[i].classList.remove("flipped");
        });
        if (matched.length === gameCards.length) {
          const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
          message.textContent = `🎉 You matched all pairs in ${timeTaken}s!`;
          gameActive = false;
          saveScore("memory", Number(timeTaken)); // Save time taken as score
        }
      } else {
        message.textContent = "Try again!";
        setTimeout(() => {
          flipped.forEach((i) => {
            unflipCard(grid.children[i]);
          });
          flipped = [];
          message.textContent = "";
        }, 1200);
      }
    }
  });

  function flipCard(card) {
    card.classList.add("flipped");
    card.style.color = "var(--text-primary)";
    // card.style.background = "var(--bg-primary)";
  }

  function unflipCard(card) {
    card.classList.remove("flipped");
    card.style.color = "transparent";
    // card.style.background = "var(--accent)";
  }
}

/* ================= Guess the Number Game ================= */

function startGuessGame(container) {
  const target = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  container.innerHTML = `
    <h3 class="game_rule">Guess the Number (1-100) ${gameInfoIcon('guess')}</h3>
    <input type="number" id="guessInput" min="1" max="100" placeholder="Enter your guess" />
    <button id="guessBtn">Guess</button>
    <p id="guessResult"></p>
    <p class="score">Attempts: <span id="guessAttempts">0</span></p>
  `;

  const guessInput = container.querySelector("#guessInput");
  const guessBtn = container.querySelector("#guessBtn");
  const guessResult = container.querySelector("#guessResult");
  const guessAttempts = container.querySelector("#guessAttempts");

  guessBtn.onclick = () => {
    if (!gameActive) return;
    const val = Number(guessInput.value);
    if (val < 1 || val > 100 || isNaN(val)) {
      guessResult.textContent =
        "Please enter a valid number between 1 and 100.";
      return;
    }
    attempts++;
    guessAttempts.textContent = attempts;

    if (val === target) {
      guessResult.textContent = `🎉 Correct! You guessed it in ${attempts} attempts!`;
      gameActive = false;
      guessBtn.disabled = true;
      saveScore("guess", attempts); // Lower is better
    } else if (val < target) {
      guessResult.textContent = "Too low! Try again.";
    } else {
      guessResult.textContent = "Too high! Try again.";
    }
    guessInput.value = "";
    guessInput.focus();
  };
}

/* ================= Find Totoro! Game ================= */

function startWhackGame(container) {
  let score = 0;
  let timeLeft = 30; // 30 seconds game duration
  let whackTimer = null;
  container.innerHTML = `
    <h3 class="game_rule">Find Totoro! ${gameInfoIcon('whack')}</h3>
    <p class="score">Score: <span id="whackScore">0</span></p>
    <p>Time Left: <span id="whackTime">30</span>s</p>
    <div id="whackGrid"></div>
  `;

  const grid = container.querySelector("#whackGrid");
  const whackTime = container.querySelector("#whackTime");
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement("div");
    hole.dataset.index = i;
    const mole = document.createElement("img"); // Create img element for mole
    mole.style.borderRadius = "12px";
    mole.src = "icon.png"; // Use icon.png as mole
    mole.style.width = "100%";
    mole.style.height = "100%";
    mole.style.display = "none"; // Initially hide the mole
    hole.appendChild(mole);
    grid.appendChild(hole);
  }

  function clearMoles() {
    [...grid.children].forEach((cell) => {
      cell.classList.remove("active");
      cell.querySelector("img").style.display = "none";
      cell.onclick = null;
    });
  }

  function showMole() {
    if (!gameActive) return;
    clearMoles();
    const moleIndex = Math.floor(Math.random() * 9);
    const moleHole = grid.children[moleIndex];
    moleHole.classList.add("active");
    moleHole.querySelector("img").style.display = "block";
    moleHole.onclick = () => {
      if (!gameActive) return;
      score++;
      document.getElementById("whackScore").textContent = score;
      moleHole.classList.remove("active");
      moleHole.querySelector("img").style.display = "none";
    };
    window.whackTimeout = setTimeout(showMole, Math.random() * 400 + 300);
  }

  function endWhackGame() {
    gameActive = false;
    clearMoles();
    if (window.whackTimeout) clearTimeout(window.whackTimeout);
    if (whackTimer) clearInterval(whackTimer);
    saveScore("whack", score);
    const message = document.createElement("p");
    message.textContent = `Game Over! Your score: ${score}`;
    container.appendChild(message);
  }

  // Start the timer
  whackTimer = setInterval(() => {
    timeLeft--;
    whackTime.textContent = timeLeft;
    if (timeLeft <= 0) {
      endWhackGame();
    }
  }, 1000);

  showMole();
}

/* ============== Utility ============== */

function shuffleArray(arr) {
  let currentIndex = arr.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
}

// ====== User Name Modal Logic ======
function getUserName() {
  return new Promise((resolve) => {
    const modal = document.getElementById("userNameModal");
    const input = document.getElementById("userNameInput");
    const btn = document.getElementById("userNameSubmitBtn");
    modal.style.display = "flex";
    input.value = "";
    input.focus();
    function submit() {
      const name = input.value.trim();
      if (name) {
        modal.style.display = "none";
        btn.removeEventListener("click", submit);
        input.removeEventListener("keydown", onKeyDown);
        resolve(name);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Enter") submit();
    }
    btn.addEventListener("click", submit);
    input.addEventListener("keydown", onKeyDown);
  });
}

// getUserName();

function showGraffitiCelebration() {
  const graffiti = document.createElement('div');
  graffiti.className = 'graffiti-celebration';
  graffiti.textContent = 'HIGH SCORE!';
  document.body.appendChild(graffiti);
  
  // Remove the element after animation completes
  setTimeout(() => {
    graffiti.remove();
  }, 2000);
}

// Test the celebration
// showGraffitiCelebration();

async function saveScore(game, score) {
  const name = localStorage.getItem("userName");
  if (!name) {
    console.error("No user name found");
    return;
  }

  try {
    const response = await fetch("https://portfolio-api-dwyy.onrender.com/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game, name, score }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Score save response:', data);

    // Get current high scores to check if this is a new high score
    const hofResponse = await fetch(`https://portfolio-api-dwyy.onrender.com/api/hall-of-fame/${game}`);
    if (hofResponse.ok) {
      const highScores = await hofResponse.json();
      console.log('Current high scores:', highScores);
      // Determine if lower or higher is better
      const lowerIsBetter = ["guess", "memory", "circle"].includes(game);
      let isHighScore = false;
      if (highScores.length < 3) {
        isHighScore = true;
      } else if (lowerIsBetter) {
        isHighScore = score < highScores[highScores.length - 1].score;
      } else {
        isHighScore = score > highScores[highScores.length - 1].score;
      }
      console.log('Is high score:', isHighScore);
      if (isHighScore) {
        showGraffitiCelebration();
      }
    }

    // Update the hall of fame display
    updateHallOfFame(game);
  } catch (error) {
    console.error('Error saving score:', error);
    updateHallOfFame(game);
  }
}

// ====== Hall of Fame Update Logic ======
// Track if any hall of fame data loaded successfully
window._hofAnySuccess = false;

function updateHallOfFame(game) {
  const ul = document.getElementById(`hof-list-${game}`);
  if (!ul) return;
  const hofSection = document.querySelector(".hall-of-fame-section");
  fetch(`https://portfolio-api-dwyy.onrender.com/api/hall-of-fame/${game}`)
    .then((res) => {
      if (!res.ok) throw new Error("No response");
      return res.json();
    })
    .then((list) => {
      ul.innerHTML = "";
      if (hofSection) hofSection.style.display = "";
      list.forEach((entry, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="hall-of-fame-rank">#${
          i + 1
        }</span> <span>${entry.name}</span> <span>${entry.score}</span>`;
        ul.appendChild(li);
      });
      window._hofAnySuccess = true;
    })
    .catch(() => {
      // On error, clear this game's list
      ul.innerHTML = "";
    })
    .finally(() => {
      // After all fetches, if none succeeded, hide the whole section
      // Wait for all updates to finish (after DOMContentLoaded)
      if (typeof window._hofUpdateCount === "undefined") {
        window._hofUpdateCount = 0;
      }
      window._hofUpdateCount++;
      if (window._hofUpdateCount === 5) {
        if (!window._hofAnySuccess && hofSection) {
          hofSection.style.display = "none";
        }
      }
    });
}

// ====== On page load, update all Hall of Fame lists ======
window.addEventListener("DOMContentLoaded", () => {
  ["memory", "whack", "circle", "clicker", "guess"].forEach(updateHallOfFame);

  // Add toggle functionality for games section
  const gamesToggleTitle = document.getElementById("gamesToggleTitle");
  const gamesContent = document.getElementById("gamesContent");
  const gamesToggleIcon = document.getElementById("gamesToggleIcon");

  if (gamesToggleTitle && gamesContent && gamesToggleIcon) {
    gamesContent.classList.add("games-content-collapsed");
    gamesToggleIcon.textContent = "▼";
    gamesToggleTitle.classList.add("games-collapsed");
    
    gamesToggleTitle.onclick = function () {
      if (gamesContent.classList.contains("games-content-collapsed")) {
        gamesContent.classList.remove("games-content-collapsed");
        gamesToggleIcon.textContent = "▲";
        gamesToggleTitle.classList.remove("games-collapsed");
      } else {
        gamesContent.classList.add("games-content-collapsed");
        gamesToggleIcon.textContent = "▼";
        gamesToggleTitle.classList.add("games-collapsed");
      }
    };
  }
});

/* ================= Conway's Game of Life ================= */

function startConwayGame(container) {
  const gridSize = 40; // Increased grid size for more interesting patterns
  const cellSize = 12; // Adjusted cell size for better visibility
  let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  let animationFrameId = null;
  let lastUpdate = 0;
  const updateInterval = 300; // Control animation speed (lower = faster)

  // Create canvas
  const canvas = document.getElementById('conwayCanvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  const ctx = canvas.getContext("2d");

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "var(--border)";
    ctx.lineWidth = 0.3; // Thinner grid lines

    // Draw vertical lines
    for (let x = 0; x <= gridSize; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, canvas.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= gridSize; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(canvas.width, y * cellSize);
      ctx.stroke();
    }
  }

  function drawCells() {
    // Use a solid color with good contrast
    ctx.fillStyle = "#4CAF50";  // A visible green color
    ctx.strokeStyle = "#2E7D32"; // Darker green for border
    ctx.lineWidth = 1;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (grid[y][x]) {
          // Draw cells with rounded corners and border
          ctx.beginPath();
          ctx.roundRect(
            x * cellSize + 1,
            y * cellSize + 1,
            cellSize - 2,
            cellSize - 2,
            2
          );
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }

  function countNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + gridSize) % gridSize;
        const ny = (y + dy + gridSize) % gridSize;
        count += grid[ny][nx];
      }
    }
    return count;
  }

  function updateGrid() {
    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const neighbors = countNeighbors(x, y);
        if (grid[y][x]) {
          newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          newGrid[y][x] = neighbors === 3 ? 1 : 0;
        }
      }
    }
    grid = newGrid;
  }

  function createGlider(x, y) {
    const pattern = [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ];
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const nx = (x + dx + gridSize) % gridSize;
        const ny = (y + dy + gridSize) % gridSize;
        grid[ny][nx] = pattern[dy][dx];
      }
    }
  }

  function createBlinker(x, y) {
    const pattern = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ];
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        const nx = (x + dx + gridSize) % gridSize;
        const ny = (y + dy + gridSize) % gridSize;
        grid[ny][nx] = pattern[dy][dx];
      }
    }
  }

  function randomizeGrid() {
    // Clear the grid first
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    
    // Add some random cells
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        grid[y][x] = Math.random() > 0.7 ? 1 : 0;
      }
    }

    // Add some interesting patterns
    createGlider(Math.floor(gridSize * 0.2), Math.floor(gridSize * 0.2));
    createBlinker(Math.floor(gridSize * 0.7), Math.floor(gridSize * 0.7));
  }

  function animate(timestamp) {
    if (timestamp - lastUpdate >= updateInterval) {
      updateGrid();
      lastUpdate = timestamp;
    }
    drawGrid();
    drawCells();
    animationFrameId = requestAnimationFrame(animate);
  }

  // Initialize with random pattern
  randomizeGrid();
  drawGrid();
  drawCells();
  
  // Start animation
  animationFrameId = requestAnimationFrame(animate);

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    drawGrid();
    drawCells();
  });

  // Cleanup function to stop animation when needed
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

// Initialize Conway's Game of Life when the DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  const conwayFooter = document.getElementById("conwayFooter");
  if (conwayFooter) {
    startConwayGame(conwayFooter);
  }
});

function ensureGameInfoModal() {
  if (document.getElementById('gameInfoModal')) return;
  const modal = document.createElement('div');
  modal.id = 'gameInfoModal';
  modal.className = 'game-info-modal';
  modal.innerHTML = `
    <div class="game-info-modal-backdrop"></div>
    <div class="game-info-modal-content">
      <button class="game-info-modal-close" aria-label="Close">&times;</button>
      <div class="game-info-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);
}

function showGameInfoModal(gameType) {
  ensureGameInfoModal();
  const modal = document.getElementById('gameInfoModal');
  const body = modal.querySelector('.game-info-modal-body');
  const closeBtn = modal.querySelector('.game-info-modal-close');
  const backdrop = modal.querySelector('.game-info-modal-backdrop');

  // Modal content for each game
  const info = {
    circle: {
      title: 'Circle Reaction Game',
      instructions: 'Click the circle as quickly as possible when it appears. Try to get the lowest average reaction time over 5 rounds.',
      scoring: 'Your score is the average time (in seconds) it takes you to click the circle. Lower is better!',
      tips: 'Stay focused and keep your mouse ready!'
    },
    clicker: {
      title: 'Speed Clicker',
      instructions: 'Click the button as many times as you can in 10 seconds.',
      scoring: 'Your score is the total number of clicks. Higher is better!',
      tips: 'Use multiple fingers or hands for maximum speed!'
    },
    memory: {
      title: 'Memory Card Match',
      instructions: 'Flip cards to find matching pairs. Match all pairs as quickly as possible.',
      scoring: 'Your score is the time taken to match all pairs. Lower is better!',
      tips: 'Try to remember the position of each card you flip.'
    },
    guess: {
      title: 'Guess the Number',
      instructions: 'Guess a number between 1 and 100. The game will tell you if your guess is too high or too low.',
      scoring: 'Your score is higher if you guess the number in fewer attempts.',
      tips: 'Use the feedback to narrow down your guesses!'
    },
    whack: {
      title: 'Find Totoro!',
      instructions: 'Click on Totoro as soon as he appears in one of the holes. Try to score as many points as possible!',
      scoring: 'Your score increases by 1 for each Totoro you click. Higher is better!',
      tips: 'Keep your eyes on all holes and react quickly!'
    }
  };

  const game = info[gameType];
  if (!game) return;

  body.innerHTML = `
    <h2>${game.title}</h2>
    <div class="game-info-section">
      <h3>Instructions</h3>
      <p>${game.instructions}</p>
    </div>
    <div class="game-info-section">
      <h3>Scoring</h3>
      <p>${game.scoring}</p>
    </div>
    <div class="game-info-section">
      <h3>Tips</h3>
      <p>${game.tips}</p>
    </div>
  `;
  modal.classList.add('active');
  setTimeout(() => modal.classList.add('show'), 10);

  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => modal.classList.remove('active'), 200);
    document.removeEventListener('keydown', escListener);
  }
  function escListener(e) {
    if (e.key === 'Escape') closeModal();
  }
  closeBtn.onclick = closeModal;
  backdrop.onclick = closeModal;
  document.addEventListener('keydown', escListener);
}

function gameInfoIcon(gameType) {
  return `<span class="game-info-icon" title="Game Info" tabindex="0" role="button" aria-label="Show instructions" data-game-info="${gameType}">❓</span>`;
}

// Add event delegation for game info icons
window.addEventListener('click', function(e) {
  const icon = e.target.closest('.game-info-icon');
  if (icon && icon.dataset.gameInfo) {
    showGameInfoModal(icon.dataset.gameInfo);
  }
});
window.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const active = document.activeElement;
    if (active && active.classList.contains('game-info-icon')) {
      showGameInfoModal(active.dataset.gameInfo);
    }
  }
});
