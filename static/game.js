class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = 20;
        this.reset();
    }

    reset() {
        this.direction = 'right';
        this.nextDirection = 'right';
        this.snake = [
            { x: 3, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 1 }
        ];
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
    }

    generateFood() {
        const maxX = (this.canvas.width / this.tileSize) - 1;
        const maxY = (this.canvas.height / this.tileSize) - 1;
        while (true) {
            const food = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
            if (!this.snake.some(segment => segment.x === food.x && segment.y === food.y)) {
                return food;
            }
        }
    }

    update() {
        if (this.gameOver || this.paused) return;

        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.tileSize ||
            head.y < 0 || head.y >= this.canvas.height / this.tileSize) {
            this.gameOver = true;
            return;
        }

        // Check collision with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            document.getElementById('score').textContent = this.score;
            audioManager.playEat();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize - 1,
                this.tileSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
            this.food.x * this.tileSize,
            this.food.y * this.tileSize,
            this.tileSize - 1,
            this.tileSize - 1
        );
    }

    changeDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }
}

class AudioManager {
    constructor() {
        this.sounds = {
            background: new Audio('/static/audio/background.mp3'),
            eat: new Audio('/static/audio/eat.mp3'),
            gameOver: new Audio('/static/audio/gameover.mp3')
        };
        
        // Налаштування фонової музики
        this.sounds.background.loop = true;
        
        // Налаштування гучності
        this.backgroundVolume = 0.5;
        this.effectsVolume = 0.5;
        this.sounds.background.volume = this.backgroundVolume;
        this.sounds.eat.volume = this.effectsVolume;
        this.sounds.gameOver.volume = this.effectsVolume;
        
        this.muted = false;
    }

    setBackgroundVolume(value) {
        this.backgroundVolume = value / 100;
        this.sounds.background.volume = this.muted ? 0 : this.backgroundVolume;
    }

    setEffectsVolume(value) {
        this.effectsVolume = value / 100;
        this.sounds.eat.volume = this.muted ? 0 : this.effectsVolume;
        this.sounds.gameOver.volume = this.muted ? 0 : this.effectsVolume;
    }    testSounds() {
        if (!this.muted) {
            this.sounds.eat.play();
            setTimeout(() => this.sounds.gameOver.play(), 500);
        }
    }

    testBackgroundMusic() {
        if (!this.muted) {
            // Зберігаємо поточний стан loop
            const wasLooping = this.sounds.background.loop;
            // Вимикаємо loop для тесту
            this.sounds.background.loop = false;
            
            // Зберігаємо поточну позицію відтворення
            const currentTime = this.sounds.background.currentTime;
            
            // Відтворюємо 3 секунди музики
            this.sounds.background.currentTime = 0;
            this.sounds.background.play();
            
            setTimeout(() => {
                this.sounds.background.pause();
                // Відновлюємо попередні налаштування
                this.sounds.background.loop = wasLooping;
                this.sounds.background.currentTime = currentTime;
            }, 3000);
        }
    }

    playBackground() {
        if (!this.muted) {
            this.sounds.background.play();
        }
    }

    stopBackground() {
        this.sounds.background.pause();
        this.sounds.background.currentTime = 0;
    }

    playEat() {
        if (!this.muted) {
            this.sounds.eat.play();
        }
    }

    playGameOver() {
        if (!this.muted) {
            this.sounds.gameOver.play();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBackground();
        } else {
            if (game && !game.gameOver && !game.paused) {
                this.playBackground();
            }
        }
        return this.muted;
    }
}

// Game initialization and control
let game;
let gameLoop;
let audioManager;

function initGame() {
    const canvas = document.getElementById('game-canvas');
    canvas.width = 600;
    canvas.height = 400;
    game = new Snake(canvas);
    audioManager = new AudioManager();
    
    document.addEventListener('keydown', handleKeyPress);
    setupEventListeners();
    showScreen('menu');
}

function handleKeyPress(event) {
    const directions = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };
    if (directions[event.key]) {
        event.preventDefault();
        game.changeDirection(directions[event.key]);
    }
}

function startGame() {
    game.reset();
    document.getElementById('score').textContent = '0';
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(() => {
        game.update();
        game.draw();
        if (game.gameOver) {
            clearInterval(gameLoop);
            handleGameOver();
        }
    }, 100);
    audioManager.playBackground();
}

function handleGameOver() {
    document.getElementById('final-score').textContent = game.score;
    audioManager.playGameOver();
    showScreen('game-over');
}

function submitScore() {
    const playerName = document.getElementById('player-name').value || 'Anonymous';
    fetch('/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player: playerName,
            score: game.score
        })
    })
    .then(() => {
        showScreen('menu');
    })
    .catch(console.error);
}

function loadHighScores() {
    fetch('/scores')
        .then(response => response.json())
        .then(data => {
            const scoresList = document.getElementById('scores-list');
            scoresList.innerHTML = data.scores
                .map(score => `
                    <div class="score-item">
                        <span>${score.player}</span>
                        <span>${score.score}</span>
                        <span>${score.date}</span>
                    </div>
                `)
                .join('');
        })
        .catch(console.error);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
    if (screenId === 'high-scores') {
        loadHighScores();
    }
}

function setupEventListeners() {
    document.getElementById('start-game').onclick = () => {
        showScreen('game');
        startGame();
    };
    
    document.getElementById('show-scores').onclick = () => {
        showScreen('high-scores');
    };
    
    document.getElementById('submit-score').onclick = submitScore;
    
    document.getElementById('play-again').onclick = () => {
        showScreen('game');
        startGame();
    };
    
    document.getElementById('return-menu').onclick = () => {
        showScreen('menu');
    };
    
    document.getElementById('back-to-menu').onclick = () => {
        showScreen('menu');
    };
    
    document.getElementById('pause-game').onclick = () => {
        game.paused = !game.paused;
        document.getElementById('pause-game').textContent = game.paused ? 'Resume' : 'Pause';
    };
      document.getElementById('mute-toggle').onclick = () => {
        const isMuted = audioManager.toggleMute();
        document.getElementById('mute-toggle').textContent = isMuted ? 'Unmute' : 'Mute';
    };

    // Налаштування звуку
    document.getElementById('show-settings').onclick = () => {
        showScreen('sound-settings');
    };

    document.getElementById('settings-back').onclick = () => {
        showScreen('menu');
    };

    document.getElementById('background-volume').oninput = (e) => {
        const value = e.target.value;
        document.getElementById('background-volume-value').textContent = value + '%';
        audioManager.setBackgroundVolume(value);
    };

    document.getElementById('effects-volume').oninput = (e) => {
        const value = e.target.value;
        document.getElementById('effects-volume-value').textContent = value + '%';
        audioManager.setEffectsVolume(value);
    };    document.getElementById('test-sound').onclick = () => {
        audioManager.testSounds();
    };

    document.getElementById('test-background-music').onclick = () => {
        audioManager.testBackgroundMusic();
    };
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
