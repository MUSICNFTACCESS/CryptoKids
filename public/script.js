let questionCount = 0;
let paid = localStorage.getItem('crimzn_paid') === 'true';

function askCrimznBot() {
  const input = document.getElementById('user-input');
  const output = document.getElementById('chat-output');
  const message = input.value.trim();

  if (!message) return;

  if (paid || questionCount < 3) {
    output.innerHTML += `<div><b>You:</b> ${message}</div>`;
    questionCount++;

    setTimeout(() => {
      output.innerHTML += `<div><b>CrimznBot:</b> You asked "${message}", but the real bot will answer this soon.</div>`;
      output.scrollTop = output.scrollHeight;
    }, 500);

    input.value = '';
  } else {
    document.getElementById('paywall').style.display = 'block';
  }
}

function markAsPaid() {
  localStorage.setItem('crimzn_paid', 'true');
  paid = true;
  document.getElementById('paywall').style.display = 'none';
}
