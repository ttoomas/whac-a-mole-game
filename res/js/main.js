const holeBxs = document.querySelectorAll(".game__holeBx");
const holes = document.querySelectorAll(".game__hole");
const scoreText = document.querySelector(".game__score");
const timeText = document.querySelector(".game__time");
const currentScoreText = document.querySelector('.game__currentScore');
const maxScoreText = document.querySelector('.game__maxScore');
const hammer = document.querySelector('.hammer__bx');
const startBtn = document.querySelector('.game__startBtn');
const startBx = document.querySelector('.game__startBx');

let currentRandomHole;
let score = 0;
let maxScore = 0;
let initialTime = 4;
let time = initialTime;


window.addEventListener('load', () => {
    let loadedMaxScore = localStorage.getItem("holeMaxScore");

    if(loadedMaxScore !== null && loadedMaxScore !== 0){
        maxScore = loadedMaxScore;

        maxScoreText.innerText = maxScore;
    }
})



startBtn.addEventListener('click', () => {
    startBx.style.display = "none";
    hammer.style.display = "block";

    document.body.style.cursor = "none";
    
    gameLoop();
    timeLoop();
})

window.addEventListener('mousedown', () => {
    hammer.animate(
        {
            rotate: "-50deg"
        },
        {
            duration: 100,
            fill: "forwards"
        }
    )
})

window.addEventListener('mouseup', () => {
    hammer.animate(
        {
            rotate: "0deg"
        },
        {
            duration: 100,
            fill: "forwards"
        }
    )
})


holeBxs.forEach((holeBx, index) => {
    holeBx.addEventListener('click', () => {
        if(index === currentRandomHole){
            score += 10;

            scoreText.innerText = score;

            holes[currentRandomHole].style.display = "none";
            currentRandomHole = undefined;
        }
    })
})


function randomNum(max){
    return Math.floor(Math.random() * max);
}


let gameLoopInterval,
    timeLoopInterval;

function gameLoop(){
    gameLoopInterval = setInterval(() => {
        if(currentRandomHole !== undefined) holes[currentRandomHole].style.display = "none";

        currentRandomHole = randomNum(9);

        holes[currentRandomHole].style.display = "block";
    }, 1000);
}

function timeLoop(){
    timeLoopInterval = setInterval(() => {
        time--;

        timeText.innerText = time;

        if(time <= 0){
            endGame();
        }
    }, 1000);
}

function endGame(){
    clearInterval(timeLoopInterval);
    clearInterval(gameLoopInterval);

    if(currentRandomHole !== undefined) holes[currentRandomHole].style.display = "none";

    currentScoreText.innerText = score;

    if(maxScore < score){
        maxScore = score;
    
        maxScoreText.innerText = maxScore;
        
        localStorage.setItem("holeMaxScore", maxScore);
    }

    startBx.style.display = "flex";
    hammer.style.display = "none";

    document.body.style.cursor = "auto";

    time = initialTime;
    timeText.innerText = time;

    score = 0;
    scoreText.innerText = score;
}


let mouseX,
    mouseY;

function hammerMove(){
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        hammer.style.left = `${mouseX}px`;
        hammer.style.top = `${mouseY}px`;
    })
}

hammerMove();