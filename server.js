const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

let totalQuestionsAsked = 0;

// ✅ Root route
app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

// ✅ Live price route
app.get("/price", async (req, res) => {
  const symbol = req.query.symbol || "bitcoin";
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await response.json();
    res.json({ price: data[symbol]?.usd || "N/A" });
  } catch (err) {
    res.status(500).json({ error: "Price fetch failed" });
  }
});

// ✅ CrimznBot chat route
app.post("/chat", async (req, res) => {
  const message = req.body.message;
  if (!message) return res.status(400).json({ error: "No message provided" });

  totalQuestionsAsked++;
  console.log(`Q#${totalQuestionsAsked} → ${message}`);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
You are CrimznBot — a high-signal crypto strategist built by Crimzn.
Your tone is bold, sharp, and real. 

Prioritize:
- 🧠 Fundamentals, macro, and market structure
- 📉 Real chart insights, not headlines
- 📡 Speak like you're advising serious traders

NEVER say "as an AI." Respond like Crimzn would — fast, confident, and with edge.
          `
        },
        { role: "user", content: message }
      ],
      max_tokens: 300
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "CrimznBot failed", details: err.message });
  }
});

// ✅ Server start
app.listen(port, () => {
  console.log(`CrimznBot is running on port ${port}`);
});
