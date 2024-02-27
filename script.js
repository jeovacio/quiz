import questions from "./questions.js"

const totalQuestions = questions.length
const totalDuration = 120
let timer
let currentIndex = 0
let questionsCorrect = 0
let timeRemaining = totalDuration
let quizCompleted = false
let participantName = ''

const question = document.querySelector(".question")
const answers = document.querySelector(".answers")
const spnQtd = document.querySelector(".spnQtd")
const content = document.querySelector(".content")
const contentFinish = document.querySelector(".finish")
const btnRestart = document.querySelector(".finish button")
const scoreImageContainer = document.querySelector(".score-image-container")

function startTimer() {
  timer = setInterval(() => {
    timeRemaining--
    if (timeRemaining <= 0) {
      clearInterval(timer)
      timeRemaining = 0
      finish()
    } else {
      updateTimerDisplay()
    }
  }, 1000)
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  spnQtd.innerHTML = `Tempo restante: ${formattedTime} | Pergunta ${currentIndex + 1}/${totalQuestions}`
}

function resetTimer() {
  clearInterval(timer)
  updateTimerDisplay()
  if (!quizCompleted && timeRemaining > 0) {
    startTimer()
  }
}

function nextQuestion() {
  resetTimer()

  const selectedAnswer = document.querySelector(".answer-btn.selected");
  const isCorrect = selectedAnswer ? selectedAnswer.dataset.correct === "true" : false

  if (isCorrect) {
    questionsCorrect++
  }

  if (currentIndex < totalQuestions - 1) {
    currentIndex++
    loadQuestion()
  } else {
    finish()
  }
}

function finish() {
  clearInterval(timer)
  quizCompleted = true

  const formattedTotalTime = formatTime(totalDuration - timeRemaining)

  const percentageCorrect = ((questionsCorrect / totalQuestions) * 100).toFixed(2);
  const message = `Você acertou ${questionsCorrect} de ${totalQuestions} (${percentageCorrect}%) em ${formattedTotalTime}`;
  document.querySelector(".finish span").innerHTML = message;
  content.style.display = "none"
  contentFinish.style.display = "flex"

  
  const score = parseFloat(percentageCorrect);

  
  const imageUrl = getScoreImageUrl(questionsCorrect);

  
  const image = document.createElement("img")
  image.src = imageUrl
  image.alt = "Score Image"
  scoreImageContainer.appendChild(image)

  
  const quizResults = JSON.parse(localStorage.getItem('quizResults')) || []
  const result = {
    participant: participantName,
    correctAnswers: questionsCorrect,
    totalQuestions: totalQuestions,
    percentageCorrect: percentageCorrect,
    totalTime: formattedTotalTime,
    imageUrl: imageUrl
  }
  quizResults.push(result);
  localStorage.setItem('quizResults', JSON.stringify(quizResults))
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function loadQuestion() {
  const item = questions[currentIndex]
  answers.innerHTML = ""
  question.innerHTML = item.question

  const answersContainer = document.querySelector(".answers")

  item.answers.forEach((answer, index) => {
    const div = document.createElement("div")

    div.className = "answer"
    div.innerHTML = `
      <button class="answer-btn" data-correct="${answer.correct}">
        ${answer.imageUrl ? `<img src="${answer.imageUrl}" alt="Opção de Resposta" data-correct="${answer.correct}">` : answer.option}
      </button>
    `

    if (!answer.imageUrl) {
      div.classList.add("text-answer")
    }

    if (index === 0 || index === 2) {
      div.classList.add("start-new-line")
    }

    answersContainer.appendChild(div)
  });

  document.querySelectorAll(".answer-btn").forEach((item) => {
    item.addEventListener("click", function() {
      this.classList.add("selected")
      nextQuestion()
    })
  })
}

btnRestart.onclick = () => {
  window.location.href = 'score.html'
};


participantName = localStorage.getItem('participantName')

if (quizCompleted) {
  finish()
} else {
  loadQuestion()
  startTimer()
}


function getScoreImageUrl(questionsCorrect) {
  if (questionsCorrect === 1) {
    return "gato.jpeg";
  } else if (questionsCorrect === 2) {
    return "jessica.jpg";
  } else if (questionsCorrect === 3) {
    return "lisa.jpg";
  } else if (questionsCorrect === 4) {
    return "oxe.jpg";
  } else if (questionsCorrect === 5) {
    return "cao.jpg";
  } else if (questionsCorrect === 6) {
    return "joelma.jpg";
  } else if (questionsCorrect === 7) {
    return "oscar.jpg";
  } else {
    return "lula.jpg";
  }
}
