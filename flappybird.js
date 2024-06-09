// Define an array of background images
const backgroundImages = [
    'url("./flappybirdbg.png")',
    'url("./flappybirdbg2.png")',
    'url("./flappybirdbg3.png")',
    'url("./flappybirdbg4.png")',
    'url("./flappybirdbg5.png")'
];

// Initialize restart count from localStorage
if (!localStorage.getItem('restartCount')) {
    localStorage.setItem('restartCount', 0);
}

let restartCount = parseInt(localStorage.getItem('restartCount'));

// Function to update the background image based on the restart count
function updateBackgroundImage() {
    const imageIndex = Math.floor(restartCount / 3) % backgroundImages.length;
    document.getElementById('board').style.backgroundImage = backgroundImages[imageIndex];
}

// Function to reset the game
function resetGame() {
    // Increment the restart count
    restartCount++;
    localStorage.setItem('restartCount', restartCount);

    // Update the background image
    updateBackgroundImage();

    // Reset game variables
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    pipesPassed = 0;
    cake = null;
    flower = null; // Reset flower
    gameOver = false;
    lives = 4; // Reset lives
    isInvincible = false; // Reset invincibility
    invincibilityEndTime = 0; // Reset invincibility end time

    // Reset bird position and velocity
    velocityY = 0;
}

// Music part
let bgMusic = document.getElementById('bg-music');
let musicButton = document.getElementById('music-button');
let isMusicPlaying = false;
let currentSongIndex = 0; // Initialize the current song index

// Define an array of song sources
let songs = [
    "background-music.mp3",
    "background-music2.mp3",
    "background-music3.mp3"
];

musicButton.addEventListener('click', function() {
    if (!isMusicPlaying) {
        playMusic();
    } else {
        pauseMusic();
    }
});

function playMusic() {
    bgMusic.src = songs[currentSongIndex];
    bgMusic.play();
    isMusicPlaying = true;
    musicButton.textContent = 'Pause Music';
}

function pauseMusic() {
    bgMusic.pause();
    isMusicPlaying = false;
    musicButton.textContent = 'Play Music';
}

function switchSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length; // Update the current song index
    if (isMusicPlaying) {
        playMusic(); // Play the new song if music was playing
    }
}

// Function to handle song selection
function selectSong(index) {
    currentSongIndex = index;
    if (isMusicPlaying) {
        playMusic();
    }
    updateActiveButton(index);
}

function updateActiveButton(index) {
    // Remove 'active' class from all song buttons
    let buttons = document.querySelectorAll('.song-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Add 'active' class to the selected song button
    let activeButton = document.getElementById(`song${index + 1}-button`);
    activeButton.classList.add('active');
}

// Game part
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird
let birdWidth = 60;
let birdHeight = 70;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Cake
let cakeImg;
let cake = null;
let cakeWidth = 50;
let cakeHeight = 50;

// Flower
let flowerImg;
let flower = null;
let flowerWidth = 50;
let flowerHeight = 50;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.3;

let gameOver = false;
let score = 0;
let pipesPassed = 0;

// Lives
let lives = 3;

// Invincibility
let isInvincible = false;
let invincibilityDuration = 6000; // 6 seconds
let invincibilityEndTime = 0;

// Sound
let eatSound;
let collisionSound;
let tap1;
let introText = "fairy ahona is flying";
let introTextDisplayed = "";
let introIndex = 0;
let introDuration = 6000; // Duration in milliseconds
let introStartTime = null;
let introInterval;

window.onload = function () {
    updateBackgroundImage();

    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const canvas = document.getElementById('board');

    startButton.addEventListener('click', function () {
        startScreen.style.display = 'none';
        startGame();
    });

    // Adjust canvas size based on window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Add touch event listeners
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
};

function startGame() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    cakeImg = new Image();
    cakeImg.src = "./cake.png";

    flowerImg = new Image();
    flowerImg.src = "./flower.png";

    // Load sound
    eatSound = new Audio("./eat.mp3");
    collisionSound = new Audio("./collisionSound.mp3");
    tap1 = new Audio("./tap.mp3");

    // Initialize intro text
    introTextDisplayed = "";
    introIndex = 0;
    introStartTime = Date.now();
    introInterval = setInterval(displayIntroText, introDuration / introText.length);

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // Place pipes every 1.5 seconds
    document.addEventListener("keydown", moveBird);

    // Reset game variables
    resetGame();
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // Apply gravity to bird.y, limit bird.y to top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        handleCollision();
    }

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // 0.5 because there are 2 pipes
            pipe.passed = true;
            pipesPassed++;

            // Show cake or flower after passing pipes
            if (pipesPassed % 3 === 0) {
                let topPipe = pipeArray[pipeArray.length - 2];
                let bottomPipe = pipeArray[pipeArray.length - 1];
                let cakeY = (topPipe.y + topPipe.height + bottomPipe.y) / 2 - cakeHeight / 2;
                cake = {
                    x: boardWidth,
                    y: cakeY,
                    width: cakeWidth,
                    height: cakeHeight
                };
            }
            if (pipesPassed % 15 === 0) {
                let topPipe = pipeArray[pipeArray.length - 2];
                let bottomPipe = pipeArray[pipeArray.length - 1];
                let flowerY = (topPipe.y + topPipe.height + bottomPipe.y) / 2 - flowerHeight / 2;
                flower = {
                    x: boardWidth,
                    y: flowerY,
                    width: flowerWidth,
                    height: flowerHeight
                };
            }
        }

        if (detectCollision(bird, pipe) && !isInvincible) {
            handleCollision();
        }
    }

    // Clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // Remove first element from the array
    }

    // Cake
    if (cake) {
        cake.x += velocityX;
        context.drawImage(cakeImg, cake.x, cake.y, cake.width, cake.height);

        if (detectCollision(bird, cake)) {
            score += 5; // Bonus score for eating the cake
            cake = null; // Remove cake after it is eaten
            eatSound.play(); // Play the eating sound
        }

        // Remove cake if it goes off screen
        if (cake && cake.x < -cakeWidth) {
            cake = null;
        }
    }

    // Flower
    if (flower) {
        flower.x += velocityX;
        context.drawImage(flowerImg, flower.x, flower.y, flower.width, flower.height);

        if (detectCollision(bird, flower)) {
            isInvincible = true;
            invincibilityEndTime = Date.now() + invincibilityDuration;
            flower = null; // Remove flower after it is eaten
            eatSound.play(); // Play the eating sound
        }

        // Remove flower if it goes off screen
        if (flower && flower.x < -flowerWidth) {
            flower = null;
        }
    }

    // Handle invincibility
    if (isInvincible) {
        if (Date.now() > invincibilityEndTime) {
            isInvincible = false;
        } else {
            // Draw a glowing effect around the bird
            context.beginPath();
            context.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2 + 5, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Yellow semi-transparent color, adjust as needed
            context.fill();
            context.closePath();
        }
    }
    
    // Draw the bird
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Intro Text
    if (Date.now() - introStartTime < introDuration) {
        context.fillStyle = "white";
        context.font = "30px sans-serif";
        context.fillText(introTextDisplayed, 5, 30);
    } else {
        clearInterval(introInterval);
    }

    // Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 75);

    // Lives
    context.fillText("Lives: " + lives, 5, 120);

    if (gameOver) {
        if (gameOver) {
            context.fillStyle = "red";
        context.font = "bold 40px sans-serif";
        context.fillText("GAME OVER", 50, boardHeight / 2);
        context.fillStyle = "rgba(255, 0, 0, 0.1)"; // Semi-transparent red color
        for (let i = 0; i < 5; i++) {
            let offsetX = Math.random() * 10 - 5;
            let offsetY = Math.random() * 10 - 5;
            context.fillText("GAME OVER", 50 + offsetX, boardHeight / 2 + offsetY);
        }}
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    // Generate random Y position for top pipe
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // Jump
        jump(); 
        tap1.play();
    }
}

function handleTouchStart(event) {
    // Prevent default touch behavior
    event.preventDefault();
    
    // Jump when touch starts
    jump();
    tap1.play();
}

function handleTouchEnd(event) {
    // Prevent default touch behavior
    event.preventDefault();

    // Reset game if it's over
    if (gameOver) {
        resetGame();
    }
}

function jump() {
    // Jump
    velocityY = -5;

    // Reset game if it's over
    if (gameOver) {
        resetGame();
    }
}

function handleCollision() {
    lives--;
    if (lives <= 0) {
        gameOver = true;
    } else {
        bird.y = birdY; // Reset bird position
        velocityY = 0; // Reset bird velocity
    }
    collisionSound.play();
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function displayIntroText() {
    if (introIndex < introText.length) {
        introTextDisplayed += introText[introIndex];
        introIndex++;
    } else {
        clearInterval(introInterval);
    }
}
