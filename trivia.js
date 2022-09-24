document.addEventListener('DOMContentLoaded', main);
let i = 30;
let score = 0;
let question = '';
let res = '';
let data = '';

function main(){
    // set basic scene and add event
    document.querySelector('#container').style.backgroundColor = "RGB(238, 216, 213, 0.9)";

    const startBtn = document.querySelector('.triviaStart');
    startBtn.addEventListener('click', clickStart);
}

// handle clickStart
async function clickStart(evt){
    function countDown(){
        // show Time
        const timer = setInterval(() => {
            i --;
            time.textContent = i;
            if (i === 0){
                clearInterval(timer);
                endGame();
                document.querySelector('.triviaGame').style.display = 'none';
                const finalScore = createGameObj('label', 'finalScore', '.gameTriviaDiv');
                finalScore.textContent = 'YOU GOT ' + score;
            }
        }, 1000);
    }
    function setGameStartScene(){
        const imgHint = createGameObj('div', 'imgHint');
        const img = createGameObj('img', 'imgHintSrc', '.imgHint');
        const yearHint = createGameObj('label', 'yearHint');
        const platformHint = createGameObj('label', 'platformHint');
    
        const choiceA = createGameObj('div', 'choiceADiv');
        choiceA.addEventListener('click', clickA);
        const choiceAText = createGameObj('label', 'choiceA','.choiceADiv');
    
        const choiceB = createGameObj('div', 'choiceBDiv');
        choiceB.addEventListener('click', clickB);
        const choiceBText = createGameObj('label', 'choiceB', '.choiceBDiv');
    
        const choiceC = createGameObj('div', 'choiceCDiv');
        choiceC.addEventListener('click', clickC);
        const choiceCText = createGameObj('label', 'choiceC', '.choiceCDiv');
    
        const choiceD = createGameObj('div', 'choiceDDiv');
        choiceD.addEventListener('click', clickD);
        const choiceDText = createGameObj('label', 'choiceD','.choiceDDiv');
    }

    function clickA(evt){
        question.check(0, score);
        showBoard.textContent = 'Score: ' + score;
    }
    
    function clickB(evt){
        question.check(1, score);
        showBoard.textContent = 'Score: ' + score;
    }
    
    function clickC(evt){
        question.check(2, score);
        showBoard.textContent = 'Score: ' + score;
    }
    
    function clickD(evt){
        question.check(3, score);
        showBoard.textContent = 'Score: ' + score;
    }

    // prevent defult 
    evt.preventDefault();
    // set up scene
    createGameObj('div', 'triviaGame', '.gameTriviaDiv');
    const time = createGameObj('label', 'time');
    // board
    document.querySelector('.settingUpTriviaDiv').style.display = 'none';
    time.textContent = i;
    const showBoard = createGameObj('label', 'showBoard');
    showBoard.textContent = 'Score: ' + score;

    // game hints
    setGameStartScene();

    // generate game
    getQuestion();

    // handle countDown
    countDown();

}

async function getQuestion(){
    res = await fetch(window.location.href + '/game');
    data = await res.json();
    // console.log(data);
    question = new gameQuestion(data);
    question.show();

}


function endGame(){
    const restartBtn = createGameObj('button', 'restartBtn', '.gameTriviaDiv');
    restartBtn.innerHTML = 'RESTART';
    restartBtn.addEventListener('click', restart);
}

function restart(evt){
    evt.preventDefault();
    location.reload(true);
}

function createGameObj(type, cla, mom){
    const obj = document.createElement(type);
    obj.classList.add(cla);
    if (mom){
        document.querySelector(mom).appendChild(obj);

    } else {
        document.querySelector('.triviaGame').appendChild(obj);
    }
    return obj;
}

class gameQuestion{
    constructor(info){
        this.game = info.game;
        this.choices = info.choices;
        this.yearHint = info.yearHint;
        this.platformHint = info.platformHint;
        this.imgHint = info.imgHint;
        this.src = info.src;
        this.refer = ['A', 'B', 'C', 'D'];
        this.correct = 0;
    }

    shuffleChoices(){
        for (let i = 3; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]];
        }

        for (const i in this.choices){
            if(this.choices[i] === this.game.name){
                this.correct = i;
                break;
            }
        }
    }

    generateChoices(){
        document.querySelector('.choiceA').textContent = 'A. ' + this.choices[0];
        document.querySelector('.choiceB').textContent = 'B. ' + this.choices[1];
        document.querySelector('.choiceC').textContent = 'C. ' + this.choices[2];
        document.querySelector('.choiceD').textContent = 'D. ' + this.choices[3];
    }

    generateHint(){
        document.querySelector('.yearHint').textContent = this.yearHint;
        document.querySelector('.platformHint').textContent = this.platformHint;
        const img = document.querySelector('.imgHintSrc');
        img.src = this.src;
        img.style.height = 300 + 150 * (4 - this.imgHint) + 'px';
        img.style.width = 300 + 150 * (4 - this.imgHint) + 'px';

        img.style.left = -Math.floor(Math.random() * (100 + 150 * (4 - this.imgHint)))+ 'px';
        img.style.top = -Math.floor(Math.random() * (150 + 150 * (4 - this.imgHint)))+ 'px';
        // console.log(img.style.left, img.style.top);
    }

    show(){
        this.shuffleChoices();
        this.generateChoices();
        this.generateHint();

    }

    check(num){
        if (this.choices[num] !== this.game.name){
            document.querySelector('.choice'+ this.refer[num]+ 'Div').style.backgroundColor = 'red';
            document.querySelector('.choice'+ this.refer[this.correct]+ 'Div').style.backgroundColor = 'rgb(44, 187, 63)';
            const no = setInterval(() => {
                clearInterval(no);
                document.querySelector('.choice'+ this.refer[num]+ 'Div').style.backgroundColor = 'rgb(238, 98, 110)';
                document.querySelector('.choice'+ this.refer[this.correct]+ 'Div').style.backgroundColor = 'rgb(238, 98, 110)';
                document.querySelector('.imgHintSrc').remove();
                createGameObj('img', 'imgHintSrc', '.imgHint');
                getQuestion();
            }, 1500);
        } else{
            document.querySelector('.choice'+ this.refer[num]+ 'Div').style.backgroundColor = 'rgb(44, 187, 63)';
            score ++;
            const yes = setInterval(() => {
                clearInterval(yes);
                document.querySelector('.choice'+ this.refer[num]+ 'Div').style.backgroundColor = 'rgb(238, 98, 110)';
                document.querySelector('.imgHintSrc').remove();
                createGameObj('img', 'imgHintSrc', '.imgHint');
                getQuestion();

            }, 500);
        }
    }

}

