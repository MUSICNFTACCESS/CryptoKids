document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.querySelector("input[type='text']");
  const chatbox = document.getElementById("chatbox");
  let questionCount = 0;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    const userMsg = document.createElement("p");
    userMsg.innerHTML = `<strong>You:</strong> ${message}`;
    chatbox.appendChild(userMsg);

    input.value = "";

    if (questionCount < 3) {
      try {
        const response = await fetch("https://crimznbot.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });

        const data = await response.json();
        const botMsg = document.createElement("p");
        botMsg.innerHTML = `<strong>CrimznBot:</strong> ${data.reply || "Sorry, no response."}`;
        chatbox.appendChild(botMsg);
      } catch (err) {
        const errorMsg = document.createElement("p");
        errorMsg.innerHTML = `<strong>CrimznBot:</strong> You asked "${message}", but the real bot will answer this soon.`;
        chatbox.appendChild(errorMsg);
      }

      questionCount++;
    }

    if (questionCount === 3) {
      input.disabled = true;
      document.getElementById("paywall").style.display = "block";
    }
  });
});
