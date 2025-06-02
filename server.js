const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Helper to fetch token price in USD
async function getTokenPrice(symbol) {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`;
    const response = await axios.get(url);
    return response.data[symbol].usd;
  } catch (error) {
    return null;
  }
}

// Route test
app.get('/', (req, res) => {
  res.send('✅ CrimznBot backend is live');
});

// Main CrimznBot logic
app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: 'No message provided' });

  const btcPrice = await getTokenPrice('bitcoin');
  const ondoPrice = await getTokenPrice('ondoproject');

  const priceInsert = `The current price of BTC is $${btcPrice} and ONDO is $${ondoPrice}.`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            `You are CrimznBot — a crypto strategist with the tone of Raoul Pal, Michael Saylor, and Lynn Alden. Use advanced logic, live token data, and macro insights. Always show prices if relevant.`,
        },
        {
          role: 'user',
          content: `${userMessage}\n\n${priceInsert}`,
        },
      ],
      temperature: 0.75,
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).json({
      error: 'CrimznBot is momentarily overwhelmed. Try again shortly.',
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🔥 CrimznBot server running at http://localhost:${port}`);
});
