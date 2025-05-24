let questionCount = 0;
let paid = localStorage.getItem('crimzn_paid') === 'true';

async function updatePrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    document.getElementById("prices").innerText = 
      `BTC: $${data.bitcoin.usd} | ETH: $${data.ethereum.usd} | SOL: $${data.solana.usd}`;
  } catch (err) {
    document.getElementById("prices").innerText = "Price data unavailable";
  }
}
updatePrices();

function askCrimznBot() {
  const input = document.getElementById('user-input');
  const output = document.getElementById('chat-output');

  if (paid || questionCount < 3) {
    const message = input.value.trim();
    if (message) {
      questionCount++;
      output.innerHTML += `<div><b>You:</b> ${message}</div>`;
      setTimeout(() => {
        output.innerHTML += `<div><b>CrimznBot:</b> Simulated response for "${message}"</div>`;
        output.scrollTop = output.scrollHeight;
      }, 500);
      input.value = '';
    }
  } else {
    document.getElementById('paywall').style.display = 'block';
    document.getElementById('user-input').disabled = true;
  }
}

function markAsPaid() {
  localStorage.setItem('crimzn_paid', 'true');
  paid = true;
  document.getElementById('paywall').style.display = 'none';
  document.getElementById('user-input').disabled = false;
}

function connectWallet() {
  window.open("https://phantom.app/", "_blank");
}}
