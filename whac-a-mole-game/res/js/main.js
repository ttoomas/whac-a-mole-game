const holeBxs = document.querySelectorAll(".game__holeBx");
const holes = document.querySelectorAll(".game__hole");
const scoreText = document.querySelector(".game__score");

let currentRandomHole;
let score = 0;


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

// gameLoop();