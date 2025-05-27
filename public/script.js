let questionCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const paywall = document.getElementById("paywall");

  const autoplay = new Audio("autoplay.mp3");
  document.body.addEventListener("click", () => {
    autoplay.play().catch(() => {});
  }, { once: true });

  sendBtn.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";

    questionCount++;
    if (questionCount > 3) {
      paywall.style.display = "block";
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      appendMessage("bot", data.reply || "No response.");
    } catch (error) {
      appendMessage("bot", "Error getting response from CrimznBot.");
    }
  });

  function appendMessage(sender, message) {
    const div = document.createElement("div");
    div.className = sender;
    div.textContent = (sender === "user" ? "You: " : "CrimznBot: ") + message;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
