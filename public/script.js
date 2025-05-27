let questionCount = 0;
const MAX_FREE_QUESTIONS = 3;

async function fetchPrice(id, symbol) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
    const data = await res.json();
    document.getElementById(`${symbol}-price`).textContent = `$${data[id].usd}`;
  } catch (err) {
    document.getElementById(`${symbol}-price`).textContent = "Error";
  }
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  if (questionCount >= MAX_FREE_QUESTIONS) {
    document.getElementById("limit-message").style.display = "block";
    return;
  }

  fetch("https://cryptoconsult-1.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then((res) => res.json())
    .then((data) => {
      const reply = document.createElement("p");
      reply.innerHTML = `<span style="color: orange;">You:</span> ${message}<br><span style="color: lightgreen;">CrimznBot:</span> ${data.reply}`;
      document.getElementById("chat-box").appendChild(reply);
      input.value = "";
      questionCount++;
    })
    .catch((err) => {
      console.error(err);
      alert("Error talking to CrimznBot.");
    });
}

window.onload = () => {
  ["bitcoin", "ethereum", "solana"].forEach((id) => {
    const symbol = id === "bitcoin" ? "btc" : id === "ethereum" ? "eth" : "sol";
    fetchPrice(id, symbol);
  });
};
