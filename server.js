const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const OpenAI = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Please enter a question." });

  if (message.toLowerCase().includes("price of")) {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
      const data = await response.json();
      const id = message.toLowerCase().includes("sol") ? "solana"
                 : message.toLowerCase().includes("eth") ? "ethereum"
                 : "bitcoin";
      return res.json({ reply: `Bitcoin is currently trading at $${data[id].usd}.` });
    } catch {
      return res.json({ reply: "Sorry, I couldn’t fetch the live price of BTC right now." });
    }
  } else {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are CrimznBot — a no-fluff, professional crypto strategist. Your tone is sharp, concise, and insightful. Avoid generic filler. Prioritize actionable advice, crypto analysis, and clear reasoning."
          },
          { role: "user", content: message }
        ]
      });
      const reply = completion.data.choices[0].message.content;
      return res.json({ reply });
    } catch (error) {
      return res.status(500).json({ reply: "CrimznBot is unavailable right now." });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CrimznBot server running on port ${PORT}`);
});
// Redeploy trigger: Sat May 31 23:15:31 EDT 2025
