class FluidSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: 0, y: 0, radius: 100 };
    this.animationFrameId = null;
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();
    this.addEventListeners();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    const numberOfParticles = 100;
    for (let i = 0; i < numberOfParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: `rgba(${Math.random() * 100 + 155}, ${
          Math.random() * 100 + 155
        }, ${Math.random() * 100 + 155}, 0.5)`,
      });
    }
  }

  addEventListeners() {
    window.addEventListener("resize", () => this.resize());
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = particle.color;
    this.ctx.fill();
  }

  updateParticle(particle) {
    // Move particle
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Mouse interaction
    const dx = this.mouse.x - particle.x;
    const dy = this.mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.mouse.radius) {
      const angle = Math.atan2(dy, dx);
      const force = (this.mouse.radius - distance) / this.mouse.radius;
      particle.x -= Math.cos(angle) * force * 2;
      particle.y -= Math.sin(angle) * force * 2;
    }

    // Bounce off edges
    if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > this.canvas.height)
      particle.speedY *= -1;
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${
            0.1 * (1 - distance / 100)
          })`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    this.drawConnections();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
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

// Initialize fluid simulation when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  let fluidSimulation = null;
  let aboutFluidSimulation = null;
  const hallOfFameSection = document.getElementById("hallOfFameSection");
  const hofContent = document.getElementById("hallOfFameContent");
  const hofToggleTitle = document.getElementById("hofToggleTitle");
  const aboutSection = document.querySelector(".about-section");
  const aboutContent = document.getElementById("aboutMeContent");

  function createFluidSimulation(section, content) {
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
      if (content) {
        content.style.position = "relative";
        content.style.zIndex = "1";
      }

      return new FluidSimulation(canvas);
    }
    return null;
  }

  function handleToggle(content, simulation, section) {
    if (content.classList.contains("hof-content-collapsed")) {
      // Section is collapsed, create new simulation
      if (!simulation) {
        return createFluidSimulation(section, content);
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

  // Initial setup for About section
  if (
    aboutContent &&
    aboutContent.classList.contains("hof-content-collapsed")
  ) {
    aboutFluidSimulation = createFluidSimulation(aboutSection, aboutContent);
  }

  // Add observer to watch for class changes in About section
  const aboutObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        aboutFluidSimulation = handleToggle(
          aboutContent,
          aboutFluidSimulation,
          aboutSection
        );
      }
    });
  });

  if (aboutContent) {
    aboutObserver.observe(aboutContent, { attributes: true });
  }
});
