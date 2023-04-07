import shuffle from "./shuffle.js";
// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
const reviewPage = document.getElementById('review-page')
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
console.log('bescore', bestScores)
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
const wrongBtn = document.querySelector('.wrong');
const rightBtn = document.querySelector('.right');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const remarkEl = document.querySelector('.remark')
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
// Review Page
const reviewEl = document.querySelector('.review-container');

// Equations
let questionAmount;
let equationsArray = [];
let bestScoresArray = [];

// Game Page
let firstNumber;
let secondNumber;
let equationObject = {};
let playerAnswersArray = [];
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0
let rightAnswersNum = 0;
let wrongAnswersNum = 0;
let finalTime = 0;

// Answers
let correctAns = []
let wrongAns = []

let questionAmountMultiplier;


   // Reset times
const resetTimes = () => {
    timePlayed = 0
    rightAnswersNum = 0;
    wrongAnswersNum = 0;
    finalTime = 0;
}
// Best scores to DOM
const bestscoresToDom = () => {
  bestScores.forEach((bestscoreEl, index) => {
      bestscoreEl.textContent = `${bestScoresArray[index].bestScore}🏆`;
  })
}

const updateBestScores = () => {
  bestScoresArray.forEach((score, index) => {
    if(Number(questionAmount) === score.questions) {
      const savedScore = bestScoresArray[index].bestScore;
      if(savedScore === 0 || savedScore < (rightAnswersNum *questionAmountMultiplier)) {
        bestScoresArray[index].bestScore = rightAnswersNum*questionAmountMultiplier;
      }
    }
  })
  bestscoresToDom();
  localStorage.setItem('bestscores', JSON.stringify(bestScoresArray))
  console.log('multiplier',questionAmountMultiplier)
}

const getSavedBestScores = () => {
  if(localStorage.getItem('bestscores')) {
    bestScoresArray = JSON.parse(localStorage.bestscores);
  } else {
    bestScoresArray = [
      {questions: 10, bestScore: rightAnswersNum * 10},
      {questions: 25, bestScore: rightAnswersNum * 4},
      {questions: 50, bestScore: rightAnswersNum * 2},
      {questions: 100, bestScore: rightAnswersNum * 1}
    ]
    localStorage.setItem('bestscores', JSON.stringify(bestScoresArray));
  }
  bestscoresToDom()
}

// Reset and Restart Game
const playAgain = () => {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerAnswersArray = [];
  correctAns = [];
  wrongAns = [];
  valueY = 0;
}

window.playAgain = playAgain;

// Show Score Page
const showScorePage = () => {
  gamePage.hidden = true;
  scorePage.hidden = false;
}

const goBack = () => {
  reviewPage.hidden = true;
  reviewEl.textContent = ''
  scorePage.hidden = false;
}

window.goBack = goBack;

// score to DOM
const scoreToDom = () => {
  const span = document.createElement('span')
  span.textContent = '😊'
  span.classList.add('mood')
  baseTimeEl.textContent = `Correct Answers: ${rightAnswersNum} 👀`;
  penaltyTimeEl.textContent = `Wrong Answers: ${wrongAnswersNum} 👀`;
  finalTimeEl.textContent = `${finalTime}s`
  remarkEl.textContent = `You earned ${rightAnswersNum * questionAmountMultiplier} points`
  remarkEl.appendChild(span)
  itemContainer.scrollTo({top: 0, behavior: 'instant'})
  showScorePage();
  updateBestScores();
}

// check if all question has been visited to stop timer and display score page
  const stopTimer = () => {
    if(playerAnswersArray.length === Number(questionAmount)) {
      console.log('playerAsnwers', playerAnswersArray)
      clearInterval(timer);
      // Tracking back questions and classifying wrongly and correctly answerd one's
      equationsArray.forEach((equation, i) => {
        if(playerAnswersArray[i] === equation.evaluated) {
          correctAns.push(`${equation.value} 💬 You Chose ${playerAnswersArray[i]}`);
          rightAnswersNum +=1;
        } else {
          wrongAns.push(`${equation.value} 💬 You Chose ${playerAnswersArray[i]}`)
          wrongAnswersNum +=1;
        }
      })
      finalTime = timePlayed.toFixed(1)

      const populateReview = (answerType) => {
          scorePage.hidden = true;
          reviewPage.hidden = false;
          answerType.forEach((each, i) => {
          const reviewItem = document.createElement('div')
          reviewItem.classList.add('item')
          reviewItem.style.fontSize = '25px';
          reviewItem.textContent = `${i+1}: ${each}`;
          reviewEl.appendChild(reviewItem);
          answerType === correctAns ? 
          reviewItem.style.color = 'green' : reviewItem.style.color = 'red';
          
        })
      }
      baseTimeEl.addEventListener('click', () => {
        populateReview(correctAns)
      })
      penaltyTimeEl.addEventListener('click', () => {
        populateReview(wrongAns)
      })
      scoreToDom()
    }
  }

// count every tenth of a second
const countTenthOfASecond = () => {
  timePlayed += 0.1
  stopTimer()
}

const startTimer = () => {
 resetTimes();
  timer = setInterval(countTenthOfASecond, 100)
  gamePage.removeEventListener('click', startTimer)
}

// Scroll
let valueY = 0
const select = playerAnswer => {
  valueY += 80;
  itemContainer.scroll(0, valueY);
  return playerAnswer ? 
  playerAnswersArray.push('right') : playerAnswersArray.push('wrong')
}

window.select = select;
// Get Random Number up to a certain amount
const getRandomNum = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const showGamePage = () => {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Create Correct/Incorrect Random Equations
const createEquations = () => {
    switch(Number(questionAmount)) {
      case 10: 
        questionAmountMultiplier = 10;
        break;
      case 25: 
        questionAmountMultiplier = 4;
        break;
      case 50:
        questionAmountMultiplier = 2;
        break;
      case 100:
        questionAmountMultiplier = 1;
        break;
      default: 
        return;
    }
    // Randomly choose how many correct equations there should be
    const correctEquations = getRandomNum(questionAmount)
    // Set amount of wrong equations
    const wrongEquations = questionAmount - correctEquations
    // Loop through, multiply random numbers up to 9, push to array
    for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomNum(12)
    secondNumber = getRandomNum(12)
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'right' };
    equationsArray.push(equationObject);
  }

  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomNum(12)
    secondNumber = getRandomNum(12)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomNum(3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'wrong' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray)
  console.log(equationsArray)
}

const equationToDom = () => {
  equationsArray.forEach(equation => {
    const item = document.createElement('div')
    item.classList.add('item');
    const questions = document.createElement('h1');
    questions.textContent = equation.value;
    item.appendChild(questions);
    itemContainer.appendChild(item);
  })
}


// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  showGamePage()
  equationToDom()
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}


const getInputValue = () => {
  let inputValue;
  radioInputs.forEach(input => {
    if(input.checked) {
      inputValue = input.value;
    }
  })
  return inputValue;
}
// Display 3, 2, 1 Go!
const countdownToStart = () => {
 let count = 2;
 countdown.textContent = '3'
 let counter = setInterval(() => {
  if(count > 0) {
    countdown.textContent = count--;
    return;
  } else {
    countdown.textContent = 'Go!'
  }
    clearInterval(counter)
 }, 1000);
}

// navigate from splash page to countdown page
const showCountdownPage = () => {
  splashPage.hidden = true;
  countdownPage.hidden = false;
  countdownToStart()
  setTimeout(() => {
    populateGamePage()
  },4000)
}

const selectQuestionAmount = event => {
  event.preventDefault();
  questionAmount = getInputValue();
  if(questionAmount) {
    showCountdownPage();
  }
}

startForm.addEventListener('click', () => {
  radioContainers.forEach(radioEl => {
    radioEl.checked = false;
    if(radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
      return;
    }
    radioEl.classList.remove('selected-label');
  })
});

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// On Load
getSavedBestScores();