const themes = {
    emoji: {
        symbols: ['😂', '😍', '😎', '😵‍💫', '🤪', '😴', '🥳', '🥴'],
        background: 'image/emoji.jfif',
        backColor: 'palevioletred',
        frontColor: 'lightpink'
    },
    flower: {
        symbols: ['💐', '🍁', '🌻', '🌼', '🌸', '🪻', '🥀', '🪷'],
        background: 'image/flower.jpg',
        backColor: '#1559a1',
        frontColor: 'lightblue'
    },
    food: {
        symbols: ['🧋', '🧇', '🥗', '🍟', '🥪', '🍕', '🍜', '🍞'],
        background: 'image/food3.webp',
        backColor: 'bisque',
        frontColor: 'beige'
    }          
};

let cards = [];
const board = document.querySelector('.game-board');
const timerDisplay = document.createElement('div');
timerDisplay.id = 'timer';
document.body.prepend(timerDisplay);

// Audio files
const flipSound = new Audio('audio/fast-swipe-48158.mp3');
const matchSound = new Audio('audio/success.mp3');
const lostSound = new Audio('audio/lost.mp3');

let flippedCards = [];
let lockBoard = false;
let timer;
let time = 0;

function playFlipSound() {
    flipSound.currentTime = 0;
    flipSound.play();
}

function playMatchSound() {
    matchSound.currentTime = 0;
    matchSound.play();
}

function playLostSound() {
    lostSound.currentTime = 0;
    lostSound.play();
}

function startTimer() {
    clearInterval(timer);
    time = 0;
    timerDisplay.textContent = `Time: 0s`;
    timer = setInterval(() => {
        time++;
        timerDisplay.textContent = `Time: ${time}s`;
        if (time === 60) {
            clearInterval(timer);
            alert("Time's up! Restarting the game.");
            startGame();
        }
    }, 1000);
}

function getCurrentTheme() {
    return document.body.dataset.theme || 'emoji';
}

function changeTheme(theme) {
    document.body.dataset.theme = theme;
    document.body.style.backgroundImage = `url('${themes[theme].background}')`;
    setTimeout(() => {
        startGame(theme);
    }, 300);
}

function startGame(theme = 'emoji') {
    document.body.dataset.theme = theme;
    const selectedTheme = themes[theme];

    document.body.style.backgroundImage = `url('${selectedTheme.background}')`;

    cards = [...selectedTheme.symbols, ...selectedTheme.symbols];
    cards.sort(() => Math.random() - 0.5);

    board.innerHTML = '';

    cards.forEach((symbol) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.textContent = '';
        card.style.backgroundColor = selectedTheme.backColor;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    flippedCards = [];
    lockBoard = false;

    startTimer();
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped')) return;

    playFlipSound();
    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;

    const currentTheme = getCurrentTheme();
    this.style.backgroundColor = themes[currentTheme].frontColor;

    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        lockBoard = true;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const currentTheme = getCurrentTheme();

    if (card1.dataset.symbol === card2.dataset.symbol) {
        playMatchSound();
        card1.style.pointerEvents = 'none';
        card2.style.pointerEvents = 'none';
    } else {
        playLostSound();
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';

            card1.style.backgroundColor = themes[currentTheme].backColor;
            card2.style.backgroundColor = themes[currentTheme].backColor;
        }, 300);
    }
    flippedCards = [];
    lockBoard = false;

    if (document.querySelectorAll('.card.flipped').length === cards.length) {
        clearInterval(timer);
        setTimeout(startGame, 1000);
    }
}

// Event listeners for theme selection and refresh button
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.dropdown-content a').forEach(item => {
        item.addEventListener('click', function() {
            changeTheme(this.dataset.theme);
        });
    });

    document.getElementById('refreshBtn').addEventListener('click', () => startGame(getCurrentTheme()));
});

// Default theme when the page loads
window.onload = () => {
    startGame('emoji');
};
