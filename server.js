require("dotenv").config();
const express = require("express");
const path = require("path");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST /ask route
app.post("/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are CrimznBot, a professional crypto strategist trained on insights from Raoul Pal, Michael Saylor, and Lynn Alden. Answer concisely and strategically." },
        { role: "user", content: message }
      ],
      temperature: 0.75,
    });

    const reply = chatResponse.choices[0]?.message?.content || "⚠️ CrimznBot didn't return a reply.";
    res.json({ reply });
  } catch (err) {
    console.error("CrimznBot Error:", err.message);
    res.status(500).json({ reply: "CrimznBot error. Try again later." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 CrimznBot running at http://localhost:${port}`);
});
