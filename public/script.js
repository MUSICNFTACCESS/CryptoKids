  input.value = "";

  if (questionCount >= maxQuestions) {
    input.disabled = true;
    paymentReminder.style.display = "block";
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message })
    });

    const data = await response.json();
    chatBox.innerHTML = `<div style="color: green;"><strong>CrimznBot:</strong> ${data.answer}</div>`;
    questionCount++;
  } catch (error) {
    chatBox.innerHTML = `<div style="color: red;">Error reaching CrimznBot server.</div>`;
  }
}

async function updatePrice(id, symbol) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await res.json();
    const price = data[symbol]?.usd;
    if (price) document.getElementById(id).textContent = `$${price.toLocaleString()}`;
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
