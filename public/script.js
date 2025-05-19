// --- Live Price Fetch ---
async function fetchPrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    const btc = data.bitcoin.usd;
    const eth = data.ethereum.usd;
    const sol = data.solana.usd;

    const pricesText = `BTC: $${btc.toLocaleString()} | ETH: $${eth.toLocaleString()} | SOL: $${sol.toLocaleString()}`;
    document.getElementById("prices").innerText = pricesText;
  } catch (err) {
    document.getElementById("prices").innerText = "Failed to load prices";
  }
}
fetchPrices();
setInterval(fetchPrices, 60000);

// --- CrimznBot Chat ---
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  chatLog.innerHTML = "";

  const userMsg = document.createElement("div");
  userMsg.style.color = "orange";
  userMsg.textContent = "You: " + message;
  chatLog.appendChild(userMsg);

  userInput.value = "";

  try {
    const response = await fetch("https://crimznbot.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    const botMsg = document.createElement("div");
    botMsg.style.color = "#fff";
    botMsg.textContent = "CrimznBot: " + (data.reply || "Sorry, no reply.");
    chatLog.appendChild(botMsg);
    chatLog.scrollTop = chatLog.scrollHeight;
  } catch (err) {
    const errMsg = document.createElement("div");
    errMsg.style.color = "red";
    errMsg.textContent = "Error: Could not reach CrimznBot.";
    chatLog.appendChild(errMsg);
  }
}

userInput?.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
