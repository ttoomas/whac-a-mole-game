const game = document.querySelector('.game');
const gameFieldBx = document.querySelector('.game__fieldContainer');
const timeText = document.querySelector('.game__timeText');
const lvlText = document.querySelector('.game__lvlText');
const ptsText = document.querySelector('.game__ptsText');
const progressText = document.querySelector('.progress__text');
const progressBar = document.querySelector('.progress__bar.progressGreen');
const reachLvlText = document.querySelector('.reach__lvlText');
const reachPtsText = document.querySelector('.reach__ptsText');

const startGameBtn = document.querySelector('.start__btn');
const hammerCursor = document.querySelector('.cursor__hammerBx');
const circleCursorInner = document.querySelector('.circle__inner');
const circleCursorOuter = document.querySelector('.circle__outer');
const activeCircles = document.querySelectorAll('.circleCursor');
const gameCursors = document.querySelector('.game__cursors');

const welcome = document.querySelector('.welcome');
const welcomeBackName = document.querySelector('.welcomeBackName');
const preloadCover = document.querySelector('.preloadCover');

let mousePos = {
    x: 0,
    y: 0
};

let screenSize = {
    width: document.body.clientWidth,
    height: document.body.clientHeight 
};

let hammerSize = {
    width: parseInt(getComputedStyle(hammerCursor).width),
    height: parseInt(getComputedStyle(hammerCursor).height)
};

let circleSize = {
    width: parseInt(getComputedStyle(circleCursorOuter).width),
    height: parseInt(getComputedStyle(circleCursorOuter).height)
}


let gameFields = [];
let animalAnimationTime = 300;

let activeFields = [],
    activeAnimals = [];

let fieldsCount = 9;

let animalTypes = [
    {
        id: 1,
        pointValue: 10
    },
    {
        id: 2,
        pointValue: 7
    },
    {
        id: 3,
        pointValue: 1
    },
    {
        id: 4,
        pointValue: -20
    },
    {
        id: 5,
        pointValue: 5
    }
];

let gameSetting = {
    time: 10,
    currentLvl: 1,
    nextLvlPts: 25,
    activeFieldsCount: 1,
    points: 0,
    allTimePoints: 0,
    playerName: null,
    welcomeSlideshow: false
}

let currentTime;
let currentProgressStep;
let currentProgress = 0;


// Onload get game settings
function onLoadGameSetting(){
    let loadedGameSetting = JSON.parse(localStorage.getItem('moleGameSetting'));

    if(loadedGameSetting === null || !loadedGameSetting.welcomeSlideshow){
        welcome.classList.add('initialActive');
    }

    else{
        welcome.classList.add('backActive');
        welcomeBackName.innerText = loadedGameSetting.playerName;

        gameSetting = loadedGameSetting;

        // Set points and progress bar
        ptsText.innerText = gameSetting.points;

        currentProgressStep = (100 / gameSetting.nextLvlPts);
        currentProgress = currentProgressStep * gameSetting.points;

        progressBar.style.width = `${currentProgress}%`;
    }

    preloadCover.style.display = "none";
}

onLoadGameSetting();

// Game fields
createGameFields(fieldsCount);


class Field{
    constructor(minTimeInterval, maxTimeInterval){
        this.currentField = null;
        this.currentAnimal = null;
        
        this.oldField = null;
        this.oldAnimal = null;
        
        this.minTimeInterval = minTimeInterval;
        this.maxTimeInterval = maxTimeInterval;

        this.fieldInterval = null;
        currentProgressStep = (100 / gameSetting.nextLvlPts);

        this.checkCurrentField();
    }

    checkCurrentField(){
        if(this.currentField !== null){
            gameFields[this.currentField].style.animation = `animalFadeOut ${animalAnimationTime}ms ease-in-out forwards`;
            gameFields[this.currentField].classList.remove('animalActive');
            
            setTimeout(() => {
                gameFields[this.currentField].src = "";
                gameFields[this.currentField].removeAttribute('data-animal-id');

                this.changeField();
            }, animalAnimationTime);
        }
        else{
            this.changeField();
        }        
    }

    changeField(){
        // Change field
        do {
            this.currentField = randomNumber(0, (fieldsCount - 1));
        } while (activeFields.includes(this.currentField));

        if(this.oldField !== null){
            let fieldIndex = activeFields.indexOf(this.oldField);
            activeFields.splice(fieldIndex, 1);
        }

        this.oldField = this.currentField;
        activeFields.push(this.currentField);


        // Change animal
        if(gameSetting.bossLevel){
            this.currentAnimal = 5
        }
        else{
            do {
                this.currentAnimal = randomNumber(1, 4);
            } while ((this.currentAnimal === 4 && gameSetting.points < (animalTypes[3].pointValue * -1)) || (activeAnimals.includes(4) && this.currentAnimal === 4));
        }

        if(this.oldAnimal !== null){
            let animalIndex = activeAnimals.indexOf(this.oldAnimal);
            activeAnimals.splice(animalIndex, 1);
        }

        this.oldAnimal = this.currentAnimal;
        activeAnimals.push(this.currentAnimal);

        gameFields[this.currentField].src = `./res/images/animal${this.currentAnimal}.png`;
        gameFields[this.currentField].setAttribute('data-animal-id', this.currentAnimal);

        gameFields[this.currentField].style.animation = `animalFadeIn ${animalAnimationTime}ms ease-in-out forwards`;
        gameFields[this.currentField].classList.add('animalActive');

        this.fieldInterval = setTimeout(() => {
            this.checkCurrentField();
        }, randomNumber((this.minTimeInterval + animalAnimationTime), (this.maxTimeInterval + animalAnimationTime)));
    }

    deleteInterval(){
        clearInterval(this.fieldInterval);

        gameFields[this.currentField].style.animation = `animalFadeOut ${animalAnimationTime}ms ease-in-out forwards`;
        gameFields[this.currentField].classList.remove('animalActive');
        
        setTimeout(() => {
            gameFields[this.currentField].src = "";
            gameFields[this.currentField].removeAttribute('data-animal-id');

            if(this.oldField !== null){
                let fieldIndex = activeFields.indexOf(this.oldField);
                activeFields.splice(fieldIndex, 1);
            }
    
            if(this.oldAnimal !== null){
                let animalIndex = activeAnimals.indexOf(this.oldAnimal);
                activeAnimals.splice(animalIndex, 1);
            }
        }, animalAnimationTime);
    }
}


class EventListener{
    constructor(){
        this.fieldOnClick();
        this.getMousePos();
        this.hammerOnClick();
        this.activateCircleCursor();
        this.windowResizeSize();
    }

    fieldOnClick(){
        window.addEventListener('click', (e) => {
            if(!e.target.classList.contains('game__field')) return;

            let gameFieldAnimal = e.target.querySelector('.game__animal');

            if(!gameFieldAnimal.classList.contains('animalActive')) return;

            let animalId = gameFieldAnimal.getAttribute('data-animal-id');
            let animalStats = animalTypes[animalId - 1];

            gameSetting.points += animalStats.pointValue;
            gameSetting.allTimePoints += animalStats.pointValue;
            currentProgress += (currentProgressStep * animalStats.pointValue);

            gameFieldAnimal.style.animation = `animalFadeOut ${animalAnimationTime}ms ease-in-out forwards`;
            gameFieldAnimal.classList.remove('animalActive');

            ptsText.innerText = gameSetting.points;
            progressBar.style.width = `${currentProgress}%`;
        })
    }

    getMousePos(){
        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;

            // console.log(e.target.className.includes("circleCursor"));

            this.hammerMove();
            this.circleMove();
        })
    }

    hammerMove(){
        this.hammerSpeed = 150;

        if(
            mousePos.x - (hammerSize.width * 0.8) > 0 &&
            mousePos.x + (hammerSize.width * 0.8) < screenSize.width
        ){
            hammerCursor.animate(
                {
                    left: `${mousePos.x - (hammerSize.width / 2)}px`,
                },
                {
                    duration: this.hammerSpeed,
                    fill: "forwards"
                }
            )
        }

        if(
            mousePos.y - (hammerSize.height * 0.8) > 0 &&
            mousePos.y + (hammerSize.height * 0.8) < screenSize.height
        ){
            hammerCursor.animate(
                {
                    top: `${mousePos.y - (hammerSize.height / 2)}px`
                },
                {
                    duration: this.hammerSpeed,
                    fill: "forwards"
                }
            )
        }
    }

    hammerOnClick(){
        window.addEventListener('mousedown', () => {
            if(currentCursor !== 0){
                hammerCursor.animate(
                    {
                        transform: "rotate(-52deg)"
                    },
                    {
                        duration: 150,
                        fill: "forwards",
                        easing: "ease-in-out"
                    }
                )
            }
        })

        window.addEventListener('mouseup', () => {
            if(currentCursor !== 0){
                hammerCursor.animate(
                    {
                        transform: "rotate(0deg)"
                    },
                    {
                        duration: 150,
                        fill: "forwards",
                        easing: "ease-in-out"
                    }
                )
            }
        })
    }

    circleMove(){
        this.circleSpeed = 500;

        if(
            mousePos.x - (circleSize.width / 2) > 0 &&
            mousePos.x + (circleSize.width / 2) < screenSize.width
        ){
            circleCursorInner.style.left = `${mousePos.x}px`;

            circleCursorOuter.animate(
                {
                    left: `${mousePos.x}px`
                },
                {
                    duration: this.circleSpeed,
                    fill: "forwards"
                }
            )
        }


        if(
            mousePos.y - (circleSize.height / 2) > 0 &&
            mousePos.y + (circleSize.height / 2) < screenSize.height
        ){
            circleCursorInner.style.top = `${mousePos.y}px`;

            circleCursorOuter.animate(
                {
                    top: `${mousePos.y}px`
                },
                {
                    duration: this.circleSpeed,
                    fill: "forwards"
                }
            )
        }
    }

    activateCircleCursor(){
        activeCircles.forEach((circle) => {
            circle.addEventListener('mouseenter', () => {
                circleCursorInner.classList.add('circleHoverActive');
            })

            circle.addEventListener('mouseleave', () => {
                circleCursorInner.classList.remove('circleHoverActive');
            })
        })
    }

    windowResizeSize(){
        window.addEventListener('resize', () => {
            screenSize = {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        })
    }
}

new EventListener();



// Start game
let gameInterval;
let testField;
let fieldsArr = [];

startGameBtn.addEventListener('click', () => {
    startGame();
    changeCursor();
})

function startGame(){
    document.body.classList.add('gameActive');

    if(gameSetting.bossLevel){
        // Boss level

        game.classList.add('bossLevel');

        for (let i = 0; i < 8; i++) {
            let minTime = randomNumber(100, 800);
            let maxTime;

            do {
                maxTime = randomNumber(400, 1500);
            } while (maxTime <= (minTime + 150))

            console.log(minTime, maxTime);

            fieldsArr.push(new Field(minTime, maxTime));
        }

        currentTime = 10;
        timeText.innerText = currentTime;
    }
    
    else{
        lvlText.innerText = gameSetting.currentLvl;
        reachPtsText.innerText = gameSetting.nextLvlPts;
        reachLvlText.innerText = (gameSetting.currentLvl + 1);

        game.classList.add('normalLevel');
    
        for (let i = 0; i < gameSetting.activeFieldsCount; i++) {
            fieldsArr.push(new Field(500, 600));
        }
    
        currentTime = gameSetting.time;
        timeText.innerText = currentTime;
    }

    gameInterval = setInterval(() => {
        currentTime--;

        timeText.innerText = currentTime;

        if(currentTime <= 0){
            endGame();
            changeCursor();
        }
    }, 1000);
}

function endGame(){
    clearInterval(gameInterval);

    fieldsArr.forEach(field => {
        field.deleteInterval();
    });

    fieldsArr = [];

    resetGameVar();

    document.body.classList.remove('gameActive');
}

function resetGameVar(){
    if(gameSetting.bossLevel) bossLevelUp();
    else if(gameSetting.points >= gameSetting.nextLvlPts) levelUp();

    currentTime = gameSetting.time;
    timeText.innerText = currentTime    
    
    localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));
}

// LVL
// LVL 1 - NORMAL   LVL 2 - NORMAL  LVL 3 - BOSS, ONLY ONE SPECIAL ANIMAL, FASTER GAME, NO NEED TO LEVEL UP
function levelUp(){
    // Deduct points
    gameSetting.points -= gameSetting.nextLvlPts;

    ptsText.innerText = gameSetting.points;

    // Lvl UP
    gameSetting.currentLvl++;
    gameSetting.nextLvlPts += Math.ceil(gameSetting.nextLvlPts / 5) * 2;

    lvlText.innerText = gameSetting.currentLvl;
    reachPtsText.innerText = gameSetting.nextLvlPts;
    reachLvlText.innerText = (gameSetting.currentLvl + 1);

    // Set progress bar
    currentProgressStep = (100 / gameSetting.nextLvlPts);
    currentProgress = currentProgressStep * gameSetting.points;

    progressBar.style.width = `${currentProgress}%`;

    // Boss
    if(gameSetting.currentLvl % 3 === 0){
        gameSetting.bossLevel = true;
    }
}

function bossLevelUp(){
    // Lvl UP
    gameSetting.currentLvl++;

    lvlText.innerText = gameSetting.currentLvl;
    reachLvlText.innerText = (gameSetting.currentLvl + 1);

    // Set progress bar
    currentProgressStep = (100 / gameSetting.nextLvlPts);
    currentProgress = currentProgressStep * gameSetting.points;

    progressBar.style.width = `${currentProgress}%`;

    // Boss
    gameSetting.bossLevel = false;

    gameSetting.activeFieldsCount++;
    gameSetting.time += Math.ceil(gameSetting.time / 5) * 2;
}



// Helpers
function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createGameFields(count){
    gameFields = [];

    gameFieldBx.innerText = '';

    for (let i = 0; i < count; i++) {
        let newGameFieldHtml = `
            <div class="game__field">
                <img src="" alt="" class="game__animal" draggable="false">
                <div class="game__block">
                    <img src="./res/images/block-half-top.png" alt="" class="block__top" draggable="false">
                    <img src="./res/images/block-half-bottom.png" alt="" class="block__bottom" draggable="false">
                </div>
            </div>
        `;

        gameFieldBx.insertAdjacentHTML('beforeend', newGameFieldHtml);
    }

    gameFields = gameFieldBx.querySelectorAll('.game__animal');
}


let currentCursor = 0;

function changeCursor(){
    if(currentCursor === 0){
        // Hammer
        currentCursor = 1;

        gameCursors.classList.remove('circleActive');
        gameCursors.classList.add('hammerActive');
    }
    else{
        // Circle
        currentCursor = 0;

        gameCursors.classList.remove('hammerActive');
        gameCursors.classList.add('circleActive');
    }
}


// WELCOME SECTION - SLIDESHOW
const welcomeContainers = document.querySelectorAll('.welcomeContainer');
const welcomeNextBtns = document.querySelectorAll('.welcomeNextBtn');
const welcomeNameInput = document.querySelector('.welcomeNameInput');

welcomeNextBtns.forEach((welcomeBtn, index) => {
    welcomeBtn.addEventListener('click', () => {
        // Name input
        if(welcomeContainers[index].classList.contains('welcomeName')){
            if(welcomeNameInput.value.length >= 2){
                welcomeNameInput.classList.remove('nameInputErr');

                gameSetting.playerName = welcomeNameInput.value;
                // Save to localstorage
                welcomeContainers[index].style.animation = "welcomeSlideOut 200ms ease-in-out forwards";
                welcomeContainers[index + 1].style.animation = "welcomeSlideIn 200ms ease-in-out forwards";

                console.log(gameSetting);
            }
            else{
                welcomeNameInput.classList.add('nameInputErr');
            }
        }

        // Last slide
        else if(welcomeContainers[index].classList.contains('welcomeEndSlideshow')){
            console.log("last slide");

            gameSetting.welcomeSlideshow = true;
            localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));

            welcomeContainers[index].style.animation = "welcomeSlideOut 200ms ease-in-out forwards";
            setTimeout(() => {
                welcome.style.display = "none";
            }, 200);
        }

        else{
            welcomeContainers[index].style.animation = "welcomeSlideOut 200ms ease-in-out forwards";
            welcomeContainers[index + 1].style.animation = "welcomeSlideIn 200ms ease-in-out forwards";
        }
    })
})

const welcomeBackBtn = document.querySelector('.welcomeBackBtn');
const welcomeBack = document.querySelector('.welcomeBack');

welcomeBackBtn.addEventListener('click', () => {
    welcomeBack.style.animation = "welcomeSlideOut 200ms ease-in-out forwards";

    setTimeout(() => {
        welcome.style.display = "none";
    }, 200);
})