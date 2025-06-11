let currentQuestionIndex = 0;
let score = 0;
let quizData = [];

async function startQuiz() {
  try {
    const res = await fetch("questions.json");
    quizData = await res.json();
    currentQuestionIndex = 0;
    score = 0;

    if (!quizData.length) {
      document.getElementById("question").innerText = "No questions loaded.";
      return;
    }

    document.getElementById("quiz-container").classList.remove("hidden");
    document.getElementById("score-container").classList.add("hidden");
    showQuestion();
  } catch (error) {
    console.error("Failed to load quiz data:", error);
    document.getElementById("question").innerText = "Error loading questions.";
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

  document.getElementById("question").innerText = question.question;
  const answersContainer = document.getElementById("answers");
  answersContainer.innerHTML = "";

  answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => handleAnswer(index === randomizedCorrectIndex);
    answersContainer.appendChild(btn);
  });

  document.getElementById("progress").innerText =
    `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
}

function handleAnswer(isCorrect) {
  if (isCorrect) score++;

  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    document.getElementById("quiz-container").classList.add("hidden");
    document.getElementById("score-container").classList.remove("hidden");
    document.getElementById("final-score").innerText =
      `You scored ${score} out of ${quizData.length}!`;
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}