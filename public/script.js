document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("input[type='text']");
  const button = document.querySelector("button");
  const chatSection = document.querySelector(".section h2:contains('Talk to CrimznBot')")?.parentElement;

  const output = document.createElement("div");
  output.classList.add("chat-container");
  chatSection?.appendChild(output);

  button.addEventListener("click", async () => {
    const question = input.value.trim();
    if (!question) return;

    // Show user message
    const userDiv = document.createElement("div");
    userDiv.className = "user-message";
    userDiv.innerText = question;
    output.appendChild(userDiv);

    input.value = "";

    try {
      const res = await fetch("https://cryptoconsult.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();
      const botDiv = document.createElement("div");
      botDiv.className = "bot-message";
      botDiv.innerText = data.answer || "⚠️ CrimznBot didn’t reply. Backend may be down.";
      output.appendChild(botDiv);
    } catch (err) {
      const failDiv = document.createElement("div");
      failDiv.className = "bot-message";
      failDiv.innerText = "🛑 CrimznBot couldn’t reach the backend. Matrix glitch?";
      output.appendChild(failDiv);
    }
  });
});
