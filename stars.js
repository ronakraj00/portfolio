class StarsSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.mouse = { x: 0, y: 0, radius: 150 };
        this.animationFrameId = null;
        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.animate();
        this.addEventListeners();
    }

    resize() {
        // Get the parent section's dimensions
        const section = this.canvas.parentElement;
        if (section) {
            this.canvas.width = section.offsetWidth;
            this.canvas.height = section.offsetHeight;
        }
    }

    createStars() {
        const numberOfStars = Math.floor((this.canvas.width * this.canvas.height) / 1000); // Adjust star density based on canvas size
        for (let i = 0; i < numberOfStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.05 - 0.025,
                speedY: Math.random() * 0.05 - 0.025,
                brightness: Math.random() * 0.5 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.02,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1
            });
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

    drawStar(star) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        this.ctx.fill();
    }

    updateStar(star) {
        // Move star very slowly
        star.x += star.speedX;
        star.y += star.speedY;

        // Enhanced twinkle effect
        star.brightness += star.twinkleSpeed * star.twinkleDirection;
        if (star.brightness >= 1 || star.brightness <= 0.1) {
            star.twinkleDirection *= -1;
        }

        // More subtle mouse interaction
        const dx = this.mouse.x - star.x;
        const dy = this.mouse.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (this.mouse.radius - distance) / this.mouse.radius;
            star.x -= Math.cos(angle) * force * 1.5;
            star.y -= Math.sin(angle) * force * 1.5;
        }

        // Wrap around edges
        if (star.x < 0) star.x = this.canvas.width;
        if (star.x > this.canvas.width) star.x = 0;
        if (star.y < 0) star.y = this.canvas.height;
        if (star.y > this.canvas.height) star.y = 0;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            this.updateStar(star);
            this.drawStar(star);
        });

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

// Initialize stars simulation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    let starsSimulation = null;
    const linksSection = document.querySelector('.links-section');
    const linksContent = document.getElementById('interestingLinksContent');

    function createStarsSimulation(section) {
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
            section.style.minHeight = '200px'; // Ensure minimum height for the section
            section.insertBefore(canvas, section.firstChild);
            
            // Move all content above the canvas
            if (linksContent) {
                linksContent.style.position = 'relative';
                linksContent.style.zIndex = '1';
            }
            
            return new StarsSimulation(canvas);
        }
        return null;
    }

    function handleToggle(content, simulation, section) {
        if (content.classList.contains('hof-content-collapsed')) {
            // Section is collapsed, create new simulation
            if (!simulation) {
                return createStarsSimulation(section);
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
    if (linksContent && linksContent.classList.contains('hof-content-collapsed')) {
        starsSimulation = createStarsSimulation(linksSection);
    }

    // Add observer to watch for class changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                starsSimulation = handleToggle(linksContent, starsSimulation, linksSection);
            }
        });
    });

    if (linksContent) {
        observer.observe(linksContent, { attributes: true });
    }
}); 