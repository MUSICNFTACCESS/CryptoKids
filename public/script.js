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
    document.getElementById("question").innerText = "Failed to load questions.";
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

  document.getElementById("next-btn").classList.add("hidden");
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
  const total = prev + score;
  localStorage.setItem("cryptokids_points", total);
  document.getElementById("total-points").innerText = `Total Points: ${total}`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  let timeLeft = TIME_PER_QUESTION;
  document.getElementById("timer").innerText = `⏳ ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `⏳ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById("timer").innerText = "";
}

// Handle wallet form submission
document.addEventListener("DOMContentLoaded", () => {
  loadQuestions();
  document.getElementById("start-btn").addEventListener("click", startQuiz);
  document.getElementById("next-btn").addEventListener("click", nextQuestion);

  const form = document.getElementById("wallet-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const wallet = document.getElementById("wallet").value;
      const points = parseInt(localStorage.getItem("cryptokids_points") || "0");

      try {
        const res = await fetch("/save-points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet, points }),
        });
        const data = await res.json();
        if (data.status === "ok") {
          alert("✅ Points saved! You’ll be eligible for future rewards.");
        } else {
          alert("❌ Failed to save points.");
        }
      } catch (err) {
        console.error("Error saving points:", err);
        alert("❌ Server error.");
      }
    });
  }
});
