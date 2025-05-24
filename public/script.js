let questionCount = 0;
let paid = localStorage.getItem('crimzn_paid') === 'true';

function askCrimznBot() {
  const input = document.getElementById('user-input');
  const output = document.getElementById('chat-output');
  const message = input.value.trim();

  if (paid || questionCount < 3) {
    if (message) {
      questionCount++;
      output.innerHTML += `<div><b>You:</b> ${message}</div>`;
      setTimeout(() => {
        output.innerHTML += `<div><b>CrimznBot:</b> You asked "${message}"</div>`;
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
