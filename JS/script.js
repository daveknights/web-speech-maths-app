const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
                        'fifteen','sixteen', 'seventeen', 'eighteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty'];
const grammar = `#JSGF V1.0; grammar numberWords; public <answer> = ${numberWords.join(' | ')}`;
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

const form = document.querySelector('form');
const firstNum = document.querySelector('.first-number');
const secondNum = document.querySelector('.second-number');
const operator = document.querySelector('.operator');
const answerText = document.querySelector('.answer');
const answerBtn = document.querySelector('.answer-btn');
const nextBtn = document.querySelector('.next-btn');

const digits = [2,3,4,5,6,7,8,9];
const operators = ['+', '*'];
let answer = '';

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

const shuffle = arrToShuffle => arrToShuffle
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value).slice(0,1);

const getQuestion = () => {
    form.classList.remove('correct', 'wrong');
    answerText.textContent = '';

    firstNum.value = shuffle(digits);
    secondNum.value = shuffle(digits);
    const symbol = shuffle(operators);

    operator.innerHTML = symbol[0] === '*' ? '&times;' :  symbol;

    answer = eval(`${firstNum.value}${symbol}${secondNum.value}`).toString();
};

const init = () => {
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    answerBtn.addEventListener('click', () => {
        form.classList.remove('correct', 'wrong');
        answerText.textContent = '';
        recognition.start();
    });
    nextBtn.addEventListener('click', getQuestion);

    // get initial digits
    getQuestion();
};

window.addEventListener('load', init);
