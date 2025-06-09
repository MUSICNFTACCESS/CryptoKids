const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve questions
app.get("/questions.json", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "questions.json"));
});

// Save points to file (for demo purposes, appends to log)
app.post("/save-points", (req, res) => {
  const { wallet, points } = req.body;
  if (!wallet || typeof points !== "number") {
    return res.status(400).json({ error: "Invalid data" });
  }

  const entry = `${new Date().toISOString()} - Wallet: ${wallet}, Points: ${points}\n`;

  try {
    fs.appendFileSync("points-log.txt", entry, { flag: "a" });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error saving points:", err);
    res.status(500).json({ error: "Failed to save points" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ CryptoKids server running at http://localhost:${PORT}`);
});
