const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are CrimznBot, a strategic crypto expert with insights like Raoul Pal, Michael Saylor, and Lyn Alden. Respond with clear guidance and real-time logic." },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content || "⚠️ No reply generated.";
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.json({ reply: "❌ Error contacting AI. Try again later." });
  }
});

app.listen(port, () => {
  console.log(`CrimznBot server running on port ${port}`);
});
