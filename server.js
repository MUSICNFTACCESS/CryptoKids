const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function fetchPrice(symbol) {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    return response.data[symbol]?.usd || null;
  } catch (error) {
    return null;
  }
}

app.get('/', (req, res) => {
  res.send('🟢 CrimznBot is live');
});

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: 'No message provided.' });

  try {
    const [btcPrice, ondoPrice] = await Promise.all([
      fetchPrice('bitcoin'),
      fetchPrice('ondo-finance')
    ]);

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are CrimznBot, a macro-aware crypto strategist who sounds like Raoul Pal and Michael Saylor. Use real token prices and analyze rotation logic clearly. Respond with conviction, logic, and style.`,
        },
        {
          role: 'user',
          content: `The current price of BTC is $${btcPrice}, and ONDO is $${ondoPrice}. ${userMessage}`,
        },
      ],
      temperature: 0.7,
    });

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).json({ error: 'CrimznBot is momentarily overwhelmed. Try again soon.' });
  }
});

app.listen(port, () => {
  console.log(`🔥 CrimznBot server running at http://localhost:${port}`);
});
