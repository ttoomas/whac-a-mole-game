const gameFieldBx = document.querySelector('.game__fields');

let gameFields = [];

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
    }

    randomField(){
        if(this.currentField !== null){
            gameFields[this.currentField].style.backgroundImage = null;
            gameFields[this.currentField].removeAttribute('data-animal-id');
        }

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

        gameFields[this.currentField].style.backgroundImage = `url(./res/images/animal${this.currentAnimal}.png)`;
        gameFields[this.currentField].setAttribute('data-animal-id', this.currentAnimal);

        setTimeout(() => {
            this.randomField();
        }, randomNumber(this.minTimeInterval, this.maxTimeInterval));
    }
}

const firstField = new Field(500, 1000);
firstField.randomField();

// const secondField = new Field(200, 600);
// secondField.randomField();



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

const eventListener = new EventListener();
eventListener.fieldOnClick();



// Helpers
function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createGameFields(count){
    gameFields = [];

    gameFieldBx.innerText = '';

    for (let i = 0; i < count; i++) {
        let newGameField = document.createElement('div');
        newGameField.classList.add('game__field');

        gameFieldBx.appendChild(newGameField);
        gameFields.push(newGameField);
    }
}