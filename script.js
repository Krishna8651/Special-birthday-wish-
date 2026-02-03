// DOM Elements
const birthdayMessage = document.getElementById('birthdayMessage');
const userNameInput = document.getElementById('userName');
const personalizeBtn = document.getElementById('personalizeBtn');
const candleContainer = document.getElementById('candleContainer');
const confettiContainer = document.getElementById('confettiContainer');
const musicToggle = document.getElementById('musicToggle');
const birthdayAudio = document.getElementById('birthdayAudio');
const viewCountElement = document.getElementById('viewCount');

// Initial messages
const birthdayMessages = [
    "May your day be filled with <span class='highlight'>joy</span>, your year with <span class='highlight'>success</span>, and your life with <span class='highlight'>love</span>. Wishing you the most wonderful birthday!",
    "On your special day, may you be surrounded by <span class='highlight'>happiness</span>, <span class='highlight'>laughter</span>, and the people you love. Happy Birthday!",
    "Another year older, another year wiser, another year more amazing! May all your dreams and wishes come true. Happy Birthday!",
    "Today is about celebrating you and all the incredible things you bring to this world. Wishing you a birthday as wonderful as you are!",
    "May this birthday bring you endless moments of joy, laughter, and beautiful memories to cherish forever. Happy Birthday!"
];

// Initialize view count
let viewCount = localStorage.getItem('birthdayWishViews') || 0;
viewCount++;
localStorage.setItem('birthdayWishViews', viewCount);
viewCountElement.textContent = viewCount;

// Initialize candles
function createCandles() {
    candleContainer.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.innerHTML = '<div class="flame"></div>';
        
        candle.addEventListener('click', () => {
            if (!candle.classList.contains('out')) {
                candle.classList.add('out');
                
                // Create a small confetti burst when candle is blown out
                createConfettiBurst(candle.offsetLeft + 15, candle.offsetTop);
                
                // Check if all candles are out
                const allCandles = document.querySelectorAll('.candle');
                const allOut = Array.from(allCandles).every(c => c.classList.contains('out'));
                
                if (allOut) {
                    setTimeout(() => {
                        createConfettiRain();
                        alert("🎉 You've blown out all the candles! Your wish will come true! 🎉");
                    }, 500);
                }
            }
        });
        
        candleContainer.appendChild(candle);
    }
}

// Create confetti
function createConfettiRain() {
    const colors = ['#ffd700', '#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff6b81', '#70a1ff'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 15 + 5 + 'px';
        confetti.style.height = Math.random() * 15 + 5 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confettiContainer.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            { 
                transform: 'translateY(-100px) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, 
                opacity: 0 
            }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove confetti after animation
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Create a small confetti burst
function createConfettiBurst(x, y) {
    const colors = ['#ffd700', '#ff4757', '#2ed573', '#1e90ff'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confettiContainer.appendChild(confetti);
        
        // Animate confetti
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = 0;
        let posY = 0;
        let opacity = 1;
        
        const burstAnimation = () => {
            posX += vx;
            posY += vy;
            vy += 0.1; // gravity
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${posX * 10}px, ${posY * 10}px)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(burstAnimation);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(burstAnimation);
    }
}

// Personalize the birthday message
function personalizeMessage() {
    const name = userNameInput.value.trim();
    if (name) {
        const randomMessage = birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];
        const personalizedMessage = randomMessage.replace(/your/g, `${name}'s`)
                                                .replace(/you/g, name)
                                                .replace(/You/g, name);
        
        birthdayMessage.innerHTML = personalizedMessage;
        
        // Add visual effect
        birthdayMessage.style.transform = 'scale(1.05)';
        setTimeout(() => {
            birthdayMessage.style.transform = 'scale(1)';
        }, 300);
        
        // Create some celebratory confetti
        createConfettiBurst(birthdayMessage.offsetLeft + birthdayMessage.offsetWidth/2, birthdayMessage.offsetTop);
    } else {
        alert("Please enter your name first!");
        userNameInput.focus();
    }
}

// Music control
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        birthdayAudio.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        musicToggle.style.background = 'rgba(255, 255, 255, 0.2)';
    } else {
        birthdayAudio.play().catch(e => {
            console.log("Audio play failed:", e);
            // Fallback: Show a message to interact with page first
            alert("Please click anywhere on the page to enable audio, then click the music button again.");
        });
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        musicToggle.style.background = 'rgba(255, 215, 0, 0.3)';
    }
    isPlaying = !isPlaying;
});

// Auto-start confetti rain on page load
window.addEventListener('load', () => {
    createCandles();
    setTimeout(createConfettiRain, 1000);
    
    // Auto-play music after a short delay
    setTimeout(() => {
        // Try to play music automatically (will work if user has interacted with page)
        birthdayAudio.volume = 0.5;
        birthdayAudio.play().then(() => {
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.style.background = 'rgba(255, 215, 0, 0.3)';
        }).catch(e => {
            console.log("Autoplay prevented. User needs to interact first.");
        });
    }, 2000);
});

// Add click anywhere to enable audio
document.body.addEventListener('click', () => {
    // This helps with browsers that require user interaction for audio
    if (birthdayAudio.paused) {
        birthdayAudio.play().then(() => {
            birthdayAudio.pause();
            if (isPlaying) {
                birthdayAudio.play();
            }
        }).catch(e => console.log("Audio interaction handled"));
    }
});

// Event listeners
personalizeBtn.addEventListener('click', personalizeMessage);
userNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        personalizeMessage();
    }
});

// Create a floating animation for the title
const title = document.querySelector('h1');
let floatDirection = 1;

setInterval(() => {
    const currentTransform = window.getComputedStyle(title).transform;
    const currentScale = currentTransform === 'none' ? 1 : parseFloat(currentTransform.split(',')[0].split('(')[1]);
    
    if (currentScale > 1.05) floatDirection = -1;
    if (currentScale < 0.95) floatDirection = 1;
    
    title.style.transform = `scale(${currentScale + 0.005 * floatDirection})`;
}, 100);

// Create occasional random confetti
setInterval(() => {
    if (Math.random() > 0.7) {
        createConfettiBurst(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight / 2
        );
    }
}, 3000);
