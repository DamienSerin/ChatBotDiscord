var Bot = require('./bot.js')

var bot = new Bot(process.env.DISCORD_TOKEN);
    
bot.connect();
