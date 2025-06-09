let questions = [];
let currentQuestion = 0;
let score = 0;
let timer, timeLeft;
const TIME_PER_QUESTION = 15;

async function loadQuestions() {
  try {
    const res = await fetch('/questions.json');
    questions = await res.json();
    document.getElementById('splash-screen').querySelector('button').disabled = false;
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
  timeLeft = TIME_PER_QUESTION;

  const q = questions[currentQuestion];
  document.getElementById('question').innerText = q.question;
  document.getElementById('progress').innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
  
  const opts = document.getElementById('options');
  opts.innerHTML = '';
  q.answers.forEach((a, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerText = a;
    btn.onclick = () => selectAnswer(i === q.correct, btn, i);
    opts.appendChild(btn);
  });

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('progress').innerText = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) selectAnswer(false, null, -1);
  }, 1000);
}

function selectAnswer(correct, btn, idx) {
  clearInterval(timer);
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  if (correct) {
    score++;
    if (btn) btn.style.background = 'green';
  } else {
    if (btn) btn.style.background = 'red';
    const q = questions[currentQuestion];
    document.querySelectorAll('.option-btn')[q.correct]?.style.setProperty('background', '#4caf50');
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
    }).then(console.log).catch(console.error);
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
    document.getElementById('wallet-status').innerText = `Connected: ${window.connectedWallet}`;
  } catch (err) {
    console.error('Wallet connect failed', err);
  }
}

document.getElementById('startBtn').addEventListener('click', startQuiz);
window.onload = loadQuestions;
// 🔁 Cache-buster
