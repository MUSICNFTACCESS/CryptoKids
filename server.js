const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

app.post("/api/chat", async (req, res) => {
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
    marketData = `Latest prices — BTC: $${btc}, ETH: $${eth}, SOL: $${sol}`;
  } catch (e) {
    console.error("Failed to fetch price data:", e.message);
  }

  const messages = [
    {
      role: "system",
      content: `You are CrimznBot — a sharp, confident crypto strategist. Never say you're an AI. Use the following data: ${marketData}.`
    },
    {
      role: "user",
      content: userMessage
    }
  ];

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages
    });

    res.json({ reply: chat.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`CrimznBot server is running at http://0.0.0.0:${port}`);
});
