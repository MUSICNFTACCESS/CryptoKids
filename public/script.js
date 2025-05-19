onst chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Clear chat for new question
  chatLog.innerHTML = "";

  // Add user message
  const userMsg = document.createElement("div");
  userMsg.style.color = "orange";
  userMsg.textContent = "You: " + message;
  chatLog.appendChild(userMsg);

  userInput.value = ""; // Clear input

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

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
