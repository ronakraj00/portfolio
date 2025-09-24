class ProjectsSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.icons = [];
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;
    this.time = 0;
    this.running = false;
    this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.colors = this.computeColors();
    this._onResize = null;
    this._onMouseMove = null;
    this._themeObserver = null;
    this._onVisibility = null;
    this.labels = [];
    this.sparks = [];
    this.lastLabelSpawn = 0;
    this.labelSpawnInterval = 700; // ms

    // Tech icons and symbols
    this.techSymbols = [
      "⚛️",
      "🔧",
      "⚡",
      "🚀",
      "💻",
      "🌐",
      "📱",
      "🔒",
      "📊",
      "🎯",
      "⚙️",
      "🔗",
    ];
    this.techWords = [
      "React",
      "Node",
      "JS",
      "API",
      "Git",
      "CSS",
      "HTML",
      "DB",
      "Cloud",
      "DevOps",
    ];
    this.techWordsExtended = [
      "TypeScript",
      "Express",
      "MongoDB",
      "SQL",
      "NoSQL",
      "GraphQL",
      "Docker",
      "Kubernetes",
      "Next.js",
      "Vite",
      "Tailwind",
      "REST",
      "JWT",
      "OAuth",
      "CI/CD",
      "Linux",
      "Nginx",
      "Redis",
      "WebSocket",
      "Async/Await",
      "Babel",
      "Webpack",
      "ESLint",
      "Prettier",
      "Jest",
      "Cypress",
      "Vercel",
      "Render",
      "Netlify",
      "OpenAPI",
    ];

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.createIcons();
    this.play();
    this.addEventListeners();
  }

  getCssVar(name, fallback) {
    const v = getComputedStyle(document.body).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  withAlpha(color, a) {
    if (color.startsWith("rgb")) return color;
    let h = color.replace("#", "");
    if (h.length === 3)
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  computeColors() {
    const accent = this.getCssVar("--accent", "#6c63ff");
    const text = this.getCssVar("--text-primary", "#ffffff");
    const secondary = this.getCssVar("--text-secondary", "#bdbdbd");
    const border = this.getCssVar("--border", "#333333");
    const background = this.getCssVar("--background", "#0a0a0a");
    return {
      particlePalette: [
        accent,
        "#61dafb",
        "#f7df1e",
        "#e34f26",
        "#1572b6",
        "#339933",
        "#f05032",
        "#3776ab",
        "#ed8b00",
        "#06b6d4",
        "#4db33d",
      ],
      connection: this.withAlpha(secondary || text, 0.12),
      word: this.withAlpha(secondary || text, 0.35),
      trail: this.withAlpha(background, 0.04),
    };
  }

  resize() {
    const w = this.canvas.offsetWidth;
    const h = this.canvas.offsetHeight;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.dpr = dpr;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.createParticles();
    this.createIcons();
  }

  createParticles() {
    this.particles = [];
    const cssW = this.canvas.width / this.dpr;
    const cssH = this.canvas.height / this.dpr;
    const area = cssW * cssH;
    const particleCount = Math.max(25, Math.min(160, Math.floor(area / 22000)));

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * cssW,
        y: Math.random() * cssH,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomTechColor(),
      });
    }
  }

  createIcons() {
    this.icons = [];
    const cssW = this.canvas.width / this.dpr;
    const iconCount = Math.max(3, Math.floor(cssW / 220));

    for (let i = 0; i < iconCount; i++) {
      this.icons.push({
        x: Math.random() * (this.canvas.width / this.dpr),
        y: Math.random() * (this.canvas.height / this.dpr),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        symbol:
          this.techSymbols[Math.floor(Math.random() * this.techSymbols.length)],
        size: Math.random() * 20 + 15,
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
  }

  getRandomTechColor() {
    const palette = this.colors.particlePalette;
    return palette[Math.floor(Math.random() * palette.length)];
  }

  addEventListeners() {
    let resizeScheduled = false;
    this._onResize = () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(() => {
        resizeScheduled = false;
        this.resize();
      });
    };
    window.addEventListener("resize", this._onResize);

    this._onMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };
    this.canvas.addEventListener("mousemove", this._onMouseMove);

    const observer = new MutationObserver(() => {
      this.colors = this.computeColors();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    this._themeObserver = observer;

    this._onVisibility = () => {
      if (document.hidden) this.stop();
      else this.play();
    };
    document.addEventListener("visibilitychange", this._onVisibility);
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off walls
      if (particle.x <= 0 || particle.x >= this.canvas.width / this.dpr) {
        particle.vx *= -1;
      }
      if (particle.y <= 0 || particle.y >= this.canvas.height / this.dpr) {
        particle.vy *= -1;
      }

      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

      // Add some randomness
      if (Math.random() > 0.99) {
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;
      }
    });
  }

  updateIcons() {
    this.icons.forEach((icon) => {
      // Update position
      icon.x += icon.vx;
      icon.y += icon.vy;
      icon.rotation += icon.rotationSpeed;

      // Bounce off walls
      if (icon.x <= 0 || icon.x >= this.canvas.width / this.dpr) {
        icon.vx *= -1;
      }
      if (icon.y <= 0 || icon.y >= this.canvas.height / this.dpr) {
        icon.vy *= -1;
      }

      // Keep icons in bounds
      icon.x = Math.max(0, Math.min(this.canvas.width, icon.x));
      icon.y = Math.max(0, Math.min(this.canvas.height, icon.y));
    });
  }

  drawConnections() {
    // Draw connections between nearby particles
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const opacity = ((100 - distance) / 100) * 1.0;
          const base = this.colors.connection;
          this.ctx.strokeStyle = base.replace(
            /rgba\(([^)]+), [^)]+\)/,
            (m, g) => `rgba(${g}, ${0.08 * opacity})`
          );
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  draw() {
    const cssW = this.canvas.width / this.dpr;
    const cssH = this.canvas.height / this.dpr;
    this.ctx.clearRect(0, 0, cssW, cssH);
    this.ctx.fillStyle = this.colors.trail;
    this.ctx.fillRect(0, 0, cssW, cssH);

    // Draw connections
    this.drawConnections();

    // Draw particles
    this.particles.forEach((particle) => {
      this.ctx.fillStyle = `${particle.color}${Math.floor(
        particle.opacity * 255
      )
        .toString(16)
        .padStart(2, "0")}`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Add glow effect near mouse
      const dx = particle.x - this.mouse.x;
      const dy = particle.y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });

    // Draw icons
    this.icons.forEach((icon) => {
      this.ctx.save();
      this.ctx.globalAlpha = icon.opacity;
      this.ctx.translate(icon.x, icon.y);
      this.ctx.rotate(icon.rotation);
      this.ctx.font = `${icon.size}px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(icon.symbol, 0, 0);
      this.ctx.restore();
    });

    // Draw floating tech words occasionally
    if (Math.random() > 0.995) {
      // fallback single word if labels are not active (should rarely execute as labels handle words)
      const word =
        this.techWords[Math.floor(Math.random() * this.techWords.length)];
      const x = Math.random() * cssW;
      const y = Math.random() * cssH;
      this.ctx.fillStyle = this.colors.word;
      this.ctx.font =
        "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      this.ctx.textAlign = "center";
      this.ctx.fillText(word, x, y);
    }

    this.updateAndDrawLabels();
    this.updateAndDrawSparks();
  }

  animate() {
    this.time += 0.016; // Assuming 60fps
    this.updateParticles();
    this.updateIcons();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  play() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    if (this._onResize) window.removeEventListener("resize", this._onResize);
    if (this._onMouseMove)
      this.canvas.removeEventListener("mousemove", this._onMouseMove);
    if (this._onVisibility)
      document.removeEventListener("visibilitychange", this._onVisibility);
    if (this._themeObserver) this._themeObserver.disconnect();
    this.canvas.remove();
  }
}

ProjectsSimulation.prototype.spawnLabel = function () {
  const cssW = this.canvas.width / this.dpr;
  const cssH = this.canvas.height / this.dpr;
  const fromExtended = Math.random() < 0.7;
  const word = fromExtended
    ? this.techWordsExtended[
        Math.floor(Math.random() * this.techWordsExtended.length)
      ]
    : this.techWords[Math.floor(Math.random() * this.techWords.length)];
  const x = Math.random() * (cssW * 0.9) + cssW * 0.05;
  const y = Math.random() * (cssH * 0.7) + cssH * 0.15;
  const vx = (Math.random() - 0.5) * 0.2;
  const vy = -0.2 - Math.random() * 0.2;
  const life = 1000 + Math.random() * 1400; // ms
  const fontSize = 7 + Math.random() * 5;
  const padX = 8,
    padY = 5;
  this.labels.push({
    word,
    x,
    y,
    vx,
    vy,
    t: 0,
    life,
    alpha: 0,
    fontSize,
    padX,
    padY,
  });
};

ProjectsSimulation.prototype.roundRect = function (ctx, x, y, w, h, r) {
  const rr = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
};

ProjectsSimulation.prototype.updateAndDrawLabels = function () {
  const now = performance.now();
  if (now - this.lastLabelSpawn > this.labelSpawnInterval) {
    // Spawn 1-2 labels to increase density
    this.spawnLabel();
    if (Math.random() < 0.4) this.spawnLabel();
    this.lastLabelSpawn = now;
  }

  const ctx = this.ctx;
  ctx.save();
  for (let i = this.labels.length - 1; i >= 0; i--) {
    const l = this.labels[i];
    l.t += 16; // approx per frame
    const progress = l.t / l.life;
    if (progress >= 1) {
      this.labels.splice(i, 1);
      continue;
    }

    if (progress < 0.15) l.alpha = progress / 0.15;
    else if (progress > 0.8) l.alpha = Math.max(0, (1 - progress) / 0.2);
    else l.alpha = 1;

    l.x += l.vx;
    l.y += l.vy;

    const text = l.word;
    ctx.font = `${l.fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    const metrics = ctx.measureText(text);
    const w = Math.ceil(metrics.width) + l.padX * 2;
    const h = Math.ceil(l.fontSize * 1.6);
    const x = l.x - w / 2;
    const y = l.y - h / 2;

    ctx.globalAlpha = l.alpha * 0.95;
    ctx.fillStyle = this.withAlpha(this.getCssVar("--accent", "#6c63ff"), 0.14);
    this.roundRect(ctx, x, y, w, h, h / 2);
    ctx.fill();

    ctx.globalAlpha = l.alpha;
    ctx.fillStyle = this.getCssVar("--text-primary", "#ffffff");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, l.x, l.y + 1);
  }
  ctx.restore();
};

ProjectsSimulation.prototype.updateAndDrawSparks = function () {
  // spawn
  if (Math.random() < 0.03 && this.sparks.length < 60) {
    const cssW = this.canvas.width / this.dpr;
    const cssH = this.canvas.height / this.dpr;
    const x = Math.random() * cssW;
    const y = Math.random() * cssH;
    const ang = Math.random() * Math.PI * 2;
    const speed = 0.6 + Math.random() * 0.8;
    const vx = Math.cos(ang) * speed;
    const vy = Math.sin(ang) * speed;
    const life = 600 + Math.random() * 600;
    const len = 6 + Math.random() * 10;
    this.sparks.push({ x, y, vx, vy, t: 0, life, len });
  }

  const ctx = this.ctx;
  const accent = this.getCssVar("--accent", "#6c63ff");
  for (let i = this.sparks.length - 1; i >= 0; i--) {
    const s = this.sparks[i];
    s.t += 16;
    const p = s.t / s.life;
    if (p >= 1) {
      this.sparks.splice(i, 1);
      continue;
    }
    s.x += s.vx;
    s.y += s.vy;
    const alpha = (1 - p) * 0.6;
    ctx.strokeStyle = this.withAlpha(accent, alpha);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * s.len, s.y - s.vy * s.len);
    ctx.stroke();
  }
};

// Initialize projects simulation when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  let projectsSimulation = null;
  const projectsSection = document.querySelector(".codecompanywise-section");
  const projectsContent = document.getElementById("codeCompanyWiseContent");

  function createProjectsSimulation(section) {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";

    if (section) {
      section.style.position = "relative";
      section.style.overflow = "hidden";
      section.insertBefore(canvas, section.firstChild);

      // Move all content above the canvas
      if (projectsContent) {
        projectsContent.style.position = "relative";
        projectsContent.style.zIndex = "1";
      }

      return new ProjectsSimulation(canvas);
    }
    return null;
  }

  function handleToggle(content, simulation, section) {
    if (content.classList.contains("hof-content-collapsed")) {
      // Section is collapsed, create new simulation
      if (!simulation) {
        return createProjectsSimulation(section);
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
  if (
    projectsContent &&
    projectsContent.classList.contains("hof-content-collapsed")
  ) {
    projectsSimulation = createProjectsSimulation(projectsSection);
  }

  // Add observer to watch for class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        projectsSimulation = handleToggle(
          projectsContent,
          projectsSimulation,
          projectsSection
        );
      }
    });
  });

  if (projectsContent) {
    observer.observe(projectsContent, { attributes: true });
  }
});
