class ProjectsSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.icons = [];
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;
    this.time = 0;

    // Tech icons and symbols
    this.techSymbols = ['⚛️', '🔧', '⚡', '🚀', '💻', '🌐', '📱', '🔒', '📊', '🎯', '⚙️', '🔗'];
    this.techWords = ['React', 'Node', 'JS', 'API', 'Git', 'CSS', 'HTML', 'DB', 'Cloud', 'DevOps'];

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.createIcons();
    this.animate();
    this.addEventListeners();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.createParticles();
    this.createIcons();
  }

  createParticles() {
    this.particles = [];
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 20000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomTechColor()
      });
    }
  }

  createIcons() {
    this.icons = [];
    const iconCount = Math.floor(this.canvas.width / 200);
    
    for (let i = 0; i < iconCount; i++) {
      this.icons.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        symbol: this.techSymbols[Math.floor(Math.random() * this.techSymbols.length)],
        size: Math.random() * 20 + 15,
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }

  getRandomTechColor() {
    const colors = [
      '#61dafb', // React blue
      '#f7df1e', // JavaScript yellow
      '#e34f26', // HTML orange
      '#1572b6', // CSS blue
      '#339933', // Node green
      '#f05032', // Git orange
      '#3776ab', // Python blue
      '#ed8b00', // Java orange
      '#06b6d4', // Tailwind cyan
      '#4db33d'  // MongoDB green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off walls
      if (particle.x <= 0 || particle.x >= this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y <= 0 || particle.y >= this.canvas.height) {
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
    this.icons.forEach(icon => {
      // Update position
      icon.x += icon.vx;
      icon.y += icon.vy;
      icon.rotation += icon.rotationSpeed;
      
      // Bounce off walls
      if (icon.x <= 0 || icon.x >= this.canvas.width) {
        icon.vx *= -1;
      }
      if (icon.y <= 0 || icon.y >= this.canvas.height) {
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
          const opacity = (100 - distance) / 100 * 0.1;
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
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
    // Clear with semi-transparent background for trail effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections
    this.drawConnections();
    
    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
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
    this.icons.forEach(icon => {
      this.ctx.save();
      this.ctx.globalAlpha = icon.opacity;
      this.ctx.translate(icon.x, icon.y);
      this.ctx.rotate(icon.rotation);
      this.ctx.font = `${icon.size}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(icon.symbol, 0, 0);
      this.ctx.restore();
    });
    
    // Draw floating tech words occasionally
    if (Math.random() > 0.995) {
      const word = this.techWords[Math.floor(Math.random() * this.techWords.length)];
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.font = '12px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(word, x, y);
    }
  }

  animate() {
    this.time += 0.016; // Assuming 60fps
    this.updateParticles();
    this.updateIcons();
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

// Initialize projects simulation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  let projectsSimulation = null;
  const projectsSection = document.querySelector('.codecompanywise-section');
  const projectsContent = document.getElementById('codeCompanyWiseContent');

  function createProjectsSimulation(section) {
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
      if (projectsContent) {
        projectsContent.style.position = 'relative';
        projectsContent.style.zIndex = '1';
      }
      
      return new ProjectsSimulation(canvas);
    }
    return null;
  }

  function handleToggle(content, simulation, section) {
    if (content.classList.contains('hof-content-collapsed')) {
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
  if (projectsContent && projectsContent.classList.contains('hof-content-collapsed')) {
    projectsSimulation = createProjectsSimulation(projectsSection);
  }

  // Add observer to watch for class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        projectsSimulation = handleToggle(projectsContent, projectsSimulation, projectsSection);
      }
    });
  });

  if (projectsContent) {
    observer.observe(projectsContent, { attributes: true });
  }
}); 