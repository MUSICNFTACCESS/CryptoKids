document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input[type='text']");
  const allButtons = document.querySelectorAll("button");
  const sendBtn = allButtons[3]; // Adjust this if needed
  const section = document.querySelector(".section:nth-of-type(3)");

  const chatBox = document.createElement("div");
  chatBox.className = "chat-container";
  section.appendChild(chatBox);

  sendBtn.addEventListener("click", async () => {
    const message = input.value.trim();
    if (!message) return;

    const userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);

    input.value = "";

    try {
      const res = await fetch("https://cryptoconsult.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      const botMsg = document.createElement("div");
      botMsg.className = "bot-message";
      botMsg.innerText = data.answer || "⚠️ CrimznBot replied with no data.";
      chatBox.appendChild(botMsg);
    } catch (err) {
      const errorMsg = document.createElement("div");
      errorMsg.className = "bot-message";
      errorMsg.innerText = "🛑 CrimznBot couldn’t reach the backend. Matrix glitch?";
      chatBox.appendChild(errorMsg);
    }
  });
});
