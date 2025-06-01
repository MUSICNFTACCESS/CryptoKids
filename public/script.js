const BACKEND_URL = "https://cryptoconsult-1.onrender.com/api/chat";

let questionCount = 0;
const maxQuestions = 3;

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");
  const paymentReminder = document.getElementById("payment-gate");

  const message = input.value.trim();
  if (!message) return;

  // Append user message
  const userMsg = document.createElement("div");
  userMsg.innerHTML = `<div style="color: orange;"><strong>You:</strong> ${message}</div>`;
  chatBox.appendChild(userMsg);
  input.value = "";

  if (questionCount >= maxQuestions) {
    input.disabled = true;
    paymentReminder.style.display = "block";
    return;
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    const botMsg = document.createElement("div");
    botMsg.innerHTML = `<div style="color: green;"><strong>CrimznBot:</strong> ${data.reply || "No response."}</div>`;
    chatBox.appendChild(botMsg);

    questionCount++;
    if (questionCount >= maxQuestions) {
      input.disabled = true;
      paymentReminder.style.display = "block";
    }

  } catch (error) {
    const errorMsg = document.createElement("div");
    errorMsg.innerHTML = `<div style="color: red;">🛑 CrimznBot couldn't reach the backend. You may have broken the matrix. Try again soon.</div>`;
    chatBox.appendChild(errorMsg);
  }
}

// Price auto-refresh
async function updatePrice(id, symbol) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await res.json();
    const price = data[symbol]?.usd;
    if (price) document.getElementById(id).textContent = `$${price.toLocaleString()}`;
    else document.getElementById(id).textContent = "Error";
  } catch (e) {
    document.getElementById(id).textContent = "Error";
  }
}

function refreshPrices() {
  updatePrice("btc-price", "bitcoin");
  updatePrice("eth-price", "ethereum");
  updatePrice("sol-price", "solana");
}

refreshPrices();
setInterval(refreshPrices, 60000); // every 60 seconds
