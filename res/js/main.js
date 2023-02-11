const gameFields = document.querySelectorAll('.game__field');

let activeFields = [];


class Field{
    constructor(minTimeInterval, maxTimeInterval){
        this.currentField = null;
        this.oldField = null;
        this.currentAnimal = null;

        this.minTimeInterval = minTimeInterval;
        this.maxTimeInterval = maxTimeInterval;
    }

    randomField(){
        if(this.currentField !== null) gameFields[this.currentField].style.backgroundImage = null;

        do {
            this.currentField = randomNumber(0, 8);
        } while (activeFields.includes(this.currentField));

        let fieldIndex = activeFields.indexOf(this.oldField);
        activeFields.splice(fieldIndex, 1);

        this.oldField = this.currentField;
        activeFields.push(this.currentField);


        this.currentAnimal = randomNumber(1, 4);

        gameFields[this.currentField].style.backgroundImage = `url(./res/images/animal${this.currentAnimal}.png)`;

        setTimeout(() => {
            this.randomField();
        }, randomNumber(this.minTimeInterval, this.maxTimeInterval));
    }
}

const firstField = new Field(600, 1000);
firstField.randomField();

const secondField = new Field(200, 600);
secondField.randomField();



function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}