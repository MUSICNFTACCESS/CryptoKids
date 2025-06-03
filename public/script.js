const backendUrl = "https://cryptoconsult-1.onrender.com";

// === Live Prices ===
async function fetchPrice(symbol, elementId) {
  try {
    const res = await fetch(`${backendUrl}/price?symbol=${symbol}`);
    const data = await res.json();
    document.getElementById(elementId).textContent = `$${data.price}`;
  } catch {
    document.getElementById(elementId).textContent = "Error";
  }
}

fetchPrice("bitcoin", "btc-price");
fetchPrice("ethereum", "eth-price");
fetchPrice("solana", "sol-price");

// === Chat ===
document.getElementById("send-button").addEventListener("click", async () => {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  const chat = document.getElementById("chat");
  chat.innerHTML += `<p style="color:#f7931a;"><b>You:</b> ${message}</p>`;
  input.value = "";

  try {
    const res = await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    chat.innerHTML += `<p style="color:#00ff00;"><b>CrimznBot:</b> ${data.reply}</p>`;
  } catch (err) {
    chat.innerHTML += `<p style="color:red;"><b>Error:</b> Something went wrong.</p>`;
  }
});
