let questions = [];
let currentQuestion = 0;
let score = 0;
let walletConnected = false;

async function fetchQuestions() {
  const res = await fetch("questions.json");
  questions = await res.json();
  updateProgressBar();
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("splash-screen").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  displayQuestion();
}

function displayQuestion() {
  const question = questions[currentQuestion];
  const quizContainer = document.getElementById("quiz");
  const options = question.options
    .map((option, index) =>
      `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
    )
    .join("");

  quizContainer.innerHTML = `
    <h2>${question.question}</h2>
    <div>${options}</div>
    <div id="progressBar" class="section"></div>
    <div id="wallet-status" class="section"></div>
    <button onclick="disconnectWallet()">Disconnect Wallet</button>
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
    <button onclick="window.location.reload()">Play Again</button>
  `;
  updateProgressBar();
}

function updateProgressBar() {
  const percent = ((currentQuestion / questions.length) * 100).toFixed(0);
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
    progressBar.innerText = `${percent}%`;
  }
}

function connectWallet() {
  walletConnected = true;
  document.getElementById("wallet-status").innerText = "Wallet Connected ✅";
}

function disconnectWallet() {
  walletConnected = false;
  document.getElementById("wallet-status").innerText = "Wallet Disconnected ❌";
}

function logPoints() {
  fetch("/log-points", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  }).then(res => res.json()).catch(console.error);
}

window.onload = fetchQuestions;
