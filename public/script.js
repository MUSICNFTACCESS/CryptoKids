let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timerInterval;

const TIME_PER_QUESTION = 15; // seconds

fetch("questions.json").then(res => res.json()).then(data => {
  questions = shuffle(data);
  showQuestion();
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

  const optionsList = document.getElementById("options");
  optionsList.innerHTML = "";

  shuffle([...questionObj.options]).forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => checkAnswer(option, questionObj);
    optionsList.appendChild(li);
  });

  updateProgress();
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
    document.getElementById("score").innerText = `${score}/${questions.length} (${score} points earned)`;

    // Save to localStorage
    const prev = parseInt(localStorage.getItem("cryptokids_points")) || 0;
    localStorage.setItem("cryptokids_points", prev + score);

    // Send points to backend if wallet is connected
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

async function connectWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      const walletAddress = resp.publicKey.toString();
      localStorage.setItem("walletAddress", walletAddress);

      const status = document.getElementById("wallet-status");
      status.innerText = `✅ Points saved to wallet: ${walletAddress}`;
      status.style.color = "#00ff00";
    } catch (err) {
      alert("Wallet connection failed.");
      console.error(err);
    }
  } else {
    alert("Phantom Wallet not detected.");
  }
}
