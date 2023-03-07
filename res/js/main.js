const game = document.querySelector('.game');
const gameFieldBx = document.querySelector('.game__fieldContainer');
const timeText = document.querySelector('.game__timeText');
const ptsText = document.querySelector('.game__ptsText');
const progressText = document.querySelector('.progress__text');
const progressBar = document.querySelector('.progress__bar.progressGreen');

const startGameBtn = document.querySelector('.battle__btn');
const hammerCursor = document.querySelector('.cursor__hammerBx');
const circleCursor = document.querySelector('.cursor__circleBx');
const circleCursorInner = document.querySelector('.circle__inner');
const circleCursorOuter = document.querySelector('.circle__outer');
let activeCircles = document.querySelectorAll('.circleCursor');
const gameCursors = document.querySelector('.game__cursors');

const levelStatText = document.querySelector('.stat__text.levelText');
const timeStatText = document.querySelector('.stat__text.timeText');
const nextLvlPtsStatText = document.querySelector('.stat__text.nextLvlPtsText');
const currPtsStatText = document.querySelector('.stat__text.currPtsText');
const coinCountText = document.querySelector('.stat__text.coinCountText');
const shopCoinCountText = document.querySelector('.res__coin');

const renameInput = document.querySelector('.rename__input');
const settingCircleBtn = document.querySelector('.settingCircleBtn');
const settingHammerBtn = document.querySelector('.settingHammerBtn');
const homeNameText = document.querySelector('.setting__name');
const settingNameText = document.querySelector('.setting__nameText');

const welcome = document.querySelector('.welcome');
const welcomeBackName = document.querySelector('.welcomeBackName');
const preloadCover = document.querySelector('.preloadCover');
const homeShop = document.querySelector('.home__shop');

const lvlPopup = document.querySelector('.popup__levelUp');
const lvlPopupCurrLvl = document.querySelector('.lvl__currLevel');
const lvlPopupNextLvl = document.querySelector('.lvl__nextLevel');
const lvlPopupNextLvlPts = document.querySelector('.lvl__nextLevelPts');
const lvlPopupGainPts = document.querySelector('.levelGetPts')
const lvlPopupGainCoins = document.querySelector('.levelGetCoins')
const endGamePopup = document.querySelector('.popup__endGame');
const endPopupGainPts = document.querySelector('.endGameGetPts');
const endPopupGainCoins = document.querySelector('.endGameGetCoins');

const endGamePopCounts = document.querySelectorAll('.pop__count.endGamePopCount');
const levelPopCounts = document.querySelectorAll('.pop__count.levelPopCount');
const introPopup = document.querySelector('.popup__intro');
const introPopupNextLvlCoins = document.querySelector('.intro__needCoins');

const infoAllTimePoints = document.querySelector('.allTimePtsText');
const infoBossLevels = document.querySelector('.bossLevelsText');
const infoAnimalCounts = document.querySelectorAll('.animal__count');

const shop = document.querySelector('.shop');
const homeHunterName = document.querySelector('.shopHunter__name');
const homeHunterImg = document.querySelector('.shopHunter__img');
const shopHunters = document.querySelectorAll('.shop__hunter');
const shopHunterCosts = document.querySelectorAll('.hunter__cost');
const shopHunterBtns = document.querySelectorAll('.hunter__btn');

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

let gameAnimalsCount = [0, 0, 0, 0, 0];
let gamePointsCount = 0;
let gameCoinsCount = 0;

let fieldsCount = 9;
let isLvlUp = false;

let animalTypes = [
    {
        id: 1,
        pointValue: 10,
        coinValue: 1
    },
    {
        id: 2,
        pointValue: 5,
        coinValue: 0
    },
    {
        id: 3,
        pointValue: 1,
        coinValue: 0
    },
    {
        id: 4,
        pointValue: -20,
        coinValue: 0
    },
    {
        id: 5,
        pointValue: 0,
        coinValue: 2
    }
];

let huntersInfo = [
    {
        id: 1,
        name: "Thorvald the Hammerer",
        coinsValue: 0
    },
    {
        id: 2,
        name: "Bjorn the Crusher",
        coinsValue: 25
    },
    {
        id: 3,
        name: "Olaf the Smasher",
        coinsValue: 50
    },
    {
        id: 4,
        name: "Sven the Destroyer",
        coinsValue: 100
    }
]

let gameSetting = {
    time: 10,
    currentLvl: 1,
    nextLvlPts: 25,
    activeFieldsCount: 1,
    points: 0,
    allTimePoints: 0,
    coins: 0,
    ownHunters: [1],
    currentHunter: 1,
    bossLevelsCount: 0,
    playerName: null,
    welcomeSlideshow: false,
    circleCursor: true,
    hammerCursor: true,
    levelAnimalCount: [0, 0, 0, 0, 0],
    levelPointsCount: 0,
    levelCoinsCount: 0,
    gameAnimalCount: [0, 0, 0, 0, 0]
}

let initialGameSetting = {
    time: 10,
    currentLvl: 1,
    nextLvlPts: 25,
    activeFieldsCount: 1,
    points: 0,
    allTimePoints: 0,
    coins: 0,
    ownHunters: [1],
    currentHunter: 1,
    bossLevelsCount: 0,
    playerName: null,
    welcomeSlideshow: false,
    circleCursor: true,
    hammerCursor: true,
    levelAnimalCount: [0, 0, 0, 0, 0],
    levelPointsCount: 0,
    levelCoinsCount: 0,
    gameAnimalCount: [0, 0, 0, 0, 0]
}

let currentTime;
let currentProgressStep;
let currentProgress = 0;


// Onload get game settings
let isSettingLoaded = false;

function onLoadGameSetting(){
    let loadedGameSetting = JSON.parse(localStorage.getItem('moleGameSetting'));

    if(loadedGameSetting === null || !loadedGameSetting.welcomeSlideshow || loadedGameSetting.length !== initialGameSetting.length){
        localStorage.removeItem('moleGameSetting');
        welcome.classList.add('initialActive');
    }

    else{
        welcome.classList.add('backActive');
        welcomeBackName.innerText = loadedGameSetting.playerName;

        gameSetting = loadedGameSetting;
        isSettingLoaded = true;

        updateStatsText();

        // Set points and progress bar
        ptsText.innerText = gameSetting.points;

        currentProgressStep = (100 / gameSetting.nextLvlPts);
        currentProgress = currentProgressStep * gameSetting.points;

        progressBar.style.width = `${currentProgress}%`;

        // Update setting
        if(!gameSetting.circleCursor){
            // Disable circle cursor, change shop btn text
            circleCursor.style.display = "none";

            circleCursorInner.style.scale = 0;
            circleCursorOuter.style.scale = 0;

            document.body.classList.remove('disabledCursor');
            settingCircleBtn.innerText = "Enable Circle Cursor";

            setTimeout(() => {
                circleCursor.style.display = "block";
            }, 300);
        }

        if(!gameSetting.hammerCursor){
            // Disable circle cursor, change shop btn text
            game.style.cursor = "auto";
            hammerCursor.style.display = "none";

            settingHammerBtn.innerText = "Enable Hammer Cursor";
        }
    }

    updateHunters();
    preloadCover.style.display = "none";
}

onLoadGameSetting();

// Game fields
createGameFields(fieldsCount);

let fieldIntervals = [];
let currentGameEnded = false;
let currentResetActive = false;


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
        if(currentGameEnded){
            if(!currentResetActive) resetGameFields();

            return;
        }

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

        setTimeout(() => {
            this.checkCurrentField();
        }, randomNumber((this.minTimeInterval + animalAnimationTime), (this.maxTimeInterval + animalAnimationTime)));
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
            gameSetting.coins += animalStats.coinValue;
            currentProgress += (currentProgressStep * animalStats.pointValue);

            gameAnimalsCount[animalId - 1]++;
            gameSetting.gameAnimalCount[animalId - 1]++;
            gamePointsCount += animalStats.pointValue;
            gameCoinsCount += animalStats.coinValue;

            gameSetting.levelAnimalCount[animalId - 1]++;
            gameSetting.levelPointsCount += animalStats.pointValue;
            gameSetting.levelCoinsCount += animalStats.coinValue;

            gameFieldAnimal.style.animation = `animalFadeOut ${animalAnimationTime}ms ease-in-out forwards`;
            gameFieldAnimal.classList.remove('animalActive');

            ptsText.innerText = gameSetting.points;
            progressBar.style.width = `${currentProgress}%`;
        })
    }

    getMousePos(){
        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.pageX;
            mousePos.y = e.pageY;

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

                if(circle.classList.contains('smallCursor')) circleCursorInner.classList.add('circleSmall');
            })

            circle.addEventListener('mouseleave', () => {
                circleCursorInner.classList.remove('circleHoverActive');
                
                if(circle.classList.contains('smallCursor')) circleCursorInner.classList.remove('circleSmall');
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

startGameBtn.addEventListener('click', () => {
    setGame();
    changeCursor();
})

function setGame(){
    currentGameEnded = false;

    if(gameSetting.bossLevel){
        // Boss level
        game.classList.remove('normalLevel');
        game.classList.add('bossLevel');

        introPopup.style.animation = "fadeIn 300ms ease-in-out forwards";
        introPopup.classList.remove('introNormal');
        introPopup.classList.add('introBoss');
        startIntroAnimation();

        if(gameSetting.currentHunter === 2){
            currentTime = 15;
        }
        else{
            currentTime = 10;
        }

        timeText.innerText = currentTime;
    }
    
    else{
        game.classList.add('normalLevel');
        game.classList.remove('bossLevel');

        introPopupNextLvlCoins.innerText = (gameSetting.nextLvlPts - gameSetting.points);

        introPopup.style.animation = "fadeIn 300ms ease-in-out forwards";
        introPopup.classList.add('introNormal');
        introPopup.classList.remove('introBoss');
        startIntroAnimation();
    
        currentTime = gameSetting.time;

        if(gameSetting.currentHunter === 2){
            currentTime += 5;
        }

        timeText.innerText = currentTime;
    }

    setTimeout(() => {
        document.body.classList.add('gameActive');
        document.body.classList.remove('activeHome');
    }, 300);
}

function startGame(){
    if(gameSetting.bossLevel){
        for (let i = 0; i < 5; i++) {
            let minTime = randomNumber(100, 1000);
            let maxTime;

            do {
                maxTime = randomNumber(500, 1500);
            } while (maxTime <= (minTime + 150))

            new Field(minTime, maxTime);
        }
    }
    else{
        for (let i = 0; i < gameSetting.activeFieldsCount; i++) {
            new Field(500, 600);
        }
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
    showEndGamePopup();
    updateAnimalCountStats();
    updateStatsText();

    setTimeout(() => {
        clearInterval(gameInterval);
    
        currentGameEnded = true;
        currentResetActive = true;
    
        activeFields = [];
        activeAnimals = [];
    
        setTimeout(() => {
            resetGameFields();
            currentResetActive = false;
        }, animalAnimationTime);
    
        resetGameVar();
        updateHunters();
    }, 300);
}


function resetGameFields(){
    gameFields.forEach((field) => {
        field.src = "";
        field.removeAttribute('data-animal-id');
        field.style.animation = `animalFadeOut ${animalAnimationTime}ms ease-in-out forwards`;
        field.classList.remove('activeAnimal');
    })
}


function resetGameVar(){
    isLvlUp = false;

    if(gameSetting.bossLevel) bossLevelUp();
    else if(gameSetting.points >= gameSetting.nextLvlPts) levelUp();

    currentTime = gameSetting.time;
    timeText.innerText = currentTime    
    
    localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));
}

function updateStatsText(){
    levelStatText.innerText = gameSetting.currentLvl;
    timeStatText.innerText = gameSetting.time;
    nextLvlPtsStatText.innerText = gameSetting.nextLvlPts;
    currPtsStatText.innerText = gameSetting.points;
    // allTimePtsStatText.innerText = gameSetting.allTimePoints;
    // bossLevelsStatText.innerText = gameSetting.bossLevelsCount;
    
    homeNameText.innerText = gameSetting.playerName;
    settingNameText.innerText = gameSetting.playerName;
    renameInput.value = gameSetting.playerName;

    coinCountText.innerText = gameSetting.coins;
    shopCoinCountText.innerText = gameSetting.coins;

    infoAllTimePoints.innerText = gameSetting.allTimePoints;
    infoBossLevels.innerText = gameSetting.bossLevelsCount;
    infoAnimalCounts.forEach((info, index) => {
        info.innerText = gameSetting.gameAnimalCount[index];
    })
}

function showEndGamePopup(){
    endGamePopup.style.animation = "fadeIn 300ms ease-in-out forwards";
}

function updateAnimalCountStats(){
    if(gameSetting.bossLevel){
        endGamePopup.classList.add('bossLevel');
        endGamePopup.classList.remove('normalLevel');
    }
    else{
        endGamePopup.classList.remove('bossLevel');
        endGamePopup.classList.add('normalLevel');
    }

    gameAnimalsCount.forEach((animal, index) => {
        endGamePopCounts[index].innerText = animal;
    })

    endPopupGainPts.innerText = gamePointsCount;
    endPopupGainCoins.innerText = gameCoinsCount;

    gameAnimalsCount = [0, 0, 0, 0, 0];

    gamePointsCount = 0;
    gameCoinsCount = 0;
}

// LVL
// LVL 1 - NORMAL   LVL 2 - NORMAL  LVL 3 - BOSS, ONLY ONE SPECIAL ANIMAL, FASTER GAME, NO NEED TO LEVEL UP
function levelUp(){
    isLvlUp = true;

    // Deduct points
    gameSetting.points -= gameSetting.nextLvlPts;

    ptsText.innerText = gameSetting.points;

    // Lvl UP
    gameSetting.currentLvl++;
    gameSetting.nextLvlPts += Math.ceil(gameSetting.nextLvlPts / 5) * 2;

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
    isLvlUp = true;

    // Lvl UP
    gameSetting.currentLvl++;

    // Set progress bar
    currentProgressStep = (100 / gameSetting.nextLvlPts);
    currentProgress = currentProgressStep * gameSetting.points;

    progressBar.style.width = `${currentProgress}%`;

    // Boss
    gameSetting.bossLevel = false;
    gameSetting.bossLevelsCount++;

    if(gameSetting.activeFieldsCount < 5){
        gameSetting.activeFieldsCount++;
    }

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
            }
            else{
                welcomeNameInput.classList.add('nameInputErr');
            }
        }

        // Last slide
        else if(welcomeContainers[index].classList.contains('welcomeEndSlideshow')){
            console.log("last slide");

            gameSetting.welcomeSlideshow = true;

            if(!isSettingLoaded){
                localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));
            }

            updateStatsText();

            welcomeContainers[index].style.animation = "welcomeSlideOut 200ms ease-in-out forwards";
            setTimeout(() => {
                welcome.style.display = "none";
                
                welcome.classList.remove('initialActive');
                document.body.classList.remove('helpActive');

                welcomeContainers.forEach((container) => {
                    container.style.animation = "";
                })
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

        welcome.classList.remove('backActive');
        welcomeBack.style.animation = "";
    }, 200);
})


// HUNTER Shop
const homeShopBtn = document.querySelector('.shop__btn');
const shopLeaveBtn = document.querySelector('.shop__leave');

homeShopBtn.addEventListener('click', () => {
    document.body.classList.add('activeShop');
    document.body.classList.remove('activeHome');

    screenSize = {
        width: shop.clientWidth,
        height: shop.clientHeight
    };
})

shopLeaveBtn.addEventListener('click', () => {
    document.body.classList.remove('activeShop');
    document.body.classList.add('activeHome');

    screenSize = {
        width: document.body.clientWidth,
        height: document.body.clientHeight 
    };
})

// HELP Icon
const helpIcon = document.querySelector('.help__icon');

helpIcon.addEventListener('click', () => {
    welcome.style.display = "grid";
    document.body.classList.add('helpActive');

    welcome.classList.add('initialActive');
})

// SETTING
// Open and close
const settingIcon = document.querySelector('.setting__icon');
const leaveSettingIcon = document.querySelector('.setting__leaveIcon');

settingIcon.addEventListener('click', () => {
    document.body.classList.remove('activeHome');
    document.body.classList.add('activeSetting');
})

leaveSettingIcon.addEventListener('click', () => {
    document.body.classList.add('activeHome');
    document.body.classList.remove('activeSetting');
})

// Each setting
const settingRenameBtn = document.querySelector('.settingRenameBtn');
const cancelRenameBtn = document.querySelector('.rename__cancelBtn');
const confirmRenameBtn = document.querySelector('.rename__confirmBtn');
const settingResetBtn = document.querySelector('.settingResetBtn');
const cancelResetBtn = document.querySelector('.reset__cancelBtn');
const confirmResetBtn = document.querySelector('.reset__confirmBtn');

const settingRenameContainer = document.querySelector('.setting__renameContainer');
const settingResetContainer = document.querySelector('.setting__resetContainer');

settingRenameBtn.addEventListener('click', () => {
    settingRenameContainer.style.animation = "fadeIn 300ms ease-in-out forwards";
    setTimeout(() => {
        renameInput.focus();
        
    }, 100);
})

cancelRenameBtn.addEventListener('click', () => {
    settingRenameContainer.style.animation = "fadeOut 300ms ease-in-out forwards";
})

confirmRenameBtn.addEventListener('click', () => {
    if(renameInput.value.length <= 2){
        renameInput.classList.add('inputErr');
    }
    else{
        renameInput.classList.remove('inputErr');

        gameSetting.playerName = renameInput.value;
        localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));
        
        updateStatsText();

        settingRenameContainer.style.animation = "fadeOut 300ms ease-in-out forwards";
    }
})

settingCircleBtn.addEventListener('click', () => {
    if(gameSetting.circleCursor){
        // Disable
        circleCursorInner.style.scale = 0;
        circleCursorOuter.style.scale = 0;

        gameSetting.circleCursor = false;
        settingCircleBtn.disabled = true;

        localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));
        
        setTimeout(() => {
            document.body.classList.remove('disabledCursor');

            settingCircleBtn.innerText = "Enable Circle Cursor";
        }, 200);

        setTimeout(() => {
            settingCircleBtn.disabled = false;
        }, 300);
    }
    else{
        // Enable
        circleCursorInner.style.scale = 1;
        circleCursorOuter.style.scale = 1;

        gameSetting.circleCursor = true;
        localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));

        document.body.classList.add('disabledCursor');
        settingCircleBtn.disabled = true;

        setTimeout(() => {
            settingCircleBtn.innerText = "Disable Circle Cursor";
            
            settingCircleBtn.disabled = false;
        }, 300);
    }
})

settingHammerBtn.addEventListener('click', () => {
    if(gameSetting.hammerCursor){
        // Disable
        game.style.cursor = "auto";
        hammerCursor.style.display = "none";

        gameSetting.hammerCursor = false;
        localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));

        settingHammerBtn.innerText = "Enable Hammer Cursor";
    }
    else{
        // Enable
        game.style.cursor = "none";
        hammerCursor.style.display = "block";

        gameSetting.hammerCursor = true;
        localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));

        settingHammerBtn.innerText = "Disable Hammer Cursor";
    }
})

settingResetBtn.addEventListener('click', () => {
    settingResetContainer.style.animation = "fadeIn 300ms ease-in-out forwards";
})

cancelResetBtn.addEventListener('click', () => {
    settingResetContainer.style.animation = "fadeOut 300ms ease-in-out forwards";
})

confirmResetBtn.addEventListener('click', () => {
    localStorage.removeItem('moleGameSetting');
    isSettingLoaded = false;

    gameSetting = initialGameSetting;

    settingResetContainer.style.animation = "";

    document.body.classList.add('activeHome');
    document.body.classList.remove('activeSetting');

    welcome.style.display = "grid";
    welcome.classList.add('initialActive');
})


// Helper - Update hunters (current, shop btns)
function updateHunters(){
    homeHunterName.innerText = huntersInfo[gameSetting.currentHunter - 1].name;
    homeHunterImg.src = `./res/images/hunter${huntersInfo[gameSetting.currentHunter - 1].id}.png`;
    homeShop.className = 'home__shop';
    homeShop.classList.add(`hunterID${gameSetting.currentHunter}`);

    shopHunters.forEach((hunter, index) => {
        shopHunterBtns[index].classList.remove('hunterSelected');
        hunter.classList.remove('hunterChoose');

        shopHunterCosts[index].innerText = `${huntersInfo[index].coinsValue} Coins`;

        if(gameSetting.ownHunters.includes(huntersInfo[index].id)){
            // Owns it
            hunter.classList.remove('hunterGreen');
            hunter.classList.remove('hunterRed');
            
            if(gameSetting.currentHunter === huntersInfo[index].id){
                // Selected
                shopHunterBtns[index].innerText = "Selected";
                shopHunterBtns[index].setAttribute('data-shop-btn-status', 1);

                shopHunterBtns[index].classList.add('hunterSelected');
                shopHunterBtns[index].classList.remove('circleCursor');
            }
            else{
                // Can select
                shopHunterBtns[index].innerText = "Select";
                shopHunterBtns[index].setAttribute('data-shop-btn-status', 2);

                hunter.classList.add('hunterChoose');

                shopHunterBtns[index].classList.add('circleCursor');
            }
        }
        else if(gameSetting.coins >= huntersInfo[index].coinsValue){
            // can buy
            hunter.classList.add('hunterGreen');
            hunter.classList.remove('hunterRed');

            shopHunterBtns[index].innerText = "Buy";
            shopHunterBtns[index].setAttribute('data-shop-btn-status', 3);

            shopHunterBtns[index].classList.add('circleCursor');

        }
        else{
            // can't buy
            hunter.classList.remove('hunterGreen');
            hunter.classList.add('hunterRed');

            shopHunterBtns[index].innerText = "Buy";
            shopHunterBtns[index].setAttribute('data-shop-btn-status', 4);

            shopHunterBtns[index].classList.remove('circleCursor');
        }
    })

    activeCircles = document.querySelectorAll('.circleCursor');

    // Animals bonuses
    animalTypes[0].pointValue = 10;
    animalTypes[1].pointValue = 7;
    animalTypes[2].pointValue = 1;
    animalTypes[3].pointValue = -20;

    if(gameSetting.currentHunter === 3){
        animalTypes[3].pointValue = -10;
    }
    else if(gameSetting.currentHunter === 4){
        animalTypes[0].pointValue = 15;
        animalTypes[1].pointValue = 12;
        animalTypes[2].pointValue = 3;
    }
}

// Shop - buy hunters
// Statuses - 1: selected; 2: can select; 3: can buy; 4: can't buy;
shopHunterBtns.forEach((hunterBtn, index) => {
    hunterBtn.addEventListener('click', () => {
        let btnStatus = parseInt(hunterBtn.getAttribute('data-shop-btn-status'));


        // Select Hunter
        if(btnStatus === 2 && gameSetting.ownHunters.includes(huntersInfo[index].id)){
            gameSetting.currentHunter = huntersInfo[index].id;

            updateHunters();

            localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));
        }

        // Buy and select hunter
        else if(btnStatus === 3 && gameSetting.coins >= huntersInfo[index].coinsValue){
            gameSetting.coins -= huntersInfo[index].coinsValue;
            gameSetting.ownHunters.push(huntersInfo[index].id);
            gameSetting.currentHunter = huntersInfo[index].id;

            coinCountText.innerText = gameSetting.coins;
            shopCoinCountText.innerText = gameSetting.coins;

            updateHunters();

            localStorage.setItem('moleGameSetting', JSON.stringify(gameSetting));
        }
    })
})

// POPUPs
const lvlPopupLeaveBtn = document.querySelector('.lvl__continue');
const endGamePopupLeaveBtn = document.querySelector('.end__continue');

lvlPopupLeaveBtn.addEventListener('click', () => {
    lvlPopup.style.animation = "fadeOut 300ms ease-in-out forwards";
})

endGamePopupLeaveBtn.addEventListener('click', () => {
    endGamePopup.style.animation = "fadeOut 300ms ease-in-out forwards";

    document.body.classList.remove('gameActive');
    document.body.classList.add('activeHome');

    if(isLvlUp){
        updateAnimalCountLevelStats();

        // lvl popup
        preloadCover.style.display = "block";

        lvlPopupCurrLvl.innerText = gameSetting.currentLvl;
        lvlPopupNextLvl.innerText = gameSetting.currentLvl + 1;
        lvlPopupNextLvlPts.innerText = gameSetting.nextLvlPts;

        setTimeout(() => {
            lvlPopup.style.animation = "fadeIn 300ms ease-in-out forwards";

            setTimeout(() => {
                preloadCover.style.display = "none";
            }, 300);
        }, 300);
    }
})

function updateAnimalCountLevelStats(){
    gameSetting.levelAnimalCount.forEach((animal, index) => {
        levelPopCounts[index].innerText = animal;
    })

    lvlPopupGainPts.innerText = gameSetting.levelPointsCount;
    lvlPopupGainCoins.innerText = gameSetting.levelCoinsCount;

    gameSetting.levelAnimalCount = [0, 0, 0, 0, 0];
    gameAnimalsCount = [0, 0, 0, 0, 0];

    gameSetting.levelPointsCount = 0;
    gameSetting.levelCoinsCount = 0;
}


// Popup intro
const normalIntroTexts = document.querySelectorAll('.intro__container.introNormalLevel .intro__text');
const bossIntroTexts = document.querySelectorAll('.intro__container.introBossLevel .intro__text');

let introIndex = 0;
let currentIntroTexts;
let currentSpeed = 0;

function startIntroAnimation(){
    introIndex = 0;
    currentSpeed = 0;

    if(introPopup.classList.contains('introNormal')) currentIntroTexts = normalIntroTexts;
    else currentIntroTexts = bossIntroTexts;

    introInterval();
}

function introInterval(){
    setTimeout(() => {
        currentSpeed = parseInt(currentIntroTexts[introIndex].getAttribute('data-ani-speed'));
        
        currentIntroTexts[introIndex].style.animation = `introFade ${currentSpeed}ms linear`;

        introIndex++

        if(introIndex !== currentIntroTexts.length) introInterval();

        else {
            setTimeout(() => {
                introPopup.style.animation = `fadeOut ${(currentSpeed / 100) * 30}ms ease-in-out forwards`;
            }, (currentSpeed / 100) * 70);

            setTimeout(() => {
                startGame();

                currentIntroTexts.forEach((text) => {
                    text.style.animation = "";
                })

                introPopup.style.animation = "";
            }, currentSpeed + 200);
        }
    }, currentSpeed + 200);
}

// startIntroAnimation();

// Info section
const openGameInfo = document.querySelector('.setting__info');
const leaveInfo = document.querySelector('.info__leave');
const info = document.querySelector('.info');

openGameInfo.addEventListener('click', () => {
    info.style.animation = "fadeIn 300ms ease-in-out forwards";
})

leaveInfo.addEventListener('click', () => {
    info.style.animation = "fadeOut 300ms ease-in-out forwards";
})