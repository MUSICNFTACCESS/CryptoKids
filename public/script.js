let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
const TIME_PER_QUESTION = 15;

async function loadQuestions() {
  try {
    const res = await fetch('/questions.json');
    questions = await res.json();
    if (!questions.length) throw new Error("Empty question set");
    document.getElementById('start-btn').disabled = false;
  } catch (err) {
    console.error('Error loading questions:', err);
    document.getElementById("question").innerText = "Failed to load quiz.";
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  resetTimer();
  const q = questions[currentQuestionIndex];
  if (!q) {
    document.getElementById("question").innerText = "No question found.";
    return;
  }

  const shuffledOptions = shuffle([...q.options]);
  const correctIndex = shuffledOptions.indexOf(q.options[q.correct]);

  document.getElementById("question").innerText = q.question;
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  shuffledOptions.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(i === correctIndex);
    optionsContainer.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

function selectAnswer(correct) {
  if (correct) score++;
  document.getElementById("next-btn").classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerInterval);
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");
  document.getElementById("score").innerText = `You scored ${score} out of ${questions.length}`;

  const prev = parseInt(localStorage.getItem("cryptokids_points") || "0");
  localStorage.setItem("cryptokids_points", prev + score);

  const wallet = localStorage.getItem("walletAddress");
  if (wallet) {
    fetch("/save-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, points: score })
    }).then(res => res.json()).then(data => {
      console.log("Points saved:", data);
    });
  }

  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("question").classList.add("hidden");
  document.getElementById("options").classList.add("hidden");
  document.getElementById("timer").classList.add("hidden");
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) progressBar.style.width = `${progress}%`;
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

async function connectWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect({ onlyIfTrusted: false });
      const walletAddress = resp.publicKey.toString();
      localStorage.setItem("walletAddress", walletAddress);
      const status = document.getElementById("wallet-status");
      if (status) {
        status.innerText = `✅ Points saved to wallet: ${walletAddress}`;
        status.style.color = "#00ff00";
      }
    } catch (err) {
      alert("Wallet connection failed.");
      console.error("Phantom connection error:", err);
    }
  } else {
    alert("Phantom Wallet not detected. Please open this page in the Phantom browser.");
  }
}

// Call loader when DOM ready
document.addEventListener("DOMContentLoaded", loadQuestions);
