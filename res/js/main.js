const gameFieldBx = document.querySelector('.game__fieldContainer');

let gameFields = [];
let animalAnimationTime = 300;

let activeFields = [],
    activeAnimals = [];

let points = 0;
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
    }
]

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
        do {
            this.currentAnimal = randomNumber(1, 4);
        } while ((this.currentAnimal === 4 && points < (animalTypes[3].pointValue * -1)) || (activeAnimals.includes(4) && this.currentAnimal === 4));

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

            console.log("Interval deleted successfully");
        }, animalAnimationTime);
    }
}

const firstField = new Field(1000, 1200);
new Field(400, 600);

setTimeout(() => {
    console.log('y');

    firstField.deleteInterval();
}, 4000);


class EventListener{
    constructor(){
        this.fieldOnClick();
    }

    fieldOnClick(){
        window.addEventListener('click', (e) => {
            if(!e.target.classList.contains('game__field')) return;

            let gameFieldAnimal = e.target.querySelector('.game__animal');

            if(!gameFieldAnimal.classList.contains('animalActive')) return;

            let animalId = gameFieldAnimal.getAttribute('data-animal-id');
            let animalStats = animalTypes[animalId - 1];

            points += animalStats.pointValue;

            gameFieldAnimal.style.animation = `animalFadeOut ${animalAnimationTime}ms ease-in-out forwards`;
            gameFieldAnimal.classList.remove('animalActive');

            console.log(points);
        })
    }
}

const eventListener = new EventListener();



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