const holeBxs = document.querySelectorAll(".game__holeBx");
const holes = document.querySelectorAll(".game__hole");
const scoreText = document.querySelector(".game__score");
const hammer = document.querySelector('.hammer__bx');

let currentRandomHole;
let score = 0;



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


let gameLoopInterval;

function gameLoop(){
    gameLoopInterval = setInterval(() => {
        if(currentRandomHole !== undefined) holes[currentRandomHole].style.display = "none";

        currentRandomHole = randomNum(9);

        holes[currentRandomHole].style.display = "block";
    }, 1000);
}

gameLoop();


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