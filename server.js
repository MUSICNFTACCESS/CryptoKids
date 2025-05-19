const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

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
  try {
    const userMessage = req.body.message;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are CrimznBot, a helpful crypto advisor built by Crimzn. Always reply with accurate, helpful, and professional crypto insights using a casual tone.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const botMessage = response.data.choices[0].message.content;
    res.json({ message: botMessage });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ message: "Error getting response from CrimznBot." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
