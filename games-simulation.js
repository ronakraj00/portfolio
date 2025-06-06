class GamesSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.drops = [];
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;

    // Matrix characters
    this.chars = '🎮🎲🎯🎨🎭🎪🎫🎬🎭🎪🎨🎯🎲🎮';
    this.fontSize = 14;
    this.columns = 0;

    this.init();
  }

  init() {
    this.resize();
    this.createDrops();
    this.animate();
    this.addEventListeners();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.createDrops();
  }

  createDrops() {
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -this.canvas.height);
    }
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  updateDrops() {
    for (let i = 0; i < this.drops.length; i++) {
      // Randomly change drop speed
      if (Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      // Move drop down
      this.drops[i]++;
      
      // Reset drop if it goes off screen
      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
    }
  }

  draw() {
    // Set semi-transparent black background to create trail effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Set text properties
    this.ctx.fillStyle = '#0F0';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    // Draw matrix rain
    for (let i = 0; i < this.drops.length; i++) {
      // Get random character
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      
      // Calculate position
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;
      
      // Draw character
      this.ctx.fillText(char, x, y);
      
      // Add glow effect for characters near mouse
      const dx = x - this.mouse.x;
      const dy = y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        this.ctx.shadowColor = '#0F0';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText(char, x, y);
        this.ctx.shadowBlur = 0;
      }
    }
  }

  animate() {
    this.updateDrops();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.canvas.remove();
  }
}

// Initialize games simulation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  let gamesSimulation = null;
  const gamesSection = document.getElementById('gamesSection');
  const gamesContent = document.getElementById('gamesContent');

  function createGamesSimulation(section) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    
    if (section) {
      section.style.position = 'relative';
      section.style.overflow = 'hidden';
      section.insertBefore(canvas, section.firstChild);
      
      // Move all content above the canvas
      if (gamesContent) {
        gamesContent.style.position = 'relative';
        gamesContent.style.zIndex = '1';
      }
      
      return new GamesSimulation(canvas);
    }
    return null;
  }

  function handleToggle(content, simulation, section) {
    if (content.classList.contains('games-content-collapsed')) {
      // Section is collapsed, create new simulation
      if (!simulation) {
        return createGamesSimulation(section);
      }
    } else {
      // Section is expanded, destroy the simulation
      if (simulation) {
        simulation.destroy();
        return null;
      }
    }
    return simulation;
  }

  // Initial setup
  if (gamesContent && gamesContent.classList.contains('games-content-collapsed')) {
    gamesSimulation = createGamesSimulation(gamesSection);
  }

  // Add observer to watch for class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        gamesSimulation = handleToggle(gamesContent, gamesSimulation, gamesSection);
      }
    });
  });

  if (gamesContent) {
    observer.observe(gamesContent, { attributes: true });
  }
}); 