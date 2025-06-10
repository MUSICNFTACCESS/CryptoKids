let currentQuestionIndex = 0;
let score = 0;
let quizData = [];

async function startQuiz() {
  try {
    const res = await fetch("questions.json");
    quizData = await res.json();
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById("quiz").style.display = "block";
    document.getElementById("result").innerHTML = "";
    showQuestion();
  } catch (error) {
    console.error("Failed to load quiz data:", error);
  }
}

function showQuestion() {
  const question = quizData[currentQuestionIndex];
  const answers = [...question.answers];
  const correctAnswer = answers[question.correctIndex];
  shuffleArray(answers);
  const randomizedCorrectIndex = answers.indexOf(correctAnswer);
  question.shuffledAnswers = answers;
  question.shuffledCorrectIndex = randomizedCorrectIndex;

  document.getElementById("question").innerHTML = question.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.onclick = () => selectAnswer(index);
    answersDiv.appendChild(btn);
  });
}

function selectAnswer(index) {
  const wallet = window.solana?.publicKey?.toString();
  if (!wallet) {
    alert("Please connect your wallet first.");
    return;
  }

  const question = quizData[currentQuestionIndex];
  const isCorrect = index === question.shuffledCorrectIndex;
  if (isCorrect) score++;

  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    endQuiz(wallet);
  }
}

function endQuiz(wallet) {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").innerHTML = `You scored ${score} out of ${quizData.length}`;

  fetch("/save-points", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, points: score }),
  })
    .then(res => res.json())
    .then(data => console.log("Points saved:", data));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Wallet Connect logic
async function connectWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();
      document.getElementById("wallet-address").innerText = `Wallet: ${response.publicKey}`;
      document.getElementById("connect-wallet").style.display = "none";
      document.getElementById("disconnect-wallet").style.display = "inline-block";
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  } else {
    alert("Phantom Wallet not detected.");
  }
}

function disconnectWallet() {
  if (window.solana?.isPhantom) {
    window.solana.disconnect();
    document.getElementById("wallet-address").innerText = "";
    document.getElementById("connect-wallet").style.display = "inline-block";
    document.getElementById("disconnect-wallet").style.display = "none";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connect-wallet").onclick = connectWallet;
  document.getElementById("disconnect-wallet").onclick = disconnectWallet;
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("splash-screen").style.display = "none";
  document.getElementById("quiz-container").classList.remove("hidden");
  displayQuestion();
});

window.onload = fetchQuestions;
