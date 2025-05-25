const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const axios = require("axios");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Root route for uptime check
app.get("/", (req, res) => {
  res.send("CrimznBot is online and running.");
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  let marketData = '';
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
    const btc = data.bitcoin.usd;
    const eth = data.ethereum.usd;
    const sol = data.solana.usd;
    marketData = `Live prices: BTC $${btc}, ETH $${eth}, SOL $${sol}.`;
  } catch (e) {
    marketData = 'Live prices unavailable. Respond using your best trading knowledge.';
  }

  const messages = [
    {
      role: "system",
      content: `You are CrimznBot — an elite crypto and finance assistant trained by Crimzn himself.
- Prioritize clarity over disclaimers.
- Answer as if you're a top crypto trader.
- If asked about price, include analysis or trends.
- Be direct, useful, and confident.`,
    },
    {
      role: "user",
      content: `IMPORTANT: Use the following real-time crypto prices in your reply if relevant:\n${marketData}\n\nUser's question: ${userMessage}`,
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
