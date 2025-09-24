class StarsSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.stars = [];
    this.layers = 3;
    this.mouse = { x: 0, y: 0, nx: 0, ny: 0, radius: 140 };
    this.animationFrameId = null;
    this.running = false;
    this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this._onResize = null;
    this._onMouseMove = null;
    this._onVisibility = null;
    this._themeObserver = null;
    this.colors = this.computeColors();
    this.init();
  }

  init() {
    this.resize();
    this.createStars();
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
    const text = this.getCssVar("--text-primary", "#ffffff");
    const secondary = this.getCssVar("--text-secondary", "#bdbdbd");
    const background = this.getCssVar("--background", "#0a0a0a");
    const accent = this.getCssVar("--accent", "#6c63ff");
    return {
      core: text,
      glow: this.withAlpha(text, 0.9),
      trail: this.withAlpha(background, 0.05),
      twinkle: this.withAlpha(secondary || text, 0.6),
      accent,
    };
  }

  resize() {
    const section = this.canvas.parentElement;
    if (section) {
      const w = section.offsetWidth;
      const h = section.offsetHeight;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      this.dpr = dpr;
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.createStars();
    }
  }

  createStars() {
    this.stars = [];
    const cssW = this.canvas.width / this.dpr;
    const cssH = this.canvas.height / this.dpr;
    const area = cssW * cssH;
    const baseCount = Math.max(60, Math.min(400, Math.floor(area / 1500)));

    const layers = [
      { depth: 0.35, size: [0.5, 1.2], speed: 0.008, twinkle: [0.008, 0.016] },
      { depth: 0.65, size: [0.8, 1.6], speed: 0.015, twinkle: [0.006, 0.012] },
      { depth: 1.0, size: [1.0, 2.2], speed: 0.022, twinkle: [0.004, 0.01] },
    ];

    layers.forEach((layer) => {
      const count = Math.floor(baseCount * (0.45 + layer.depth * 0.3));
      for (let i = 0; i < count; i++) {
        const size =
          layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]);
        const speed = (Math.random() * 2 - 1) * layer.speed; // both axes
        const brightness = 0.25 + Math.random() * 0.55;
        const twinkleSpeed =
          layer.twinkle[0] +
          Math.random() * (layer.twinkle[1] - layer.twinkle[0]);
        this.stars.push({
          x: Math.random() * cssW,
          y: Math.random() * cssH,
          size,
          depth: layer.depth,
          speedX: speed,
          speedY: speed,
          brightness,
          twinkleSpeed,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
          baseBrightness: brightness,
        });
      }
    });
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
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      this.mouse.nx = (this.mouse.x - cx) / cx; // -1..1
      this.mouse.ny = (this.mouse.y - cy) / cy; // -1..1
    };
    this.canvas.addEventListener("mousemove", this._onMouseMove);

    this._onVisibility = () => {
      if (document.hidden) this.stop();
      else this.play();
    };
    document.addEventListener("visibilitychange", this._onVisibility);

    const observer = new MutationObserver(() => {
      this.colors = this.computeColors();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    this._themeObserver = observer;
  }

  getStarColor(brightness) {
    const core = this.colors.core;
    if (core.startsWith("rgb"))
      return core.replace(
        /rgba?\(([^)]+)\)/,
        (m, g) => `rgba(${g}, ${brightness})`
      );
    return this.withAlpha(core, brightness);
  }

  drawStar(star) {
    const parallax = 6 * star.depth;
    const rx = star.x + this.mouse.nx * parallax;
    const ry = star.y + this.mouse.ny * parallax;

    const gradient = this.ctx.createRadialGradient(
      rx,
      ry,
      0,
      rx,
      ry,
      star.size * 2.1
    );
    gradient.addColorStop(
      0,
      this.getStarColor(Math.min(1, star.brightness + 0.05))
    );
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    this.ctx.beginPath();
    this.ctx.arc(rx, ry, star.size * 2.1, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(rx, ry, star.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.getStarColor(star.brightness);
    this.ctx.fill();
  }

  updateStar(star, cssW, cssH) {
    // parallax-aware gentle drift
    star.x += star.speedX * (0.7 + star.depth * 0.6);
    star.y += star.speedY * (0.7 + star.depth * 0.6);

    // twinkle
    star.brightness += star.twinkleSpeed * star.twinkleDirection;
    const maxB = star.baseBrightness + 0.28 * star.depth;
    const minB = star.baseBrightness - 0.18 * (2 - star.depth);
    if (star.brightness >= maxB || star.brightness <= Math.max(0.05, minB)) {
      star.twinkleDirection *= -1;
      star.brightness = Math.max(0.05, Math.min(maxB, star.brightness));
    }

    // subtle mouse repel
    const dx = this.mouse.x - star.x;
    const dy = this.mouse.y - star.y;
    const dist = Math.hypot(dx, dy);
    if (dist < this.mouse.radius * star.depth) {
      const force =
        (this.mouse.radius * star.depth - dist) /
        (this.mouse.radius * star.depth);
      const ang = Math.atan2(dy, dx);
      star.x -= Math.cos(ang) * force * 0.9;
      star.y -= Math.sin(ang) * force * 0.9;
    }

    // wrap
    if (star.x < -10) star.x = cssW + 10;
    if (star.x > cssW + 10) star.x = -10;
    if (star.y < -10) star.y = cssH + 10;
    if (star.y > cssH + 10) star.y = -10;
  }

  drawBackground(cssW, cssH) {
    this.ctx.clearRect(0, 0, cssW, cssH);
    this.ctx.fillStyle = this.colors.trail;
    this.ctx.fillRect(0, 0, cssW, cssH);
  }

  animate() {
    const cssW = this.canvas.width / this.dpr;
    const cssH = this.canvas.height / this.dpr;
    this.drawBackground(cssW, cssH);

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      this.updateStar(s, cssW, cssH);
      this.drawStar(s);
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  play() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  stop() {
    this.running = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

// Initialize stars simulation when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  let starsSimulation = null;
  const linksSection = document.querySelector(".links-section");
  const linksContent = document.getElementById("interestingLinksContent");

  function createStarsSimulation(section) {
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
      section.style.minHeight = "200px";
      section.insertBefore(canvas, section.firstChild);

      if (linksContent) {
        linksContent.style.position = "relative";
        linksContent.style.zIndex = "1";
      }

      return new StarsSimulation(canvas);
    }
    return null;
  }

  function handleToggle(content, simulation, section) {
    if (content.classList.contains("hof-content-collapsed")) {
      if (!simulation) {
        return createStarsSimulation(section);
      }
    } else {
      if (simulation) {
        simulation.destroy();
        return null;
      }
    }
    return simulation;
  }

  if (
    linksContent &&
    linksContent.classList.contains("hof-content-collapsed")
  ) {
    starsSimulation = createStarsSimulation(linksSection);
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        starsSimulation = handleToggle(
          linksContent,
          starsSimulation,
          linksSection
        );
      }
    });
  });

  if (linksContent) {
    observer.observe(linksContent, { attributes: true });
  }
});
