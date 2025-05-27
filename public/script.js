let questionCount = 0;
const chatbox = document.getElementById("chatbox");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const paywall = document.getElementById("paywall");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  chatbox.innerHTML = `<div class="user-msg">${userText}</div>`;
  input.value = "";

  if (questionCount >= 3) {
    paywall.style.display = "block";
    return;
  }

  try {
    const response = await fetch("https://crimznbot.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });
    const data = await response.json();
    chatbox.innerHTML = `<div class="bot-msg">${data.reply}</div>`;
    questionCount++;
  } catch {
    chatbox.innerHTML = `<div class="bot-msg error">Failed to get response from CrimznBot</div>`;
  }
});

// Autoplay background audio on first click
document.body.addEventListener("click", () => {
  const audio = document.getElementById("background-beat");
  if (audio && audio.paused) {
    audio.play().catch(() => {});
  }
});

// Solana Pay button
const solanaLink = document.getElementById("solana-pay-link");
if (solanaLink) {
  solanaLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.open("https://solana-pay.vercel.app/pay?recipient=Co6bkf4NpatyTCbzjhoaTS63w93iK1DmzuooCSmHSAjF", "_blank");
  });
}

// Live prices
async function updatePrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    const pricesText = `BTC: $${data.bitcoin.usd.toLocaleString()} | ETH: $${data.ethereum.usd.toLocaleString()} | SOL: $${data.solana.usd.toFixed(2)}`;
    document.getElementById("prices").innerText = pricesText;
  } catch {
    document.getElementById("prices").innerText = "Prices unavailable.";
  }
}

updatePrices();
setInterval(updatePrices, 60000);
