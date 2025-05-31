const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const ballInput = document.getElementById("ballCount");

let balls = [];
let animationId = null;

let X = parseInt(ballInput.value);
const Y = 100;
const radius = 5;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createBalls() {
    balls = [];
    for (let i = 0; i < X; i++) {
        balls.push({
            x: random(radius, canvas.width - radius),
            y: random(radius, canvas.height - radius),
            vx: random(-2, 2),
            vy: random(-2, 2),
        });
    }
}

function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const d = distance(balls[i], balls[j]);
            if (d < Y) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255,255,255,${1 - d / Y})`;
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.stroke();
            }
        }
    }

    balls.forEach(ball => {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateBalls() {
    balls.forEach(ball => {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x < radius || ball.x > canvas.width - radius) ball.vx *= -1;
        if (ball.y < radius || ball.y > canvas.height - radius) ball.vy *= -1;
    });
}

function animate() {
    updateBalls();
    drawBalls();
    animationId = requestAnimationFrame(animate);
}

function start() {
    X = parseInt(ballInput.value) || 50;
    if (!balls.length) createBalls();
    if (!animationId) animate();
}

function reset() {
    cancelAnimationFrame(animationId);
    animationId = null;
    balls = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

startBtn.addEventListener("click", start);
resetBtn.addEventListener("click", reset);
