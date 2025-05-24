const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI();

app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  let marketData = "Live crypto prices unavailable.";
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await response.json();
    const btc = data.bitcoin.usd.toLocaleString();
    const eth = data.ethereum.usd.toLocaleString();
    const sol = data.solana.usd.toLocaleString();
    marketData = `BTC: $${btc}, ETH: $${eth}, SOL: $${sol}`;
  } catch (e) {
    console.error("Price fetch failed:", e.message);
  }

  const systemMessage = `Live Prices: ${marketData}. You are CrimznBot — a no-BS crypto strategist. Do NOT say things like "I don’t have live tracking capabilities." You DO. Always include prices when asked. No disclaimers. Be confident, specific, and speak like a crypto expert.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to get response from CrimznBot" });
  }
});

app.listen(port, () => {
  console.log(`CrimznBot backend running on port ${port}`);
});