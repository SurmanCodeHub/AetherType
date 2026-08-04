const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Mouse tracking object
const mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

let particles = [];
const textInput = document.getElementById('textInput');

function initParticles() {
    particles = [];
    const text = textInput.value || "AETHER";
    
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = width;
    offCanvas.height = height;

    offCtx.font = 'bold 10vw sans-serif';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText(text, width / 2, height / 2);

    const imageData = offCtx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    const step = 6;
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            const index = (y * width + x) * 4;
            if (pixels[index + 3] > 128) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    baseX: x,
                    baseY: y,
                    vx: 0,
                    vy: 0,
                    size: 2,
                    density: (Math.random() * 20) + 5
                });
            }
        }
    }
}

textInput.addEventListener('input', initParticles);
initParticles();

function animate() {
    requestAnimationFrame(animate);

    ctx.fillStyle = 'rgba(5, 5, 10, 0.2)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                p.vx -= Math.cos(angle) * force * p.density * 0.6;
                p.vy -= Math.sin(angle) * force * p.density * 0.6;
            }
        }

        let dx = p.baseX - p.x;
        let dy = p.baseY - p.y;
        
        p.vx += dx * 0.05;
        p.vy += dy * 0.05;

        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        let speed = Math.abs(p.vx) + Math.abs(p.vy);
        ctx.fillStyle = speed > 2 ? '#00ffcc' : '#0077ff';
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
}

animate();

// --- Footer Typewriter Animation (Fixed with all titles & name) ---
const roles = ["Founder & CEO", "Lead Developer", "Vishal Kumar"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}

typeEffect();