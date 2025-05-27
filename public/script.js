let questionCount = 0;

document.getElementById("askBtn").addEventListener("click", async () => {
  const questionInput = document.getElementById("question");
  const chatbox = document.getElementById("chatbox");
  const question = questionInput.value.trim();
  const paywall = document.getElementById("paywall");

  if (!question) return;

  // Clear chatbox before new question
  chatbox.innerHTML = "";

  // Display user question
  const userMsg = document.createElement("div");
  userMsg.className = "user-message";
  userMsg.innerText = question;
  chatbox.appendChild(userMsg);

  // Disable button
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
    botMsg.innerText = data.reply;
    chatbox.appendChild(botMsg);

    questionCount++;
    if (questionCount >= 3) {
      paywall.innerHTML = `
        <p><strong>You've reached the 3-question limit.</strong></p>
        <button onclick="window.open('https://commerce.coinbase.com/checkout/0193a8a5-c86f-407d-b5d7-6f89664fbdf8','_blank')">Pay $99.99 for Services Rendered</button>
        <button onclick="window.open('https://commerce.coinbase.com/checkout/1d7cd946-d6ec-4278-b7ea-ee742b86982b','_blank')">Send Tip (1 USDC)</button>
        <button onclick="window.open('https://t.me/Crimznbot','_blank')">Contact on Telegram</button>
      `;
      document.getElementById("question").disabled = true;
      askBtn.disabled = true;
    }
  } catch (err) {
    chatbox.innerHTML = "<div class='bot-message'>CrimznBot is unavailable right now.</div>";
  }

  questionInput.value = "";
  askBtn.disabled = false;
  askBtn.innerText = "Ask CrimznBot";
});
