const game = document.querySelector('.game');
const gameFieldBx = document.querySelector('.game__fieldContainer');
const timeText = document.querySelector('.game__timeText');
const lvlText = document.querySelector('.game__lvlText');
const ptsText = document.querySelector('.game__ptsText');
const progressText = document.querySelector('.progress__text');
const progressBar = document.querySelector('.progress__bar.progressGreen');
const reachLvlText = document.querySelector('.reach__lvlText');
const reachPtsText = document.querySelector('.reach__ptsText');

const startGameBtn = document.querySelector('.battle__btn');
const hammerCursor = document.querySelector('.cursor__hammerBx');
const circleCursor = document.querySelector('.cursor__circleBx');
const circleCursorInner = document.querySelector('.circle__inner');
const circleCursorOuter = document.querySelector('.circle__outer');
const activeCircles = document.querySelectorAll('.circleCursor');
const gameCursors = document.querySelector('.game__cursors');

const levelStatText = document.querySelector('.stat__text.levelText');
const timeStatText = document.querySelector('.stat__text.timeText');
const nextLvlPtsStatText = document.querySelector('.stat__text.nextLvlPtsText');
const currPtsStatText = document.querySelector('.stat__text.currPtsText');
const allTimePtsStatText = document.querySelector('.stat__text.allTimePtsText');
const xpCountText = document.querySelector('.stat__text.xpCountText');
const bossLevelsStatText = document.querySelector('.stat__text.bossLevelsText');

const renameInput = document.querySelector('.rename__input');
const settingCircleBtn = document.querySelector('.settingCircleBtn');
const settingHammerBtn = document.querySelector('.settingHammerBtn');
const homeNameText = document.querySelector('.setting__name');
const settingNameText = document.querySelector('.setting__nameText');

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

let huntersInfo = [
    {
        name: "Thorvald the Hammerer"
    },
    {
        name: "Bjorn the Crusher"
    },
    {
        name: "Olaf the Smasher"
    },
    {
        name: "Sven the Destroyer"   
    }
]

let gameSetting = {
    time: 10,
    currentLvl: 1,
    nextLvlPts: 25,
    activeFieldsCount: 1,
    points: 0,
    allTimePoints: 0,
    xp: 0,
    bossLevelsCount: 0,
    playerName: null,
    welcomeSlideshow: false,
    circleCursor: true,
    hammerCursor: true
}

let initialGameSetting = {
    time: 10,
    currentLvl: 1,
    nextLvlPts: 25,
    activeFieldsCount: 1,
    points: 0,
    allTimePoints: 0,
    xp: 0,
    bossLevelsCount: 0,
    playerName: null,
    welcomeSlideshow: false,
    circleCursor: true,
    hammerCursor: true
}

let currentTime;
let currentProgressStep;
let currentProgress = 0;


// Onload get game settings
let isSettingLoaded = false;

function onLoadGameSetting(){
    let loadedGameSetting = JSON.parse(localStorage.getItem('moleGameSetting'));

    if(loadedGameSetting === null || !loadedGameSetting.welcomeSlideshow){
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
let testField;
let fieldsArr = [];

startGameBtn.addEventListener('click', () => {
    startGame();
    changeCursor();
})

function startGame(){
    document.body.classList.add('gameActive');
    document.body.classList.remove('activeHome');

    if(gameSetting.bossLevel){
        // Boss level

        game.classList.add('bossLevel');

        for (let i = 0; i < 5; i++) {
            let minTime = randomNumber(100, 1000);
            let maxTime;

            do {
                maxTime = randomNumber(500, 1500);
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
    updateStatsText();

    document.body.classList.remove('gameActive');
    document.body.classList.add('activeHome');
}

function resetGameVar(){
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
    allTimePtsStatText.innerText = gameSetting.allTimePoints;
    xpCountText.innerText = gameSetting.xp;
    bossLevelsStatText.innerText = gameSetting.bossLevelsCount;

    homeNameText.innerText = gameSetting.playerName;
    settingNameText.innerText = gameSetting.playerName;
    renameInput.value = gameSetting.playerName;
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
    gameSetting.bossLevelsCount++;

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
})

shopLeaveBtn.addEventListener('click', () => {
    document.body.classList.remove('activeShop');
    document.body.classList.add('activeHome');
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