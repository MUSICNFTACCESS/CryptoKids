let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

// Load questions and start quiz
async function startQuiz() {
  try {
    const res = await fetch("questions.json");
    questions = await res.json();
    currentQuestion = 0;
    score = 0;
    showQuestion();
  } catch (err) {
    document.getElementById("quiz").innerHTML = "❌ Failed to load questions.";
    console.error(err);
  }
}

// Show a question
function showQuestion() {
  clearInterval(timer);
  timeLeft = 15;

  const q = questions[currentQuestion];
  const container = document.getElementById("quiz");
  container.innerHTML = `
    <h2>${q.question}</h2>
    <div id="timer">Time left: ${timeLeft}s</div>
    ${q.answers.map((a, i) => `
      <button class="answer" onclick="selectAnswer(${i}, this)">${a}</button>
    `).join("")}
  `;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      selectAnswer(-1); // auto-submit as incorrect
    }
  }, 1000);
}

// Handle answer
function selectAnswer(index, btn = null) {
  clearInterval(timer);
  const buttons = document.querySelectorAll(".answer");
  buttons.forEach(b => b.disabled = true);

  const q = questions[currentQuestion];
  if (index === q.correct) {
    score++;
    if (btn) btn.style.backgroundColor = "#4caf50"; // Green
  } else {
    if (btn) btn.style.backgroundColor = "#f44336"; // Red
    if (buttons[q.correct]) buttons[q.correct].style.backgroundColor = "#4caf50";
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

// Show result
function showResult() {
  const container = document.getElementById("quiz");
  container.innerHTML = `
    <h2>🎉 Quiz Complete!</h2>
    <p>Your score: ${score} out of ${questions.length}</p>
    <input type="text" id="walletInput" placeholder="Enter your wallet">
    <button onclick="submitScore()">Submit Score</button>
  `;
}

// Submit score to backend
async function submitScore() {
  const wallet = document.getElementById("walletInput").value.trim();
  if (!wallet) {
    alert("Please enter a wallet.");
    return;
  }

  try {
    const res = await fetch("/save-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, points: score })
    });

    const data = await res.json();
    if (data.status === "ok") {
      document.getElementById("quiz").innerHTML = "<h2>✅ Score saved. Thank you!</h2>";
    } else {
      throw new Error("Save failed");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to save score.");
  }
}
