
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

require('dotenv').config();
const { TOKEN, CHATID } = process.env
if (!TOKEN || !CHATID) {
  console.error('env variables not found');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

let options = ["Pizza", "Sushi", "Burger", "Salad"];


cron.schedule('0 30 17 * MON-FRI *', () => {
  const question = "What should be today's dinner?";
  bot.sendPoll(CHATID, question, options, { is_anonymous: false });
  console.log("Poll sent!");
});


bot.onText(/\/add (.+)/, (msg, match) => {
  // console.log('msg: ', msg);
  // console.log('match: ', match);
  const newOption = match[1];
  options.push(newOption);
  bot.sendMessage(CHATID, `${msg.from.first_name} added "${newOption}" to the dinner poll!`);
});

bot.onText(/\/show/, (msg, match) => {
  bot.sendMessage(CHATID, options.join('\n'));
});

bot.onText(/\/del (.+)/, (msg, match) => {
  const oldOption = match[1];
  if (!options.includes(oldOption))
    return bot.sendMessage(CHATID, `"${oldOption}" is not in options!`);
  options = options.filter(o => o != oldOption)
  bot.sendMessage(CHATID, `${msg.from.first_name} deleted "${oldOption}" from the dinner poll!`);
});

bot.onText(/\/pollNow/, (msg) => {
  bot.sendPoll(CHATID, "What's for dinner?", options, { is_anonymous: false });
});

console.log("Bot is running...");
bot.on("error", console.log);