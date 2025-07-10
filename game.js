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
  } else if (gameType === "sudoku") {
    startSudokuGame(gameArea);
  } else if (gameType === "rps") {
    startRPSGame(gameArea);
  } else if (gameType === "tictactoe") {
    startTicTacToeGame(gameArea);
  } else if (gameType === "2048") {
    start2048Game(gameArea);
  } else if (gameType === "wordle") {
    startWordleGame(gameArea);
  } else if (gameType === "simon") {
    startSimonGame(gameArea);
  }
}

function clearAllTimers() {
  clearTimeout(window.circleTimeout);
  clearInterval(window.clickerInterval);
  clearTimeout(window.whackTimeout);
  clearInterval(window.whackInterval);
  if (window.whackTimer) {
    clearInterval(window.whackTimer);
    window.whackTimer = null;
  }
  if (window.conwayAnimationFrameId) {
    cancelAnimationFrame(window.conwayAnimationFrameId);
    window.conwayAnimationFrameId = null;
  }
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
    <h3 class="game_rule">Guess the Number (1-100)${gameInfoIcon('guess')}</h3>
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
  window.whackTimer = null;
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
    if (window.whackTimer) clearInterval(window.whackTimer);
    saveScore("whack", score);
    const message = document.createElement("p");
    message.textContent = `Game Over! Your score: ${score}`;
    container.appendChild(message);
  }

  // Start the timer
  window.whackTimer = setInterval(() => {
    timeLeft--;
    whackTime.textContent = timeLeft;
    if (timeLeft <= 0) {
      endWhackGame();
    }
  }, 1000);

  showMole();
}

/* ================= Sudoku Solver Game ================= */

function startSudokuGame(container) {
  container.innerHTML = `
    <h3 class="game_rule">Sudoku Solver ${gameInfoIcon('sudoku')}</h3>
    <div id="sudokuGrid"></div>
    <button id="checkSudokuBtn">Check</button>
    <button id="resetSudokuBtn">Reset</button>
    <p id="sudokuMessage"></p>
  `;

  const grid = container.querySelector("#sudokuGrid");
  const checkBtn = container.querySelector("#checkSudokuBtn");
  const resetBtn = container.querySelector("#resetSudokuBtn");
  const message = container.querySelector("#sudokuMessage");

  // Generate a simple puzzle (0 = empty)
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  let userGrid = puzzle.map(row => row.slice());

  function renderGrid() {
    grid.innerHTML = '';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(9, 32px)';
    grid.style.gridGap = '2px';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('input');
        cell.type = 'text';
        cell.maxLength = 1;
        cell.value = userGrid[r][c] ? userGrid[r][c] : '';
        cell.style.width = '32px';
        cell.style.height = '32px';
        cell.style.textAlign = 'center';
        cell.style.fontSize = '1.1rem';
        cell.style.border = '1.5px solid var(--border, #aaa)';
        cell.style.background = puzzle[r][c] ? 'var(--bg-secondary, #eee)' : 'var(--bg-primary, #fff)';
        cell.disabled = !!puzzle[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('input', (e) => {
          const val = e.target.value.replace(/[^1-9]/g, '');
          e.target.value = val;
          userGrid[r][c] = val ? parseInt(val) : 0;
        });
        grid.appendChild(cell);
      }
    }
  }

  function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num && x !== col) return false;
      if (board[x][col] === num && x !== row) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if (board[r][c] === num && (r !== row || c !== col)) return false;
      }
    }
    return true;
  }

  function isSudokuComplete(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const num = board[r][c];
        if (!num || !isValid(board, r, c, num)) {
          return false;
        }
      }
    }
    return true;
  }

  checkBtn.onclick = () => {
    if (isSudokuComplete(userGrid)) {
      message.textContent = '🎉 Correct! Sudoku is solved!';
    } else {
      message.textContent = '❌ Not solved or incorrect. Please check your solution.';
    }
  };

  resetBtn.onclick = () => {
    userGrid = puzzle.map(row => row.slice());
    renderGrid();
    message.textContent = '';
  };

  renderGrid();
}

/* ================= Rock, Paper, Scissors ================= */
function startRPSGame(container) {
  const choices = ["Rock", "Paper", "Scissors"];
  let userScore = 0, compScore = 0;
  container.innerHTML = `
    <h3 class="game_rule">Rock, Paper, Scissors! ${gameInfoIcon('rps')}</h3>
    <div id="rpsChoices">
      <button data-choice="Rock">🪨 Rock</button>
      <button data-choice="Paper">📄 Paper</button>
      <button data-choice="Scissors">✂️ Scissors</button>
    </div>
    <p id="rpsResult"></p>
    <p class="score">You: <span id="rpsUserScore">0</span> | Computer: <span id="rpsCompScore">0</span></p>
  `;
  const result = container.querySelector('#rpsResult');
  const userScoreSpan = container.querySelector('#rpsUserScore');
  const compScoreSpan = container.querySelector('#rpsCompScore');
  container.querySelectorAll('#rpsChoices button').forEach(btn => {
    btn.onclick = () => {
      if (!gameActive) return;
      const user = btn.dataset.choice;
      const comp = choices[Math.floor(Math.random() * 3)];
      let msg = `You chose ${user}, Computer chose ${comp}. `;
      if (user === comp) {
        msg += "It's a tie!";
      } else if (
        (user === "Rock" && comp === "Scissors") ||
        (user === "Paper" && comp === "Rock") ||
        (user === "Scissors" && comp === "Paper")
      ) {
        msg += "You win!";
        userScore++;
      } else {
        msg += "Computer wins!";
        compScore++;
      }
      userScoreSpan.textContent = userScore;
      compScoreSpan.textContent = compScore;
      result.textContent = msg;
      if (userScore === 5 || compScore === 5) {
        gameActive = false;
        result.textContent += userScore === 5 ? " 🎉 You won the match!" : " 😢 Computer won the match!";
        saveScore("rps", userScore === 5 ? 1 : 0); // 1 for win, 0 for loss
      }
    };
  });
}

/* ================= Tic-Tac-Toe ================= */
function startTicTacToeGame(container) {
  let board = Array(9).fill("");
  let current = "X";
  let gameOver = false;
  container.innerHTML = `
    <h3 class="game_rule">Tic-Tac-Toe ${gameInfoIcon('tictactoe')}</h3>
    <div id="tttBoard" style="display:grid;grid-template-columns:repeat(3,48px);gap:4px;margin:12px 0;"></div>
    <p id="tttMsg"></p>
  `;
  const tttBoard = container.querySelector('#tttBoard');
  const tttMsg = container.querySelector('#tttMsg');
  function render() {
    tttBoard.innerHTML = '';
    board.forEach((cell, i) => {
      const btn = document.createElement('button');
      btn.textContent = cell;
      btn.style.height = btn.style.width = '48px';
      btn.style.fontSize = '1.5rem';
      btn.disabled = !!cell || gameOver;
      btn.onclick = () => move(i);
      tttBoard.appendChild(btn);
    });
  }
  function move(i) {
    if (board[i] || gameOver) return;
    board[i] = current;
    if (checkWin(current)) {
      tttMsg.textContent = `${current} wins!`;
      gameOver = true;
      saveScore("tictactoe", current === "X" ? 1 : 0);
    } else if (board.every(Boolean)) {
      tttMsg.textContent = "It's a tie!";
      gameOver = true;
      saveScore("tictactoe", 0.5);
    } else {
      current = current === "X" ? "O" : "X";
      if (current === "O") aiMove();
    }
    render();
  }
  function aiMove() {
    // Simple AI: pick random empty
    const empty = board.map((v, i) => v ? null : i).filter(v => v !== null);
    if (empty.length) move(empty[Math.floor(Math.random() * empty.length)]);
  }
  function checkWin(p) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.some(line => line.every(i => board[i] === p));
  }
  render();
}

/* ================= 2048 ================= */
function start2048Game(container) {
  const size = 4;
  let board = Array(size).fill().map(() => Array(size).fill(0));
  let score = 0;
  container.innerHTML = `
    <h3 class="game_rule">2048 ${gameInfoIcon('2048')}</h3>
    <div id="g2048Board" style="display:grid;grid-template-columns:repeat(4,48px);gap:4px;margin:12px 0;"></div>
    <p id="g2048Score">Score: 0</p>
    <p id="g2048Msg"></p>
  `;
  const g2048Board = container.querySelector('#g2048Board');
  const g2048Score = container.querySelector('#g2048Score');
  const g2048Msg = container.querySelector('#g2048Msg');
  function addTile() {
    const empty = [];
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!board[r][c]) empty.push([r, c]);
    if (empty.length) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }
  function render() {
    g2048Board.innerHTML = '';
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.textContent = board[r][c] ? board[r][c] : '';
      cell.style.height = cell.style.width = '48px';
      cell.style.fontSize = '1.2rem';
      cell.style.background = board[r][c] ? '#f0e5d6' : '#eee';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.borderRadius = '6px';
      g2048Board.appendChild(cell);
    }
    g2048Score.textContent = `Score: ${score}`;
  }
  function move(dir) {
    let moved = false;
    function slide(row) {
      let arr = row.filter(x => x);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          score += arr[i];
          arr[i + 1] = 0;
        }
      }
      arr = arr.filter(x => x);
      while (arr.length < size) arr.push(0);
      return arr;
    }
    if (dir === 'left') {
      for (let r = 0; r < size; r++) {
        const old = board[r].slice();
        board[r] = slide(board[r]);
        if (board[r].join() !== old.join()) moved = true;
      }
    } else if (dir === 'right') {
      for (let r = 0; r < size; r++) {
        const old = board[r].slice();
        board[r] = slide(board[r].slice().reverse()).reverse();
        if (board[r].join() !== old.join()) moved = true;
      }
    } else if (dir === 'up') {
      for (let c = 0; c < size; c++) {
        const col = board.map(row => row[c]);
        const newCol = slide(col);
        for (let r = 0; r < size; r++) {
          if (board[r][c] !== newCol[r]) moved = true;
          board[r][c] = newCol[r];
        }
      }
    } else if (dir === 'down') {
      for (let c = 0; c < size; c++) {
        const col = board.map(row => row[c]);
        const newCol = slide(col.reverse()).reverse();
        for (let r = 0; r < size; r++) {
          if (board[r][c] !== newCol[r]) moved = true;
          board[r][c] = newCol[r];
        }
      }
    }
    if (moved) addTile();
    render();
    if (board.flat().includes(2048)) {
      g2048Msg.textContent = '🎉 You made 2048!';
      gameActive = false;
      saveScore("2048", score);
    } else if (!board.flat().includes(0) && !canMove()) {
      g2048Msg.textContent = 'Game Over!';
      gameActive = false;
      saveScore("2048", score);
    }
  }
  function canMove() {
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      if (!board[r][c]) return true;
      if (c < size - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < size - 1 && board[r][c] === board[r + 1][c]) return true;
    }
    return false;
  }
  addTile();
  addTile();
  render();
  window.addEventListener('keydown', onKey);
  function onKey(e) {
    if (!gameActive) return;
    if (['ArrowLeft','a','A'].includes(e.key)) move('left');
    if (['ArrowRight','d','D'].includes(e.key)) move('right');
    if (['ArrowUp','w','W'].includes(e.key)) move('up');
    if (['ArrowDown','s','S'].includes(e.key)) move('down');
  }
  // Clean up event on game end
  g2048Msg.addEventListener('DOMNodeRemoved', () => {
    window.removeEventListener('keydown', onKey);
  });
}

/* ================= Wordle Clone ================= */
function startWordleGame(container) {
  const words = ["apple","grape","peach","mango","lemon","berry","melon","plums","olive","guava"];
  const answer = words[Math.floor(Math.random() * words.length)].toUpperCase();
  let attempts = 0;
  let maxAttempts = 6;
  let guesses = [];
  container.innerHTML = `
    <h3 class="game_rule">Wordle Clone ${gameInfoIcon('wordle')}</h3>
    <div id="wordleGrid"></div>
    <input id="wordleInput" maxlength="5" style="text-transform:uppercase;width:120px;" placeholder="5-letter word" />
    <button id="wordleBtn">Guess</button>
    <p id="wordleMsg"></p>
  `;
  const grid = container.querySelector('#wordleGrid');
  const input = container.querySelector('#wordleInput');
  const btn = container.querySelector('#wordleBtn');
  const msg = container.querySelector('#wordleMsg');
  function render() {
    grid.innerHTML = '';
    guesses.forEach(g => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      for (let i = 0; i < 5; i++) {
        const cell = document.createElement('div');
        cell.textContent = g.word[i];
        cell.style.width = cell.style.height = '32px';
        cell.style.margin = '2px';
        cell.style.textAlign = 'center';
        cell.style.fontWeight = 'bold';
        cell.style.fontSize = '1.1rem';
        if (g.colors[i] === 'g') cell.style.background = '#6aaa64';
        else if (g.colors[i] === 'y') cell.style.background = '#c9b458';
        else cell.style.background = '#787c7e';
        cell.style.color = '#fff';
        row.appendChild(cell);
      }
      grid.appendChild(row);
    });
  }
  btn.onclick = () => {
    if (!gameActive) return;
    const guess = input.value.toUpperCase();
    if (guess.length !== 5 || !/^[A-Z]{5}$/.test(guess)) {
      msg.textContent = 'Enter a valid 5-letter word!';
      return;
    }
    attempts++;
    let colors = Array(5).fill('b');
    for (let i = 0; i < 5; i++) {
      if (guess[i] === answer[i]) colors[i] = 'g';
      else if (answer.includes(guess[i])) colors[i] = 'y';
    }
    guesses.push({word: guess, colors});
    render();
    if (guess === answer) {
      msg.textContent = `🎉 Correct! You guessed it in ${attempts} tries!`;
      gameActive = false;
      saveScore("wordle", attempts);
    } else if (attempts >= maxAttempts) {
      msg.textContent = `Game Over! The word was ${answer}`;
      gameActive = false;
      saveScore("wordle", 0);
    } else {
      msg.textContent = '';
    }
    input.value = '';
    input.focus();
  };
}

/* ================= Simon Says ================= */
function startSimonGame(container) {
  const colors = ["red","green","blue","yellow"];
  let sequence = [];
  let userStep = 0;
  let round = 0;
  let strict = false;
  container.innerHTML = `
    <h3 class="game_rule">Simon Says ${gameInfoIcon('simon')}</h3>
    <div id="simonBoard" style="display:grid;grid-template-columns:repeat(2,64px);gap:8px;margin:12px 0;"></div>
    <button id="simonStartBtn">Start</button>
    <label><input type="checkbox" id="simonStrict"> Strict Mode</label>
    <p id="simonMsg"></p>
  `;
  const board = container.querySelector('#simonBoard');
  const startBtn = container.querySelector('#simonStartBtn');
  const strictBox = container.querySelector('#simonStrict');
  const msg = container.querySelector('#simonMsg');
  colors.forEach(color => {
    const btn = document.createElement('button');
    btn.style.background = color;
    btn.style.height = btn.style.width = '64px';
    btn.style.borderRadius = '12px';
    btn.style.opacity = '0.7';
    btn.style.fontSize = '1.2rem';
    btn.dataset.color = color;
    btn.onclick = () => userInput(color);
    board.appendChild(btn);
  });
  function playSequence() {
    let i = 0;
    msg.textContent = `Round ${round}`;
    function next() {
      if (i >= sequence.length) return;
      const color = sequence[i];
      const btn = [...board.children].find(b => b.dataset.color === color);
      btn.style.opacity = '1';
      setTimeout(() => {
        btn.style.opacity = '0.7';
        i++;
        setTimeout(next, 400);
      }, 400);
    }
    next();
  }
  function userInput(color) {
    if (!gameActive || !sequence.length) return;
    if (color === sequence[userStep]) {
      userStep++;
      if (userStep === sequence.length) {
        round++;
        msg.textContent = `Good! Next round: ${round+1}`;
        setTimeout(() => {
          nextRound();
        }, 800);
      }
    } else {
      msg.textContent = strict ? 'Wrong! Game Over.' : 'Wrong! Try again.';
      if (strict) {
        gameActive = false;
        saveScore("simon", round);
      } else {
        userStep = 0;
        setTimeout(playSequence, 1000);
      }
    }
  }
  function nextRound() {
    sequence.push(colors[Math.floor(Math.random() * 4)]);
    userStep = 0;
    playSequence();
  }
  startBtn.onclick = () => {
    sequence = [];
    userStep = 0;
    round = 0;
    strict = strictBox.checked;
    gameActive = true;
    nextRound();
  };
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
  window.conwayAnimationFrameId = null;
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
    window.conwayAnimationFrameId = requestAnimationFrame(animate);
  }

  // Initialize with random pattern
  randomizeGrid();
  drawGrid();
  drawCells();
  
  // Start animation
  window.conwayAnimationFrameId = requestAnimationFrame(animate);

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    drawGrid();
    drawCells();
  });

  // Cleanup function to stop animation when needed
  return () => {
    if (window.conwayAnimationFrameId) {
      cancelAnimationFrame(window.conwayAnimationFrameId);
      window.conwayAnimationFrameId = null;
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
    },
    sudoku: {
      title: 'Sudoku Solver',
      instructions: 'Fill in the empty cells so that each row, column, and 3x3 box contains the numbers 1 to 9. You can enter your own numbers or use the default puzzle. Click Solve to see the solution.',
      scoring: 'This is a solver, not a competitive game. Try to solve it yourself before using the solver!',
      tips: 'Use logic to eliminate possibilities. Try to fill in easy numbers first!'
    },
    rps: {
      title: 'Rock, Paper, Scissors',
      instructions: 'Choose Rock, Paper, or Scissors. First to 5 wins! Play against the computer.',
      scoring: 'Win a match by reaching 5 points first.',
      tips: 'Try to predict the computer’s next move!'
    },
    tictactoe: {
      title: 'Tic-Tac-Toe',
      instructions: 'Play as X against the computer (O). Get three in a row to win.',
      scoring: 'Win = 1, Tie = 0.5, Loss = 0.',
      tips: 'Block your opponent and look for winning moves!'
    },
    '2048': {
      title: '2048',
      instructions: 'Use arrow keys (or WASD) to slide tiles. Combine like numbers to reach 2048.',
      scoring: 'Your score increases as you combine tiles. Try to reach 2048!',
      tips: 'Keep your highest tiles in a corner for best results.'
    },
    wordle: {
      title: 'Wordle Clone',
      instructions: 'Guess the 5-letter word in 6 tries. Green = correct letter & position, Yellow = correct letter, wrong position, Gray = not in word.',
      scoring: 'Fewer guesses is better!',
      tips: 'Start with a word with common letters. Use feedback to narrow down.'
    },
    simon: {
      title: 'Simon Says',
      instructions: 'Repeat the color sequence. Each round adds a new color. Strict mode ends the game on a mistake.',
      scoring: 'Score = number of rounds completed.',
      tips: 'Focus and try to remember the sequence!'
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
