let questionCount = 0;

document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatbox = document.getElementById("chat-box");
  const paywall = document.getElementById("limit-message");

  const message = input.value.trim();
  if (!message) return;

  // Clear previous messages
  chatbox.innerHTML = "";

  const userMsg = document.createElement("div");
  userMsg.className = "user-message";
  userMsg.innerText = message;
  chatbox.appendChild(userMsg);

  input.disabled = true;
  const button = document.querySelector("button");
  button.disabled = true;
  button.innerText = "Thinking...";

  try {
    const res = await fetch("https://cryptoconsult-1.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    const botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.innerText = data.reply;
    chatbox.appendChild(botMsg);

    questionCount++;
    if (questionCount >= 3) {
      input.disabled = true;
      button.disabled = true;
      paywall.style.display = "block";
    }
  } catch (err) {
    const errorMsg = document.createElement("div");
    errorMsg.className = "bot-message";
    errorMsg.innerText = "CrimznBot is unavailable right now.";
    chatbox.appendChild(errorMsg);
  }

  input.value = "";
  input.disabled = false;
  button.disabled = false;
  button.innerText = "Send";
}

// Load prices
async function loadPrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const prices = await res.json();
    document.getElementById("btc-price").innerText = `$${prices.bitcoin.usd}`;
    document.getElementById("eth-price").innerText = `$${prices.ethereum.usd}`;
    document.getElementById("sol-price").innerText = `$${prices.solana.usd}`;
  } catch {
    document.getElementById("btc-price").innerText = "N/A";
    document.getElementById("eth-price").innerText = "N/A";
    document.getElementById("sol-price").innerText = "N/A";
  }
}
window.onload = loadPrices;
