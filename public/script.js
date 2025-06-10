let questions = [];
let currentQuestion = 0;
let score = 0;
let walletConnected = false;

async function fetchQuestions() {
  const res = await fetch("questions.json");
  questions = await res.json();
  displayQuestion();
  updateProgressBar();
}

function displayQuestion() {
  const question = questions[currentQuestion];
  const quizContainer = document.getElementById("quiz");
  const options = question.options
    .map(
      (option, index) =>
        `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
    )
    .join("");

  quizContainer.innerHTML = `
    <h2>${question.question}</h2>
    <div>${options}</div>
  `;
  updateProgressBar();
}

function checkAnswer(selected) {
  if (!walletConnected) {
    alert("Please connect your wallet to answer.");
    return;
  }

  const correct = questions[currentQuestion].answer;
  if (selected === correct) {
    score++;
  }

  logPoints();
  currentQuestion++;

  if (currentQuestion < questions.length) {
    setTimeout(displayQuestion, 300);
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById("quiz").innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your Score: ${score} / ${questions.length}</p>
  `;
  updateProgressBar();
}

function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  const percent = ((currentQuestion / questions.length) * 100).toFixed(2);
  progressBar.style.width = `${percent}%`;
  progressBar.innerText = `${percent}%`;
}

function connectWallet() {
  walletConnected = true;
  document.getElementById("walletStatus").innerText = "Wallet Connected ✅";
}

function logPoints() {
  fetch("/log-points", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ score })
  });
}

window.onload = fetchQuestions;
