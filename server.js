const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
const path = require("path");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getPrice(symbol) {
  const ids = {
    btc: "bitcoin",
    eth: "ethereum",
    sol: "solana",
    bitcoin: "bitcoin",
    ethereum: "ethereum",
    solana: "solana",
  };

  const id = ids[symbol.toLowerCase()];
  if (!id) return null;

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
    const data = await res.json();
    return data[id] && data[id].usd ? `$${data[id].usd}` : null;
  } catch {
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

  if (priceResponse) return res.json({ reply: priceResponse });

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are CrimznBot, a professional crypto strategist. Never say you're an AI. Respond with clarity and authority.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    res.json({ reply: chat.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "CrimznBot is unavailable" });
  }
});

// Fallback to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`CrimznBot backend running on port ${port}`);
});
