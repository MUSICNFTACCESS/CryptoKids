let questionCount = 0;

document.getElementById("askBtn").addEventListener("click", async () => {
  const questionInput = document.getElementById("question");
  const chatbox = document.getElementById("chatbox");
  const question = questionInput.value.trim();
  const paywall = document.getElementById("paywall");

  if (!question) return;

  const userMsg = document.createElement("div");
  userMsg.className = "user-message";
  userMsg.style.color = "orange";
  userMsg.style.marginBottom = "8px";
  userMsg.innerText = question;
  chatbox.appendChild(userMsg);

  const askBtn = document.getElementById("askBtn");
  askBtn.disabled = true;
  askBtn.innerText = "Thinking...";

  try {
    const response = await fetch("https://cryptoconsult-1.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question }),
    });
    const data = await response.json();

    const botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.style.color = "lightgreen";
    botMsg.style.marginBottom = "16px";
    botMsg.innerText = data.reply;
    chatbox.appendChild(botMsg);

    questionCount++;
    if (questionCount >= 3) {
      paywall.innerHTML = `
        <p><strong>You've reached the 3-question limit.</strong></p>
        <button onclick="window.open('https://commerce.coinbase.com/checkout/0193a8a5-c86f-407d-b5d7-6f89664fbdf8', '_blank')">Pay $99.99 USDC</button>
        <button onclick="window.open('https://commerce.coinbase.com/checkout/1d7cd946-d6ec-4278-b7ea-ee742b86982b', '_blank')">Send Tip (1 USDC)</button>
        <button onclick="window.open('https://t.me/Crimznbot', '_blank')">Message on Telegram</button>
      `;
      questionInput.disabled = true;
      askBtn.disabled = true;
    }
  } catch (err) {
    const botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.style.color = "red";
    botMsg.innerText = "CrimznBot is unavailable.";
    chatbox.appendChild(botMsg);
  }

  questionInput.value = "";
  askBtn.disabled = false;
  askBtn.innerText = "Ask CrimznBot";
});

// === Live Price Fetch ===
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
