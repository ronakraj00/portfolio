class NewsletterSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.animationFrameId = null;
    this.colors = this.computeColors();
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.init();
  }

  computeColors() {
    const styles = getComputedStyle(document.body);
    const accent = styles.getPropertyValue("--accent").trim() || "#6c63ff";
    const text = styles.getPropertyValue("--text-primary").trim() || "#ffffff";
    const secondary =
      styles.getPropertyValue("--text-secondary").trim() || "#bdbdbd";
    return [accent, text, secondary, this.withAlpha(accent, 0.7)];
  }

  withAlpha(hex, alpha) {
    // Accept rgb/rgba or hex; for hex, convert to rgba
    if (hex.startsWith("rgb")) return hex;
    let h = hex.replace("#", "");
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  init() {
    this.resize();
    this.createParticles();
    window.addEventListener("resize", this.resize);
    this.animate();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    const count = Math.max(
      40,
      Math.floor((this.canvas.width * this.canvas.height) / 25000)
    );
    this.particles = new Array(count).fill(0).map(() => this.makeParticle());
  }

  makeParticle() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const size = Math.random() * 6 + 3; // 3 - 9px
    const speed = 0.3 + Math.random() * 0.7; // 0.3 - 1.0
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      size,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (0.5 + Math.random()) * speed * 0.6, // gentle downward drift
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      shape: Math.random() < 0.5 ? "rect" : "triangle",
    };
  }

  drawParticle(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    if (p.shape === "rect") {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -p.size / 2);
      ctx.lineTo(-p.size / 2, p.size / 2);
      ctx.lineTo(p.size / 2, p.size / 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  updateParticle(p) {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;
    const w = this.canvas.width;
    const h = this.canvas.height;
    // Wrap around edges for continuous flow
    if (p.y > h + 10) {
      p.y = -10;
      p.x = Math.random() * w;
    }
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
  }

  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.particles.length === 0) this.createParticles();
    for (const p of this.particles) {
      this.updateParticle(p);
      this.drawParticle(p);
    }
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy() {
    this.stop();
    this.canvas.remove();
  }
}

// Initialize newsletter simulation (attached to the Newsletter section only)
document.addEventListener("DOMContentLoaded", () => {
  let newsletterSim = null;
  const section = document.getElementById("hallOfFameSection");
  const content = document.getElementById("hallOfFameContent");

  function createNewsletterSimulation(targetSection, contentEl) {
    if (!targetSection) return null;
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";
    targetSection.style.position = "relative";
    targetSection.style.overflow = "hidden";
    targetSection.insertBefore(canvas, targetSection.firstChild);
    if (contentEl) {
      contentEl.style.position = "relative";
      contentEl.style.zIndex = "1";
    }
    return new NewsletterSimulation(canvas);
  }

  function handleToggle(contentEl, sim, targetSection) {
    if (!contentEl) return sim;
    if (contentEl.classList.contains("hof-content-collapsed")) {
      // Collapsed: show background simulation
      if (!sim) return createNewsletterSimulation(targetSection, contentEl);
    } else {
      // Expanded: remove simulation
      if (sim) {
        sim.destroy();
        return null;
      }
    }
    return sim;
  }

  // Attach only to the first section with this ID (the newsletter at top)
  if (
    section &&
    content &&
    content.classList.contains("hof-content-collapsed")
  ) {
    newsletterSim = createNewsletterSimulation(section, content);
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === "class") {
        newsletterSim = handleToggle(content, newsletterSim, section);
      }
    }
  });
  if (content) observer.observe(content, { attributes: true });
});
