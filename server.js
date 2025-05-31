const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getPrice(symbol) {
  const ids = {
    btc: "bitcoin",
    eth: "ethereum",
    sol: "solana",
    bitcoin: "bitcoin",
    ethereum: "ethereum",
    solana: "solana",
  };

    return data[id] && data[id].usd ? `$${data[id].usd}` : null;
  if (!id) return null;

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
    const data = await res.json();
    return data[id]?.usd ? `$${data[id].usd}` : null;
  } catch (err) {
    return null;
  }
}

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const lowered = message.toLowerCase();
  let priceResponse = "";

  if (lowered.includes("price of btc") || lowered.includes("btc price")) {
    const btc = await getPrice("btc");
    if (btc) priceResponse = `Bitcoin is currently trading at ${btc}.`;
  } else if (lowered.includes("price of eth") || lowered.includes("eth price")) {
    const eth = await getPrice("eth");
    if (eth) priceResponse = `Ethereum is currently trading at ${eth}.`;
  } else if (lowered.includes("price of sol") || lowered.includes("sol price")) {
    const sol = await getPrice("sol");
    if (sol) priceResponse = `Solana is currently trading at ${sol}.`;
  }

  if (priceResponse) {
    return res.json({ reply: priceResponse });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are CrimznBot, a professional crypto strategist. Never say you're an AI or chatbot. Speak confidently and answer directly.`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "CrimznBot is unavailable" });
  }
});

app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

app.listen(port, () => {
  console.log(`CrimznBot backend running on port ${port}`);
});
