let questionCount = 0;
let paid = localStorage.getItem('crimzn_paid') === 'true';

function askCrimznBot() {
  const input = document.getElementById('user-input');
  const output = document.getElementById('chat-output');

  if (paid || questionCount < 5) {
    const message = input.value.trim();
    if (message) {
      questionCount++;
      output.innerHTML += `<div><b>You:</b> ${message}</div>`;
      // Fake response from CrimznBot
      setTimeout(() => {
        output.innerHTML += `<div><b>CrimznBot:</b> You asked "${message}". Imagine a GPT-4 answer here.</div>`;
        output.scrollTop = output.scrollHeight;
      }, 500);
      input.value = '';
    }
  } else {
    document.getElementById('paywall').style.display = 'block';
  }
}

function markAsPaid() {
  localStorage.setItem('crimzn_paid', 'true');
  paid = true;
  document.getElementById('paywall').style.display = 'none';
}
