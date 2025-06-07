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
        const section = this.canvas.parentElement;
        if (section) {
            this.canvas.width = section.offsetWidth;
            this.canvas.height = section.offsetHeight;
        }
    }

    createStars() {
        const numberOfStars = Math.floor((this.canvas.width * this.canvas.height) / 800); // Increased star density
        const minDistance = 20; // Minimum distance between stars
        
        // Create different types of stars
        for (let i = 0; i < numberOfStars; i++) {
            const starType = Math.random();
            let size, speed, brightness, twinkleSpeed;
            
            if (starType < 0.6) { // 60% small stars
                size = Math.random() * 1 + 0.5;
                speed = Math.random() * 0.02 - 0.01;
                brightness = Math.random() * 0.3 + 0.2;
                twinkleSpeed = Math.random() * 0.02 + 0.01;
            } else if (starType < 0.9) { // 30% medium stars
                size = Math.random() * 1.5 + 1;
                speed = Math.random() * 0.03 - 0.015;
                brightness = Math.random() * 0.4 + 0.3;
                twinkleSpeed = Math.random() * 0.015 + 0.01;
            } else { // 10% large stars
                size = Math.random() * 2 + 1.5;
                speed = Math.random() * 0.04 - 0.02;
                brightness = Math.random() * 0.5 + 0.4;
                twinkleSpeed = Math.random() * 0.01 + 0.005;
            }

            // Try to find a valid position for the star
            let x, y;
            let attempts = 0;
            const maxAttempts = 50;

            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
                attempts++;

                // Check if this position is far enough from other stars
                let isValid = true;
                for (let j = 0; j < this.stars.length; j++) {
                    const dx = x - this.stars[j].x;
                    const dy = y - this.stars[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < minDistance) {
                        isValid = false;
                        break;
                    }
                }

                if (isValid || attempts >= maxAttempts) {
                    break;
                }
            } while (true);

            this.stars.push({
                x: x,
                y: y,
                size: size,
                speedX: speed,
                speedY: speed,
                brightness: brightness,
                twinkleSpeed: twinkleSpeed,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1,
                originalBrightness: brightness
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

    getStarColor(brightness) {
        const theme = document.body.getAttribute('data-theme') || 'dark';
        
        const colors = {
            light: `rgba(0, 0, 0, ${brightness * 0.8})`,
            dark: `rgba(255, 255, 255, ${brightness})`,
            forest: `rgba(0, 100, 0, ${brightness})`,
            ocean: `rgba(0, 0, 139, ${brightness})`,
            japan: `rgba(255, 0, 0, ${brightness})`,
            retro: `rgba(128, 0, 128, ${brightness})`,
            future: `rgba(0, 255, 255, ${brightness})`,
            cyberpunk: `rgba(255, 0, 255, ${brightness})`,
            sunrise: `rgba(255, 165, 0, ${brightness})`,
            sunset: `rgba(255, 69, 0, ${brightness})`,
            twilight: `rgba(75, 0, 130, ${brightness})`
        };

        return colors[theme] || colors.dark;
    }

    drawStar(star) {
        // Draw star glow
        const gradient = this.ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 2
        );
        gradient.addColorStop(0, this.getStarColor(star.brightness));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Draw star core
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.getStarColor(star.brightness);
        this.ctx.fill();
    }

    updateStar(star) {
        // Move star very slowly
        star.x += star.speedX;
        star.y += star.speedY;

        // Enhanced twinkle effect
        star.brightness += star.twinkleSpeed * star.twinkleDirection;
        if (star.brightness >= star.originalBrightness + 0.3 || star.brightness <= star.originalBrightness - 0.2) {
            star.twinkleDirection *= -1;
        }

        // Subtle mouse interaction
        const dx = this.mouse.x - star.x;
        const dy = this.mouse.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (this.mouse.radius - distance) / this.mouse.radius;
            star.x -= Math.cos(angle) * force * 1.2;
            star.y -= Math.sin(angle) * force * 1.2;
        }

        // Wrap around edges with smooth transition
        if (star.x < -10) star.x = this.canvas.width + 10;
        if (star.x > this.canvas.width + 10) star.x = -10;
        if (star.y < -10) star.y = this.canvas.height + 10;
        if (star.y > this.canvas.height + 10) star.y = -10;
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
            section.style.minHeight = '200px';
            section.insertBefore(canvas, section.firstChild);
            
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

    if (linksContent && linksContent.classList.contains('hof-content-collapsed')) {
        starsSimulation = createStarsSimulation(linksSection);
    }

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