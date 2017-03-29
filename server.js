var Bot = require('./bot.js')

var bot = new Bot(process.env.DISCORD_TOKEN);

    console.log("serv " + process.env.DISCORD_TOKEN);
    
    bot.connect();

//bot.login(bot.token);