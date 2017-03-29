"use strict";

/*
  A FAIRE: ne pas oublier de tout séparer dans des fichiers différents (répartis par api)
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
        self.bot = new Discord.Client();
        self.bot.login(self.token);
        self.bot.on('ready', self.onReady);
        self.bot.on('message', self.onMessage);
        self.bot.on('presenceUpdate', self.onPresenceUpdate);
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
        
        if(message.channel.type == 'dm'){
            
        }else if(message.isMemberMentioned(self.bot.user)){ // ca plante a voir
                message.channel.sendMessage('Oui ?');
        }

        /*if(message.mentions.users.find('username', 'Damien_Bot') != null){
            console.log("olo " + message);
        }*/
        //console.log(message.mentions.users.get('username'));
    }
    
    self.onPresenceUpdate = function(oldMember, newMember){
       // console.log(oldMember.presence, '=>', newMember.presence);
        /* check la reconnection de l'user bramas et lui dit bonjour */
        //console.log(oldMember.user.username);
        if(newMember.user.username == "bramas"){
            if(oldMember.presence.status == 'offline' && newMember.presence.status == "online"){
                newMember.sendMessage("Bonjour maitre, je suis le bot de Sandra et de Damien, que puis-je faire pour vous aujourd'hui?")
               // console.log("reconnect");
            }
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
