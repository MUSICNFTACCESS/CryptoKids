const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Root check
app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

// Price route
app.get("/price", async (req, res) => {
  const symbol = req.query.symbol || "bitcoin";
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await response.json();
    res.json({ price: data[symbol]?.usd || "N/A" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

// CrimznBot chat route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are CrimznBot, an expert in cryptocurrency with a confident, professional, degen-savvy tone. Always give clear, helpful, real-time answers." },
        { role: "user", content: userMessage }
      ],
      max_tokens: 200,
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to get response from CrimznBot" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`CrimznBot server running on port ${port}`);
});
