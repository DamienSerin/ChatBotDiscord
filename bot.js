"use strict";

/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/
// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
//const bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
//const token = process.env.DISCORD_TOKEN;
module.exports = function(params) {
    this.bot = null;
    var self = this;
    self.token = params;
    this.connect = function(){
        console.log(self.token);
        self.bot = new Discord.Client();
        self.bot.login(self.token);
        self.bot.on('ready', self.onReady);
        self.bot.on('message', self.onMessage);
    }
    
    self.onReady = function() {
        console.log('I am ready!');
    }  
    
    self.onMessage = function(message) {
        if(message.author.bot){
            return;
        }
        if(message.content === 'ping'){
            message.channel.sendMessage('pong');
        }
    }

}
// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.


// create an event listener for messages
/*bot.on('message', message => {
  // if the message is "ping",
  if (message.content === 'ping') {
    // send "pong" to the same channel.
    message.channel.sendMessage('pong');
  }
});*/
