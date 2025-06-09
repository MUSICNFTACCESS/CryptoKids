let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
const TIME_PER_QUESTION = 15;

async function loadQuestions() {
  try {
    const res = await fetch("/questions.json");
    questions = await res.json();
    if (!questions.length) throw new Error("Empty question set");
    document.querySelector("button[onclick='startQuiz()']").disabled = false;
  } catch (err) {
    console.error("Error loading questions:", err);
    document.getElementById("question").innerText = "Failed to load questions.";
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("splash-screen").classList.add("hidden");
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
  document.querySelector("button[onclick='nextQuestion()']").classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    document.querySelector("button[onclick='nextQuestion()']").classList.add("hidden");
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerInterval);
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("score-container").classList.remove("hidden");
  document.getElementById("score").innerText = score;

  let prev = parseInt(localStorage.getItem("cryptokids_points") || "0");
  localStorage.setItem("cryptokids_points", prev + score);

  if (window.connectedWallet) {
    fetch("/save-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: window.connectedWallet, points: score })
    }).then(res => res.json())
      .then(data => console.log("Saved:", data))
      .catch(err => console.error("Failed to save points:", err));
  }
}

function startTimer() {
  let timeLeft = TIME_PER_QUESTION;
  document.getElementById("progress").innerText = `⏱ ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("progress").innerText = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById("progress").innerText = "";
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function connectWallet() {
  if (!window.solana || !window.solana.isPhantom) {
    alert("Phantom wallet not found. Please install it.");
    return;
  }

  try {
    const resp = await window.solana.connect();
    const wallet = resp.publicKey.toString();
    window.connectedWallet = wallet;
    document.getElementById("wallet-status").innerText = `🔐 Connected: ${wallet}`;
  } catch (err) {
    console.error("Wallet connection failed:", err);
  }
}

window.onload = loadQuestions;
