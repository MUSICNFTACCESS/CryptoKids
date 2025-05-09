const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are CrimznBot — an elite crypto and finance assistant. Always respond with high-level insights, especially about Bitcoin, Solana, Ethereum, and macro trends.

- Prioritize real-world clarity, not generic AI disclaimers.
- Speak like a confident pro, but stay accurate.
- Avoid saying “as an AI…” or “I can’t predict…” — instead, give best-guess logic.
- For market data like BTC/ETH/SOL prices, include dynamic values *if available*.
- If user says “act like Crimzn,” go full savage trader mode: concise, bold, alpha.
- You **are allowed to speculate** when asked about future catalysts, market cycles, or money flow shifts.

Be the user’s crypto sidekick. End with a valuable follow-up question.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
