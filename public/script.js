let currentQuestionIndex = 0;
let score = 0;
let questions = [];

fetch("questions.json")
  .then((res) => res.json())
  .then((data) => {
    questions = shuffle(data);
  });

function startQuiz() {
  document.getElementById("splash-screen").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const questionObj = questions[currentQuestionIndex];
  document.getElementById("question").innerText = questionObj.question;

  const optionsList = document.getElementById("options");
  optionsList.innerHTML = "";

  shuffle([...questionObj.options]).forEach((option, index) => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => checkAnswer(option, questionObj);
    optionsList.appendChild(li);
  });
}

function checkAnswer(selected, questionObj) {
  const correctAnswer = questionObj.options[questionObj.correct];
  if (selected === correctAnswer) {
    score++;
  }
  document.querySelectorAll("li").forEach((el) => {
    el.onclick = null;
    el.style.pointerEvents = "none";
    if (el.textContent === correctAnswer) {
      el.style.backgroundColor = "#28a745";
    } else if (el.textContent === selected) {
      el.style.backgroundColor = "#dc3545";
    }
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById("quiz-container").innerHTML =
      "<h2>Quiz Completed!</h2><p>Your score: " + score + " / " + questions.length + "</p>";
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
