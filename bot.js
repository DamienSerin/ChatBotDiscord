"use strict";

const Discord = require('discord.js');
var messageHandler = require('./message.js');

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
        
        

        let mentions = message.mentions.users.array();
        if(message.channel.type == 'dm' || message.mentions.users.has(self.bot.user.id)){
            messageHandler.handleMessage(message, self.bot);
        }
    }
    
    self.onPresenceUpdate = function(oldMember, newMember){
        if(newMember.user.username == "bramas"){
            if(oldMember.presence.status == 'offline' && newMember.presence.status == "online"){
                newMember.sendMessage("Bonjour maitre, je suis le bot de Sandra et de Damien, que puis-je faire pour vous aujourd'hui?")
               // console.log("reconnect");
            }
        }
    }

}
