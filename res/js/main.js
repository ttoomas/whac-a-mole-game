const gameFieldBx = document.querySelector('.game__fieldContainer');

let gameFields = [];
let animalAnimationTime = 300;

let activeFields = [];
let points = 0;

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

createGameFields(9);


class Field{
    constructor(minTimeInterval, maxTimeInterval){
        this.currentField = null;
        this.oldField = null;
        this.currentAnimal = null;

        this.minTimeInterval = minTimeInterval;
        this.maxTimeInterval = maxTimeInterval;

        this.checkCurrentField();
    }

    checkCurrentField(){
        if(this.currentField !== null){
            gameFields[this.currentField].style.animation = `animalFadeOut ${animalAnimationTime}ms ease-in-out forwards`;
            
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
        do {
            this.currentField = randomNumber(0, 8);
        } while (activeFields.includes(this.currentField));

        let fieldIndex = activeFields.indexOf(this.oldField);
        activeFields.splice(fieldIndex, 1);

        this.oldField = this.currentField;
        activeFields.push(this.currentField);


        do {
            this.currentAnimal = randomNumber(1, 4);
        } while (this.currentAnimal === 4 && points < (animalTypes[3].pointValue * -1))

        gameFields[this.currentField].src = `./res/images/animal${this.currentAnimal}.png`;
        gameFields[this.currentField].setAttribute('data-animal-id', this.currentAnimal);

        gameFields[this.currentField].style.animation = `animalFadeIn ${animalAnimationTime}ms ease-in-out forwards`;

        setTimeout(() => {
            this.checkCurrentField();
        }, randomNumber(this.minTimeInterval, this.maxTimeInterval));
    }
}

const firstField = new Field(700, 1200);


// const secondField = new Field(200, 600);
// secondField.checkCurrentField();



class EventListener{
    fieldOnClick(){
        window.addEventListener('click', (e) => {
            if(!e.target.classList.contains('game__field') || !e.target.style.backgroundImage) return;

            let animalId = e.target.getAttribute('data-animal-id');
            let animalStats = animalTypes[animalId - 1];

            points += animalStats.pointValue;

            e.target.style.backgroundImage = null;

            console.log(points);
        })
    }
}

// const eventListener = new EventListener();
// eventListener.fieldOnClick();



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