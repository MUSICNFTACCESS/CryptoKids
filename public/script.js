let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timerInterval;
const TIME_PER_QUESTION = 15; // seconds

fetch("questions.json").then(res => res.json()).then(data => {
  questions = shuffle(data);
});

function startQuiz() {
  document.getElementById("splash-screen").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  resetTimer();
  startTimer();

  const questionObj = questions[currentQuestionIndex];
  document.getElementById("question").innerText = questionObj.question;

  updateProgress();

  const optionsList = document.getElementById("options");
  optionsList.innerHTML = "";

  shuffle([...questionObj.options]).forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => checkAnswer(option, questionObj);
    optionsList.appendChild(li);
  });
}

function checkAnswer(selected, questionObj) {
  clearInterval(timerInterval);

  const correctAnswer = questionObj.options[questionObj.correct];

  document.querySelectorAll("li").forEach(el => {
    el.onclick = null;
    if (el.textContent === correctAnswer) {
      el.classList.add("correct");
    } else if (el.textContent === selected) {
      el.classList.add("incorrect");
    }
  });

  if (selected === correctAnswer) {
    score++;
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById("score-container").classList.remove("hidden");
    document.getElementById("score").innerText = `${score}/${questions.length}`;
    document.getElementById("next-btn").classList.add("hidden");
    document.getElementById("question").classList.add("hidden");
    document.getElementById("options").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
  }
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

function startTimer() {
  let timeLeft = TIME_PER_QUESTION;
  document.getElementById("time-left").textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
