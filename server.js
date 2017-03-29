var Bot = require('./bot.js')

var bot = new Bot({
        	token: process.env.TOKEN,
            name: 'patate_bot'
        });

    bot.connect();