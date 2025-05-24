let questionCount = 0;
const freeLimit = 3;

async function askCrimznBot() {
  const input = document.getElementById("user-input");
  const chatOutput = document.getElementById("chat-output");
  const paywall = document.getElementById("paywall");
  const message = input.value.trim();

  if (!message) return;

  if (questionCount >= freeLimit) {
    paywall.style.display = "block";
    return;
  }

  // Clear chat before each new message
  chatOutput.innerHTML = "";

  chatOutput.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  input.value = "";
  input.disabled = true;

  try {
    const response = await fetch("https://crimznbot.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    chatOutput.innerHTML += `<p><strong>CrimznBot:</strong> ${data.reply}</p>`;
  } catch (err) {
    chatOutput.innerHTML += `<p style="color:red;">Failed to get response from CrimznBot.</p>`;
  }

  questionCount++;
  input.disabled = false;
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function markAsPaid() {
  // Redirect to Solana Pay link (fallback for now)
  window.open("https://solana.com/pay?recipient=Co6bkf4NpatyTCbzjhoaTS63w93iK1DmzuooCSmHSAjF&amount=1&reference=CrimznConsult", "_blank");
  document.getElementById("paywall").style.display = "none";
  questionCount = 0;
}

async function updatePrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    const btc = data.bitcoin.usd.toLocaleString();
    const eth = data.ethereum.usd.toLocaleString();
    const sol = data.solana.usd.toLocaleString();
    document.getElementById("prices").textContent = `BTC: $${btc} | ETH: $${eth} | SOL: $${sol}`;
  } catch {
    document.getElementById("prices").textContent = `BTC: ... | ETH: ... | SOL: ...`;
  }
}

document.body.addEventListener('click', () => {
  const audio = document.getElementById('bg-music');
  if (audio && audio.paused) audio.play();
}, { once: true });

updatePrices();
setInterval(updatePrices, 60000);