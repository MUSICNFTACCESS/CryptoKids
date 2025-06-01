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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY1 });

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

  if (!message) return res.status(400).json({ reply: "Please enter a question." });



  if (message.toLowerCase().includes("price of")) {

    try {

      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");

      const data = await response.json();

      const id = message.toLowerCase().includes("sol") ? "solana" : message.toLowerCase().includes("eth") ? "ethereum" : "bitcoin";

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

            content: "You are CrimznBot — a no-fluff, professional crypto strategist who delivers insights, TA, and market opinions in a clear and sharp tone. Respond concisely and only with helpful, insightful info."

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

// Fallback to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`CrimznBot backend running on port ${port}`);
});

