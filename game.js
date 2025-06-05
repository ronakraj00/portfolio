let gameActive = false;

// Utility for delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function startGame(gameType) {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";
  clearAllTimers();
  gameActive = true;

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
    <h3 class="game_rule">Click as many times as you can</h3>
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
    <h3 class="game_rule">Match all the pairs!</h3>
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
    <h3 class="game_rule">Guess the Number (1-100)</h3>
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
      saveScore("guess", 100 - attempts + 1); // Higher score for fewer attempts
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
  container.innerHTML = `
    <h3 class="game_rule">Find Totoro!</h3>
    <p class="score">Score: <span id="whackScore">0</span></p>
    <div id="whackGrid"></div>
  `;

  const grid = container.querySelector("#whackGrid");
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement("div");
    hole.dataset.index = i;
    const mole = document.createElement("img"); // Create img element for mole
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
      if (score >= 20) {
        gameActive = false;
        saveScore("whack", score);
      }
    };
    window.whackTimeout = setTimeout(showMole, Math.random() * 400 + 300);
  }

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

async function saveScore(game, score) {
  let name = localStorage.getItem("userName");
  if (!name) {
    name = await getUserName();
    localStorage.setItem("userName", name);
  }
  fetch("https://portfolio-api-dwyy.onrender.com/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game, name, score }),
  }).then(() => {
    updateHallOfFame(game);
  });
}

// ====== Hall of Fame Update Logic ======
function updateHallOfFame(game) {
  const ul = document.getElementById(`hof-list-${game}`);
  if (!ul) return;
  // Find the closest ancestor section that wraps the Hall of Fame, including the title
  const hofSection = ul.closest(".hall-of-fame-section");
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
    })
    .catch(() => {
      // Hide the entire Hall of Fame section (including title) if fetch fails
      if (hofSection) hofSection.style.display = "none";
    });
}

// ====== On page load, update all Hall of Fame lists ======
window.addEventListener("DOMContentLoaded", () => {
  ["memory", "whack", "circle", "clicker", "guess"].forEach(updateHallOfFame);
});
