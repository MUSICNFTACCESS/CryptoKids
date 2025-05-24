const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeText = `Welcome to CryptoConsult by Crimzn!

Tap the Start button above or the Menu button to launch the app and begin your personalized crypto journey.`;
  bot.sendMessage(chatId, welcomeText);
});
