const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const fetch = require("node-fetch");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: userMessage }],
    });
    const botReply = completion.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Error processing request" });
  }
});

app.get("/api/prices", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await response.json();
    res.json({
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
      SOL: data.solana.usd
    });
  } catch (error) {
    console.error("Price fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
