let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
const TIME_PER_QUESTION = 15;

async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    questions = await res.json();
    questions.forEach(q => {
      const correct = q.answers[q.correctIndex];
      shuffleArray(q.answers);
      q.correctIndex = q.answers.indexOf(correct);
    });
  } catch (err) {
    console.error('Failed loading questions', err);
    alert('Error loading questions.');
  }
}

function startQuiz() {
  document.getElementById('splash-screen').classList.add('hidden');
  document.getElementById('quiz-container').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  const q = questions[currentQuestion];
  let timeLeft = TIME_PER_QUESTION;

  document.getElementById('question').innerText = q.question;
  const options = document.getElementById('options');
  options.innerHTML = '';
  q.answers.forEach((answer, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerText = answer;
    btn.onclick = () => selectAnswer(i, btn, q.correctIndex);
    options.appendChild(btn);
  });

  document.getElementById('progress').innerText = `Time: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('progress').innerText = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      selectAnswer(-1, null, q.correctIndex); // time ran out
    }
  }, 1000);
}

function selectAnswer(index, btn, correctIndex) {
  clearInterval(timer);
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  if (index === correctIndex) {
    score++;
    if (btn) btn.style.backgroundColor = 'green';
  } else {
    if (btn) btn.style.backgroundColor = 'red';
    const correctBtn = document.querySelectorAll('.option-btn')[correctIndex];
    if (correctBtn) correctBtn.style.backgroundColor = 'green';
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  document.getElementById('quiz-container').classList.add('hidden');
  document.getElementById('score-container').classList.remove('hidden');
  document.getElementById('score').innerText = `You scored ${score} / ${questions.length}`;

  let prev = parseInt(localStorage.getItem('cryptokids_points') || '0');
  localStorage.setItem('cryptokids_points', prev + score);

  if (window.connectedWallet) {
    fetch('/save-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: window.connectedWallet, points: score })
    }).then(res => res.json()).then(console.log).catch(console.error);
  }
}

async function connectWallet() {
  if (!window.solana?.isPhantom) {
    alert('Please install Phantom wallet.');
    return;
  }
  try {
    const resp = await window.solana.connect();
    window.connectedWallet = resp.publicKey.toString();
    document.getElementById('wallet-status').innerText = `Connected: ${window.connectedWallet.slice(0, 4)}...${window.connectedWallet.slice(-4)}`;
  } catch (err) {
    console.error('Wallet connect failed', err);
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

document.getElementById('startBtn').addEventListener('click', startQuiz);
window.onload = loadQuestions;
// 🔁 Cache-buster
