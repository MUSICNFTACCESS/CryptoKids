let questionCount = 0;

document.querySelector("button").addEventListener("click", async () => {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  const chatBox = document.getElementById("chat-box");
  const limitMessage = document.getElementById("limit-message");

  if (!message || questionCount >= 3) return;

  chatBox.innerHTML = ""; // clear previous messages

  const userDiv = document.createElement("div");
  userDiv.style.color = "orange";
  userDiv.textContent = "You: " + message;
  chatBox.appendChild(userDiv);

  try {
    const res = await fetch("https://cryptoconsult-1.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    const botDiv = document.createElement("div");
    botDiv.style.color = "lightgreen";
    botDiv.textContent = "CrimznBot: " + data.reply;
    chatBox.appendChild(botDiv);
  } catch {
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.textContent = "CrimznBot is temporarily unavailable.";
    chatBox.appendChild(errorDiv);
  }

  input.value = "";
  questionCount++;

  if (questionCount >= 3) {
    document.querySelector("input").disabled = true;
    document.querySelector("button").disabled = true;
    limitMessage.style.display = "block";
  }
});

async function loadPrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    document.getElementById("btc-price").textContent = `$${data.bitcoin.usd}`;
    document.getElementById("eth-price").textContent = `$${data.ethereum.usd}`;
    document.getElementById("sol-price").textContent = `$${data.solana.usd}`;
  } catch {
    document.getElementById("btc-price").textContent = "N/A";
    document.getElementById("eth-price").textContent = "N/A";
    document.getElementById("sol-price").textContent = "N/A";
  }
}
window.onload = loadPrices;
