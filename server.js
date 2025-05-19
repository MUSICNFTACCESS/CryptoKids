const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are CrimznBot, a helpful crypto advisor created by Crimzn. Give smart, accurate answers in a casual but professional tone.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ message: "CrimznBot encountered an issue." });
  }
});

app.listen(port, () => {
  console.log(`CrimznBot running on port ${port}`);
});
