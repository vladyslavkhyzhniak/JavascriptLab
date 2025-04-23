const blueCircle = document.getElementById("blueCircle");
const blackCircle = document.getElementById("blackCircle");
const timerElement = document.getElementById("timer");
const highScoreElement = document.getElementById("HighScore");

let x = 100;
let y = 100;
let gamma = 0;
let beta = 0;
const speed = 2;
let timer = 0;

const MIN_X = 0;
const MAX_X = 300;
const MIN_Y = 0;
const MAX_Y = 400;

function startTimer() {
    timerInterval = setInterval(() => {
        timer += 1;
        timerElement.textContent = timer;
        if (timer >= 61) {
            stopTimer();
            location.reload();
            alert("Out of time")
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function checkCollision() {
    const blueRect = blueCircle.getBoundingClientRect();
    const blackRect = blackCircle.getBoundingClientRect();

    return !(
        blueRect.right < blackRect.left ||
        blueRect.left > blackRect.right ||
        blueRect.bottom < blackRect.top ||
        blueRect.top > blackRect.bottom
    );
}

function move() {
    x += gamma * speed * 0.1;
    y += beta * speed * 0.1;

    x = Math.max(MIN_X, Math.min(x, MAX_X));
    y = Math.max(MIN_Y, Math.min(y, MAX_Y));

    blueCircle.style.left = `${x}px`;
    blueCircle.style.top = `${y}px`;


    if (checkCollision()) {
        stopTimer();
        let highScore = localStorage.getItem("HighScore") || 61;
        if (timer < +highScore) {
            localStorage.setItem("HighScore", timer)
        }
        location.reload();

    }
    requestAnimationFrame(move);
}

window.addEventListener("deviceorientation", (event) => {
    gamma = event.gamma || 0;
    beta = event.beta || 0;
});
window.addEventListener
requestAnimationFrame(move);
startTimer();
highScoreElement.textContent = localStorage.getItem("HighScore") || "0";