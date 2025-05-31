async function loadQuestions() {
  try {
    const response = await fetch('/questions.json');
    const questions = await response.json();
    let currentQuestion = 0;
    let score = 0;

    const questionEl = document.querySelector('.question');
    const optionsEl = document.querySelector('.options');
    const resultEl = document.querySelector('.result');
    const progressEl = document.querySelector('.progress');

    function displayQuestion() {
      const q = questions[currentQuestion];
      questionEl.textContent = q.question;
      optionsEl.innerHTML = '';
      const correctIndex = Number(q.correct); // Force number type

      q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => {
          if (index === correctIndex) {
            score++;
            resultEl.textContent = '✅ Correct!';
          } else {
            resultEl.textContent = '❌ Wrong!';
          }
          currentQuestion++;
          progressEl.style.width = `${(currentQuestion / questions.length) * 100}%`;
          setTimeout(() => {
            resultEl.textContent = '';
            if (currentQuestion < questions.length) {
              displayQuestion();
            } else {
              questionEl.textContent = `🎉 Quiz completed! Your score: ${score}/${questions.length}`;
              optionsEl.innerHTML = '';
            }
          }, 1000);
        };
        optionsEl.appendChild(btn);
      });
    }

    displayQuestion();
  } catch (err) {
    console.error('Failed to load questions:', err);
    document.querySelector('.question').textContent = 'Failed to load quiz.';
  }
}

document.addEventListener('DOMContentLoaded', loadQuestions);

// Phantom Wallet Connect
document.getElementById("connect-wallet").addEventListener("click", async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      document.getElementById("wallet-status").innerText = `Connected: ${resp.publicKey.toString()}`;
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  } else {
    alert("Phantom Wallet not found. Please install it.");
  }
});
