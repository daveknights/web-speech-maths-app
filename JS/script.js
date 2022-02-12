const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
                        'fifteen','sixteen', 'seventeen', 'eighteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty'];
const grammar = `#JSGF V1.0; grammar numberWords; public <answer> = ${numberWords.join(' | ')}`;
const recognition = new SpeechRecognition();

const form = document.querySelector('form');
const firstNum = document.querySelector('.first-number');
const secondNum = document.querySelector('.second-number');
const operator = document.querySelector('.operator');
const answerText = document.querySelector('.answer');
const answerBtn = document.querySelector('.answer-btn');
const nextBtn = document.querySelector('.next-btn');

const divisions = [[[8,6,4], 2], [[9,6], 3], [[8], 4]];
const digits = [2,3,4,5,6,7,8,9];
const operators = ['+', '*', '-', '/'];
let answer = '';

const displaySymbols = {
    '*': '&times;',
    '/': '&#247;',
}

const checkAnswer = guess => {
    if (guess === answer) {
        form.classList.add('correct');
        answerText.innerHTML = `&check; That's right, ${answer}`;
    } else {
        form.classList.add('wrong');
        answerText.textContent = `X No the answer was, ${answer}`;
    }
};

recognition.onresult = event => {
    const guess = event.results[0][0].transcript;

    checkAnswer(guess);
};

recognition.onspeechend = () => recognition.stop();

const shuffle = (arrToShuffle, minus=false) => {
    const length = minus === true ? 2 : 1;

    return arrToShuffle
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value).slice(0,length);
};

const getQuestion = () => {
    form.classList.remove('correct', 'wrong');
    answerText.textContent = '';

    const symbol = shuffle(operators);

    switch (symbol[0]) {
        case '-':
            nums = shuffle(digits, true).sort().reverse();
            firstNum.value = nums[0];
            secondNum.value = nums[1];
            break;
        case '/':
            const divisionNums = shuffle(divisions);
            firstNum.value = shuffle(divisionNums[0][0]);
            secondNum.value = divisionNums[0][1];
            break;
        default:
            firstNum.value = shuffle(digits);
            secondNum.value = shuffle(digits);
    }

    operator.innerHTML = symbol[0] in displaySymbols ? displaySymbols[symbol[0]] :  symbol;

    answer = eval(`${firstNum.value}${symbol}${secondNum.value}`).toString();
};

const init = () => {
    if (!('webkitSpeechRecognition' in window)) {
        answerText.textContent = 'Sorry, Web Speech is not available on this device';
    } else {
        if (window.SpeechGrammarList) {
            const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
            const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
            const speechRecognitionList = new SpeechGrammarList();

            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
            recognition.continuous = false;
            recognition.lang = 'en-GB';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
        }

        answerBtn.addEventListener('click', () => {
            form.classList.remove('correct', 'wrong');
            answerText.textContent = '';
            recognition.start();
        });
        nextBtn.addEventListener('click', getQuestion);

        // get initial digits
        getQuestion();
    }
};

window.addEventListener('load', init);
