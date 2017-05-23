var DiscordBot = require('./discord_bot.js')

var bot = new DiscordBot(process.env.DISCORD_TOKEN);

bot.init();
