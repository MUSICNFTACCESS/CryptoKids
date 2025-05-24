const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// OpenAI config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Root route (to avoid "Cannot GET /" error)
app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

// Chat route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Missing user message" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are CrimznBot, a professional crypto consultant. Respond in a calm, informative tone with deep knowledge of crypto market trends, portfolio strategy, DeFi, and on-chain tools. Be concise, thorough, and helpful. Avoid disclaimers.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to get response from CrimznBot." });
  }
});

app.listen(port, () => {
  console.log(`CrimznBot backend running on port ${port}`);
});
