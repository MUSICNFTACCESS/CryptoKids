const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const maxFreeQuestions = 3;

// Check how many questions user has asked
let questionCount = parseInt(localStorage.getItem("questionCount")) || 0;

function disableChat() {
  userInput.disabled = true;
  const lockMsg = document.createElement("div");
  lockMsg.style.color = "orange";
  lockMsg.style.marginTop = "20px";
  lockMsg.innerHTML = `
    <strong>You’ve used your 3 free questions.</strong><br/>
    To continue, please:
    <ul style="text-align:left; margin-top: 10px;">
      <li><a href="https://commerce.coinbase.com/checkout/0193a8a5-c86f-407d-b5d7-6f89664fbdf8" target="_blank" style="color:lightgreen;">Book a $99.99 Consultation</a></li>
      <li><a href="https://commerce.coinbase.com/checkout/1d7cd946-d6ec-4278-b7ea-ee742b86982b" target="_blank" style="color:lightgreen;">Tip 1 USDC to unlock 5 more</a></li>
      <li><a href="https://t.me/Crimznbot" target="_blank" style="color:lightgreen;">Message me on Telegram</a></li>
    </ul>
  `;
  chatLog.appendChild(lockMsg);
}

if (questionCount >= maxFreeQuestions) {
  disableChat();
}

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

    // Track questions used
    questionCount++;
    localStorage.setItem("questionCount", questionCount);

    if (questionCount >= maxFreeQuestions) {
      disableChat();
    }

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
